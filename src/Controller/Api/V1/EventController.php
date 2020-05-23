<?php

namespace App\Controller\Api\V1;

use App\Entity\Event;
use App\Entity\Ticket;
use App\Repository\ArtistRepository;
use App\Repository\TicketRepository;
use App\Service\ApiUtils;
use App\Repository\EventRepository;
use App\Service\CustomFileUploader;
use App\Utils\SerialNumber;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class EventController
 * @package App\Controller\V1
 * @Route("/api/v1.0/event")
 */
class EventController extends AbstractController
{
    /**
     * @Route("/", name="api_event_retrieve", methods={"GET"})
     * @param Request $request
     * @param EventRepository $eventRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, EventRepository $eventRepository, ApiUtils $apiUtils) : JsonResponse
    {
        

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $eventRepository->getRequestResult($apiUtils->getParameters());
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, "Eventos no encontrados");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_event_show", methods={"GET"})
     * @param Event $event
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Event $event, ApiUtils $apiUtils): JsonResponse
    {
        

        if ($event === ""){
            $apiUtils->notFoundResponse("Evento no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $event);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/new", name="api_event_new", methods={"POST"})
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @param SerialNumber $serialNumber
     * @param TicketRepository $ticketRepository
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils, SerialNumber $serialNumber, TicketRepository $ticketRepository): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $event = new Event();
        // Get request data
        $apiUtils->getContent($request);

        // Database manager
        $em = $this->getDoctrine()->getManager();


        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $event->setName($data['name']);
            $event->setArtist($artistRepository->find($data['artist']));
            $event->setPlace($data['place']);
            $event->setCity($data['city']);
            $event->setCountry($data['country']);
            $event->setDate(new \DateTime($data['date']));
            $event->setPrefixSerialNumber($data['prefix_serial_number']);
            $event->setTicketQuantity($data['ticket_quantity']);
            $event->setImageName('default-event.png');
            $event->setImageSize(123);
            $event->setCreatedAt(new \DateTime());
            $event->setUpdatedAt(new \DateTime());

            // Create tickets
            for ( $quantity_idx = 0; $quantity_idx < $event->getTicketQuantity(); $quantity_idx++ ) {
                $ticket = new Ticket();
                $ticket->setEvent($event);

                $check = true;
                // Generate a serial number for the ticket
                while ($check){
                    $serialNumber->setSerialNumber('');
                    $serialNumber->GenerateSerialNumber();
                    $check = $serialNumber->checkSerialNumberTicket($ticketRepository, $event->getPrefixSerialNumber());
                }

                $ticket->setSerialNumber($ticket->getEvent()->getPrefixSerialNumber().$serialNumber->getSerialNumber());
                $ticket->setPrice($data['price']);
                $ticket->setSold(false);
                $ticket->setCreatedAt(new \DateTime());
                $ticket->setUpdatedAt(new \DateTime());

                // prepare to upload ticket to the data base
                $em->persist($ticket);
            }
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al evento", $event);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator, $event);
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em->persist($event);
            $em->flush();
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el evento en la bbdd", null, $event);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Evento creado!",$event);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_event_update", methods={"PUT"})
     * @param Request $request
     * @param Event $event
     * @param ArtistRepository $artistRepository
     * @param ValidatorInterface $validato
     * @param ApiUtils $apiUtils
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function edit(Request $request, Event $event, ArtistRepository $artistRepository, ValidatorInterface $validato,
                        ApiUtils $apiUtils, ValidatorInterface $validator): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $event->setName($data['name']);
            $event->setPlace($data['place']);
            if ($data['city'] !== "")
                $event->setCity($data['city']);
            $event->setCountry($data['country']);
            $event->setDate(new \DateTime($data['date']));
            $event->setPrefixSerialNumber($data['prefix_serial_number']);
            $event->setTicketQuantity($data['ticket_quantity']);
            $event->setArtist($artistRepository->find($data['artist']));
            $event->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator, $event);
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo editar el evento en la bbdd", null, $event);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Evento editado!",$event);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_event_delete", methods={"DELETE"})
     * @param Request $request
     * @param Event $event
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Event $event, ApiUtils $apiUtils): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            if ($event === ""){
                $apiUtils->notFoundResponse("Evento no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($event);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar el evento de la base de datos",null,$event);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Evento borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/upload-img/{id}", name="api_event_upload_image", methods={"POST"})
     * @param Request $request
     * @param Event $event
     * @param ApiUtils $apiUtils
     * @param CustomFileUploader $fileUploader
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function uploadFile(Request $request, Event $event, ApiUtils $apiUtils, CustomFileUploader $fileUploader,
                               ValidatorInterface $validator): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get image
        $img = $_FILES['img'];

        // check if not empty
        if (!array_key_exists('img',$_FILES)) {
            $apiUtils->setFormErrors(["not_found"=>"No se ha enviado ninguna foto"]);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se ha enviado ninguna imagen",
                "errors" => $apiUtils->getFormErrors()
            ]);
            return new JsonResponse([$_FILES,$img], Response::HTTP_NO_CONTENT, ['Content-type' => 'application/json']);
        }

        // Upload image
        $errors = $fileUploader->uploadImage($img,CustomFileUploader::EVENT, $event->getImageName());

        // if could upload image

        // send response
        if (count($errors) === 0){
            try {
                $event->setImageName($fileUploader->getFileName());
                $event->setUpdatedAt(new \DateTime('now'));
            }catch (Exception $e){
                $apiUtils->errorResponse($e, "No se pudieron insertar los datos al artista");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
            }

            // Check errors, if there is any error return it
            try {
                $apiUtils->validateData($validator, $event);
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
            }

            // Upload obj to the database
            try {
                $em = $this->getDoctrine()->getManager();
                $em->flush();
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, "No se pudo editar el evento en la bbdd");

                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }

            $apiUtils->successResponse("¡Subida de imagen con éxtio!",$event);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
        } else {
            $apiUtils->setFormErrors($errors);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se pudo subir la imagen",
                "errors" => $apiUtils->getFormErrors(),
                "results" => $event
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

    }
}
