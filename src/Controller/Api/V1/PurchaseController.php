<?php

namespace App\Controller\Api\V1;

use App\Entity\Comment;
use App\Entity\Purchase;
use App\Repository\ArtistRepository;
use App\Repository\EventRepository;
use App\Repository\ProductRepository;
use App\Repository\PurchaseRepository;
use App\Repository\TicketRepository;
use App\Repository\UserRepository;
use App\Service\ApiUtils;
use App\Service\CustomLog;
use App\Utils\SerialNumber;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Validator\Constraints\DateTime;
use Exception;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use function Sodium\add;

/**
 * Class PurchaseController
 * @package App\Controller\V1
 * @Route("/api/v1.0/purchase")
 */
class PurchaseController extends AbstractController
{
    /**
     * @Route("/", name="api_purchase_retrieve", methods={"GET"})
     * @param Request $request
     * @param PurchaseRepository $purchaseRepository
     * @param ApiUtils $apiUtils
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function index(Request $request, PurchaseRepository $purchaseRepository,
                          ApiUtils $apiUtils, UserRepository $userRepository) : JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // check if the request is made by admin or a client, if its by a client only get his purchases
        if(!in_array("ROLE_ADMIN",$this->getUser()->getRoles())) {
            $params = $apiUtils->getParameters();
            $params['user'] = $userRepository->findOneBy(['email'=>$this->getUser()->getUsername()])->getId();
            $apiUtils->setParameters($params);
        }

        // Get result
        try {
            $results = $purchaseRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Compras no encontradas");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_purchase_show", methods={"GET"}, requirements={"id"="\d+"})
     * @param Purchase $purchase
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Purchase $purchase, ApiUtils $apiUtils): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        if ($purchase === ""){
            $apiUtils->notFoundResponse("Compra no encontrada");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $purchase);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_purchase_new", methods={"POST"})
     * @param Request $request
     * @param UserRepository $userRepository
     * @param TicketRepository $ticketRepository
     * @param ProductRepository $productRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @param SerialNumber $serialNumber
     * @param PurchaseRepository $purchaseRepository
     * @return JsonResponse
     */
    public function new(Request $request, UserRepository $userRepository, TicketRepository $ticketRepository,
                        ProductRepository $productRepository, ValidatorInterface $validator, ApiUtils $apiUtils,
                        SerialNumber $serialNumber, PurchaseRepository $purchaseRepository): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $purchase = new Purchase();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }

        // CSRF Protection process
        if (!empty($data["token"])) {
            // if token received is the same than original do process
            if (hash_equals($_SESSION["token"], $data["token"])) {
                try {
                    $check = true;
                    // Generate a serial number for the purchase
                    while ($check){
                        $serialNumber->setSerialNumber('');
                        $serialNumber->GenerateSerialNumber();
                        $check = $serialNumber->checkSerialNumberPurchase($purchaseRepository);
                    }
                    $purchase->setSerialNumber($serialNumber->getSerialNumber());

                    $purchase->setDate(new \DateTime($data['date']));
                    $purchase->setReceived(false);
                    $purchase->setAddress($data['address']);
                    if($data['town'] !== "")
                        $purchase->setTown($data['town']);
                    if($data['city'] !== "")
                        $purchase->setCity($data['city']);
                    $purchase->setCountry($data['country']);
                    // Set comment
                    if ($data['comment'] !== "") {
                        $comment = new Comment();
                        $comment->setComment($data['comment']);
                        $comment->setCreatedAt(new \DateTime());
                        $comment->setUpdatedAt(new \DateTime());
                        $comment->setPurchase($purchase);
                        $purchase->setComment($comment);
                    } else
                        $purchase->setComment(null);
                    if ($data['product'] !== "") {
                        $purchase->addProduct($productRepository->find($data['product']));
                    }
                    if ($data['ticket'] !== null) {
                        $purchase->addTicket($ticketRepository->find($data['ticket']));
                    }
                    $purchase->setFinalPrice($data['final_price']);
                    $purchase->setUser($userRepository->find($data['user']));
                    $purchase->setCreatedAt(new \DateTime());
                    $purchase->setTime( $purchase->getCreatedAt()->diff($purchase->getDate()) );
                    $purchase->setUpdatedAt(new \DateTime());
                }catch (\Exception $e){
                    $apiUtils->errorResponse($e, "No se pudo insertar los valores a la compra", $purchase);
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
                }
                // Check errors, if there is any error return it
                try {
                    $apiUtils->validateData($validator, $purchase);
                } catch (Exception $e) {
                    $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
                }

                // Upload obj to the database
                try {
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($purchase);
                    $em->flush();
                } catch (Exception $e) {
                    $apiUtils->errorResponse($e, "No se pudo crear la compra en la bbdd", null, $purchase);

                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
                }

                $apiUtils->successResponse("¡Compra creada!",$purchase);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
            }else {
                // Send error response if csrf token isn't valid
                $apiUtils->setResponse([
                    "success" => false,
                    "message" => "Validación no completada",
                    "errors" => []
                ]);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }
        }else {
            // Send error response if there's no csrf token
            $apiUtils->setResponse([
                "success" => false,
                "message" => "Validación no completada",
                "errors" => $data["token"]
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
    }


    /**
     * @Route("/edit/{id}", name="api_purchase_update", methods={"PUT"})
     * @param Request $request
     * @param Purchase $purchase
     * @param UserRepository $userRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Purchase $purchase, UserRepository $userRepository,
                        ValidatorInterface $validator, ApiUtils $apiUtils): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();


        // CSRF Protection process
        if (!empty($data["token"])) {
            // if token received is the same than original do process
            if (hash_equals($_SESSION["token"], $data["token"])) {
                // Process data
                try {
                    $purchase->setSerialNumber($data['serial_number']);
                    if($data['date'] !== "")
                        $purchase->setDate(new \DateTime($data['date']));
                    if($data['received'] !== "")
                        $purchase->setReceived($data['received']);
                    if ($purchase->getReceived())
                        $purchase->setTime( $purchase->getCreatedAt()->diff($purchase->getDate()) );
                    if($data['address'] !== "")
                        $purchase->setAddress($data['address']);
                    if($data['town'] !== "")
                        $purchase->setTown($data['town']);
                    if($data['city'] !== "")
                        $purchase->setCity($data['city']);
                    $purchase->setCountry($data['country']);
                    // Set comment
                    if ($data['comment'] !== "") {
                        $comment = new Comment();
                        $comment->setComment($data['comment']);
                        $comment->setCreatedAt(new \DateTime());
                        $comment->setUpdatedAt(new \DateTime());
                        $comment->setPurchase($purchase);
                        $purchase->setComment($comment);
                    }
                    if($data['final_price'] !== "")
                        $purchase->setFinalPrice($data['final_price']);
                    if($data['user'] !== "")
                        $purchase->setUser($userRepository->find($data['user']));
                    $purchase->setUpdatedAt(new \DateTime('now'));
                }catch (\Exception $e){
                    $apiUtils->errorResponse($e, "No se pudo actualizar los valores de la compra", $purchase);

                    return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
                }
                // Check errors, if there is any errror return it
                try {
                    $apiUtils->validateData($validator,$purchase);
                } catch (Exception $e) {
                    $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
                }

                // Update obj to the database
                try {
                    $em = $this->getDoctrine()->getManager();
                    $em->flush();
                }catch (Exception $e) {
                    $apiUtils->errorResponse($e,"No se pudo actualizar la compra en la bbdd",null,$purchase);

                    return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
                }

                $apiUtils->successResponse("¡Compra editada!", $purchase);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
            }else {
                // Send error response if csrf token isn't valid
                $apiUtils->setResponse([
                    "success" => false,
                    "message" => "Validación no completada",
                    "errors" => []
                ]);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }
        }else {
            // Send error response if there's no csrf token
            $apiUtils->setResponse([
                "success" => false,
                "message" => "Validación no completada",
                "errors" => $data["token"]
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
    }

    /**
     * @Route("/delete/{id}", name="api_purchase_delete", methods={"DELETE"})
     * @param Request $request
     * @param Purchase $purchase
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Purchase $purchase, ApiUtils $apiUtils): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // CSRF Protection process
        if (!empty($data["token"])) {
            // if token received is the same than original do process
            if (hash_equals($_SESSION["token"], $data["token"])) {
                try {
                    if ($purchase === ""){
                        $apiUtils->notFoundResponse("Compra no encontrada");
                        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
                    }
                    $entityManager = $this->getDoctrine()->getManager();
                    $entityManager->remove($purchase);
                    $entityManager->flush();

                }catch (Exception $e) {
                    $apiUtils->errorResponse($e,"No se pudo borrar la compra de la base de datos",null,$purchase);
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
                }

                $apiUtils->successResponse("¡Compra borrada!");
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
            }else {
                // Send error response if csrf token isn't valid
                $apiUtils->setResponse([
                    "success" => false,
                    "message" => "Validación no completada",
                    "errors" => []
                ]);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }
        }else {
            // Send error response if there's no csrf token
            $apiUtils->setResponse([
                "success" => false,
                "message" => "Validación no completada",
                "errors" => $data["token"]
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
    }

    /**
     * @Route("/monthlyearns", name="api_purchase_montly_earns", methods={"GET"})
     * @param PurchaseRepository $purchaseRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function getMonthlyEarns(PurchaseRepository $purchaseRepository,
                          ApiUtils $apiUtils) : JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get result
        try {
            $results = floatval($purchaseRepository->getMonthlyEarns()[0]['earns']);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Compras no encontradas");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }


    /**
     * @Route("/buy", name="api_purchase_buy", methods={"POST"})
     * @param Request $request
     * @param ProductRepository $productRepository
     * @param TicketRepository $ticketRepository
     * @param ApiUtils $apiUtils
     * @param EventRepository $eventRepository
     * @param SerialNumber $serialNumber
     * @param PurchaseRepository $purchaseRepository
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function buy(Request $request, ProductRepository $productRepository, TicketRepository $ticketRepository,
                        ApiUtils $apiUtils, EventRepository $eventRepository,SerialNumber $serialNumber,
                        PurchaseRepository $purchaseRepository, UserRepository $userRepository): JsonResponse {

        

        $response = [];
        $errors = [];
        $item = "";
        $purchase = new Purchase();

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();
        if ($data['email'] !== "")
            $data['email'] = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

        // Validate data
        if (empty($data['name']))
            $errors["required_name"] = "Por favor, indique su nombre";
        if (empty($data["email"])) {
            $errors["required_email"] = "Por favor, indique un correo electrónico";
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors["not_email"] = "Por favor, indique un correo electrónico";
        }
        if (empty($data["address"]))
            $errors["required_address"] = "Por favor, indique una dirección";
        if (empty($data["credit_card"]))
            $errors["required_address"] = "Por favor, indique una tarjeta de credito";
        elseif (strlen($data['credit_card']) < 15)
            $errors["credit_card"] = "Tarjeta de crédito no valida";
        if (empty($data["country"]))
            $errors["required_country"] = "Por favor, indique su país";
        if (empty($data["product"]) && empty($data["event"]))
            $errors["required_product"] = "Producto/s no encontrado";

        if (count($errors) > 0){
            $response['success'] = false;
            $response['message'] = "Ha habido un problema en el proceso de pago.";
            $response['error'] = $errors;

            return new JsonResponse($response, Response::HTTP_BAD_REQUEST);
        }

        // Set user if the buy is from one logged
        if ($this->getUser())
        $purchase->setUser($userRepository->findOneBy(['email'=>$this->getUser()->getUsername()]));

        // Retrieve the product / ticket
        if (($data["product"]) !== ""){
            $item = $productRepository->find(intval($data["product"]));

            // Check if product has stock
            if ($item->getStock() < 1) {
                $response['success'] = false;
                $response['message'] = "Ha habido un problema en el proceso de pago.";
                $response['errors'] = ["no_stock"=>"El producto no está disponible"];

                return new JsonResponse($response, Response::HTTP_BAD_REQUEST);
            }

            if ($item !== ""){
                $check = true;
                // Generate a serial number for the purchase
                while ($check){
                    $serialNumber->setSerialNumber('');
                    $serialNumber->GenerateSerialNumber();
                    $check = $serialNumber->checkSerialNumberPurchase($purchaseRepository);
                }
                try {
                    $purchase->setSerialNumber($serialNumber->getSerialNumber());
                    $date = new \DateTime('now');
                    $date->add(new \DateInterval('P2D'));
                    $purchase->setDate($date);
                    $purchase->setReceived(false);
                    $purchase->setAddress($data['address']);
                    if($data['town'] !== "")
                        $purchase->setTown($data['town']);
                    if($data['city'] !== "")
                        $purchase->setCity($data['city']);
                    $purchase->setCountry($data['country']);

                    if ($data['product'] !== "") {
                        $purchase->addProduct($item);
                    }
                        $purchase->setComment(null);
                    // Apply discount if user is loggued
                    $purchase->getUser() ?
                        $purchase->setFinalPrice(($item->getPrice())*0.95)
                        :
                        $purchase->setFinalPrice($item->getPrice());
                    $purchase->setCreatedAt(new \DateTime());
                    $purchase->setUpdatedAt(new \DateTime());

                    // Update product stock
                    $item->setStock($item->getStock()-1);

                    // Update the product to unavailable if there's no more in stock
                    if ($item->getStock() === 0)
                        $item->setAvaiable(false);
                    $item->setUpdatedAt(new \DateTime());

                }catch (Exception $e){
                    $apiUtils->errorResponse($e, "No se pudo insertar los valores a la compra");
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
                }
            }
        }
        else{
            // Select an available ticket of the event that the user wants to buy, if there isn't tickets throw a error
            try {
                $item = $ticketRepository->getRequestResult(["event"=>$data["event"],"last"=>1, "avaible"=>1]);
            } catch (Exception $e){
                $apiUtils->errorResponse($e, "No quedan más entradas, lo sentimos", null, $purchase);

                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }

            $check = true;
            // Generate a serial number for the purchase
            while ($check){
                $serialNumber->setSerialNumber('');
                $serialNumber->GenerateSerialNumber();
                $check = $serialNumber->checkSerialNumberPurchase($purchaseRepository);
            }
            try {
                $purchase->setSerialNumber($serialNumber->getSerialNumber());
                $date = new \DateTime('now');
                $date->add(new \DateInterval('P2D'));
                $purchase->setDate($date);
                $purchase->setReceived(false);
                $purchase->setAddress($data['address']);
                if($data['town'] !== "")
                    $purchase->setTown($data['town']);
                if($data['city'] !== "")
                    $purchase->setCity($data['city']);
                $purchase->setCountry($data['country']);
                if ($data['event'] !== "") {
                    $purchase->addTicket($item[0]);
                }
                // Apply discount if user is loggued
                $purchase->getUser() ?
                    $purchase->setFinalPrice(($item[0]->getPrice())*0.95)
                    :
                    $purchase->setFinalPrice($item[0]->getPrice());
                $purchase->setCreatedAt(new \DateTime());
                $purchase->setUpdatedAt(new \DateTime());

                // Update ticket data as sold
                $item[0]->setSold(true);
                $item[0]->setUpdatedAt(new \DateTime());

                // reduce the quantity of event's tickets available
                $event = $eventRepository->find(intval($data["event"]));
                $event->setTicketQuantity($event->getTicketQuantity()-1);
                $event->setUpdatedAt(new \DateTime());
            }catch (Exception $e){
                $apiUtils->errorResponse($e, "No se pudo insertar los valores a la compra");
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }
        }

        // Set comment
        if ($data['comment'] !== "") {
            $comment = new Comment();
            $comment->setComment($data['comment']);
            $comment->setCreatedAt(new \DateTime());
            $comment->setUpdatedAt(new \DateTime());
            $comment->setPurchase($purchase);
            $purchase->setComment($comment);
        }else
            $purchase->setComment(null);

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($purchase);
            if ($data['comment'] !== "")
                $em->persist($comment);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear la compra en la bbdd", null, $purchase);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }


        $log = new CustomLog("purchases","purchases");
        $log->info($data['name']."(".$data['email'].") ha realizado una compra: ".$purchase->getSerialNumber());
        $apiUtils->successResponse("¡Compra creada!",$purchase);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED, ['Content-type' => 'application/json']);
    }
}
