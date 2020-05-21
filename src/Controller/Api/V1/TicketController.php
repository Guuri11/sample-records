<?php

namespace App\Controller\Api\V1;

use App\Entity\Ticket;
use App\Repository\ArtistRepository;
use App\Repository\EventRepository;
use App\Repository\TicketRepository;
use App\Service\ApiUtils;
use App\Utils\SerialNumber;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Validator\Constraints as Assert;
use Exception;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class TicketController
 * @package App\Controller\V1
 * @Route("/api/v1.0/ticket")
 */
class TicketController extends AbstractController
{
    /**
     * @Route("/", name="api_ticket_retrieve", methods={"GET"})
     * @param Request $request
     * @param TicketRepository $ticketRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, TicketRepository $ticketRepository, ApiUtils $apiUtils) : JsonResponse
    {
        

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $ticketRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Tickets no encontrados");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/{id}", name="api_ticket_show", methods={"GET"})
     * @param Ticket $ticket
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Ticket $ticket, ApiUtils $apiUtils): JsonResponse
    {
        

        if ($ticket === ""){
            $apiUtils->notFoundResponse("Ticket no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $ticket);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/new", name="api_ticket_new", methods={"POST"})
     * @param Request $request
     * @param EventRepository $eventRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @param SerialNumber $serialNumber
     * @param TicketRepository $ticketRepository
     * @return JsonResponse
     */
    public function new(Request $request, EventRepository $eventRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils, SerialNumber $serialNumber, TicketRepository $ticketRepository): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $ticket = new Ticket();
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $ticket->setEvent($eventRepository->find($data['event']));

            $check = true;
            // Generate a serial number for the ticket
            while ($check){
                $serialNumber->setSerialNumber('');
                $serialNumber->GenerateSerialNumber();
                $check = $serialNumber->checkSerialNumberTicket($ticketRepository, $eventRepository->find($data['event'])->getPrefixSerialNumber());
            }

            $ticket->setSerialNumber($ticket->getEvent()->getPrefixSerialNumber().$serialNumber->getSerialNumber());
            $ticket->setPrice($data['price']);
            $ticket->setSold(false);
            $ticket->setCreatedAt(new \DateTime());
            $ticket->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al ticket",$ticket);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
        // Check errors, if there is any error return it
        try {
            $apiUtils->validateData($validator, $ticket);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($ticket);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el ticket en la bbdd", null, $ticket);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Ticket creado!",$ticket);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_ticket_update", methods={"PUT"})
     * @param Request $request
     * @param Ticket $ticket
     * @param EventRepository $eventRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Ticket $ticket, EventRepository $eventRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        try {
            $ticket->setEvent($eventRepository->find($data['event']));
            $ticket->setSerialNumber($ticket->getEvent()->getPrefixSerialNumber().$data['serial_number']);
            $ticket->setPrice($data['price']);
            $ticket->setSold($data['sold']);
            $ticket->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores al ticket", $ticket);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$ticket);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar el ticket en la bbdd",null,$ticket);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Ticket editado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_ticket_delete", methods={"DELETE"})
     * @param Request $request
     * @param Ticket $ticket
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Ticket $ticket, ApiUtils $apiUtils): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            if ($ticket === ""){
                $apiUtils->notFoundResponse("Ticket no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($ticket);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar el ticket de la base de datos",null,$ticket);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Ticket borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}
