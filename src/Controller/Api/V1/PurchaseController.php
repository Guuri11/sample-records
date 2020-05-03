<?php

namespace App\Controller\Api\V1;

use App\Entity\Purchase;
use App\Repository\ArtistRepository;
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
     * @return JsonResponse
     */
    public function index(Request $request, PurchaseRepository $purchaseRepository, ApiUtils $apiUtils) : JsonResponse
    {
        

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

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
     * @Route("/{id}", name="api_purchase_show", methods={"GET"})
     * @param Purchase $purchase
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Purchase $purchase, ApiUtils $apiUtils): JsonResponse
    {
        

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
     * @return JsonResponse
     */
    public function new(Request $request, UserRepository $userRepository, TicketRepository $ticketRepository,
                        ProductRepository $productRepository, ValidatorInterface $validator, ApiUtils $apiUtils): JsonResponse
    {
        

        $purchase = new Purchase();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }

        try {
            $purchase->setSerialNumber($data['serial_number']);
            $purchase->setDate(new \DateTime($data['date']));
            if($data['time'] !== "")
                $purchase->setTime(new \DateTime($data['time']));
            $purchase->setReceived(false);
            $purchase->setAddress($data['address']);
            if($data['town'] !== "")
                $purchase->setTown($data['town']);
            if($data['city'] !== "")
                $purchase->setCity($data['city']);
            $purchase->setCountry($data['country']);
            if($data['comment'] !== "")
                $purchase->setComment($data['comment']);
            if ($data['product'] !== "") {
                $purchase->addProduct($productRepository->find($data['product']));
            }
            if ($data['ticket'] !== null) {
                $purchase->addTicket($ticketRepository->find($data['ticket']));
            }
            $purchase->setFinalPrice($data['final_price']);
            $purchase->setUser($userRepository->find($data['user']));
            $purchase->setCreatedAt(new \DateTime());
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

    }


    /**
     * @Route("/edit/{id}", name="api_purchase_update", methods={"PUT"})
     * @param Request $request
     * @param Purchase $purchase
     * @param UserRepository $userRepository
     * @param TicketRepository $ticketRepository
     * @param ProductRepository $productRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Purchase $purchase, UserRepository $userRepository,
                        TicketRepository $ticketRepository, ProductRepository $productRepository,
                        ValidatorInterface $validator, ApiUtils $apiUtils): JsonResponse
    {
        

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();


        // Process data
        try {
            $purchase->setSerialNumber($data['serial_number']);
            $purchase->setDate(new \DateTime($data['date']));
            if($data['time'] !== "")
                $purchase->setTime(new \DateTime($data['time']));
            $purchase->setReceived(false);
            $purchase->setAddress($data['address']);
            if($data['town'] !== "")
                $purchase->setTown($data['town']);
            if($data['city'] !== "")
                $purchase->setCity($data['city']);
            $purchase->setCountry($data['country']);
            if($data['comment'] !== "")
                $purchase->setComment($data['comment']);
            if ($data['product'] !== "") {
                $purchase->addProduct($productRepository->find($data['product']));
            }
            if ($data['ticket'] !== "") {
                $purchase->addTicket($ticketRepository->find($data['ticket']));
            }
            $purchase->setFinalPrice($data['final_price']);
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

        $apiUtils->successResponse("¡Compra editado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
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
    }

    /**
     * @Route("/buy", name="api_purchase_buy", methods={"POST"})
     * @param Request $request
     * @param ProductRepository $productRepository
     * @param TicketRepository $ticketRepository
     * @param ApiUtils $apiUtils
     * @param SerialNumber $serialNumber
     * @param PurchaseRepository $purchaseRepository
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function buy(Request $request, ProductRepository $productRepository, TicketRepository $ticketRepository,
                        ApiUtils $apiUtils, SerialNumber $serialNumber, PurchaseRepository $purchaseRepository,
                        UserRepository $userRepository): JsonResponse {

        

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
        if (empty($data["product"]) && empty($data["ticket"]))
            $errors["required_product"] = "Producto no encontrado";

        if (count($errors) > 0){
            $response['success'] = false;
            $response['message'] = "Ha habido un problema en el proceso de pago.";
            $response['errors'] = $errors;

            return new JsonResponse($response, Response::HTTP_BAD_REQUEST);
        }

        // Set user if the buy is from one logged
        if (!is_null($data['user']))
            $purchase->setUser($userRepository->find($data['user']));

        // Retrieve the product / ticket
        if (!is_null($data["product"])){
            $item = $productRepository->find(intval($data["product"]));
            if ($item !== ""){
                $check = true;
                while ($check){
                    $serialNumber->GenerateSerialNumber();
                    $check = $serialNumber->checkSerialNumber($purchaseRepository);
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
                        $purchase->addProduct($productRepository->find($data['product']));
                    }
                    $purchase->setFinalPrice($productRepository->find($data['product'])->getPrice());
                    $purchase->setComment(null);
                    $purchase->setCreatedAt(new \DateTime());
                    $purchase->setUpdatedAt(new \DateTime());
                }catch (Exception $e){
                    $apiUtils->errorResponse($e, "No se pudo insertar los valores a la compra", $purchase);
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
                }
            }
        }
        else{
            $item = $ticketRepository->find(intval($data["ticket"]));
            if ($item !== ""){
                $check = true;
                while ($check){
                    $serialNumber->GenerateSerialNumber();
                    $check = $serialNumber->checkSerialNumber($purchaseRepository);
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
                    $purchase->setComment(null);
                    if ($data['ticket'] !== "") {
                        $purchase->addTicket($ticketRepository->find($data['ticket']));
                    }
                    $purchase->setFinalPrice($ticketRepository->find($data['ticket'])->getPrice());

                    $purchase->setCreatedAt(new \DateTime());
                    $purchase->setUpdatedAt(new \DateTime());
                }catch (Exception $e){
                    $apiUtils->errorResponse($e, "No se pudo insertar los valores a la compra", $purchase);
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
                }
            }
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


        $log = new CustomLog("purchases","purchases");
        $log->info($data['name']."(".$data['email'].") ha realizado una compra: ".$purchase->getSerialNumber());
        $apiUtils->successResponse("¡Compra creada!",$purchase);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED, ['Content-type' => 'application/json']);
    }
}
