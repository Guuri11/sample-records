<?php

namespace App\Controller\Api\V1;

use App\Entity\Event;
use App\Repository\ArtistRepository;
use App\Service\ApiUtils;
use App\Repository\EventRepository;
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
 * @SWG\Tag(name="event")
 */
class EventController extends AbstractController
{
    /**
     * @Route("/", name="api_event_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get all events",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="event", ref=@Model(type=Event::class, groups={"serialized"}))
     *      )
     * )
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
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_event_show", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get one event",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="event", ref=@Model(type=Event::class, groups={"serialized"}))
     *      )
     * )
     * @param Event $event
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Event $event, ApiUtils $apiUtils): JsonResponse
    {
        if ($event === null){
            $apiUtils->notFoundResponse("Evento no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $event);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/new", name="api_event_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Event object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="event", ref=@Model(type=Event::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
    {
        $event = new Event();
        // Get request data
        $apiUtils->getContent($request);

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
            $event->setImageName($data['imageName']);
            $event->setImageSize($data['imageSize']);
            $event->setCreatedAt(new \DateTime());
            $event->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al evento", $event);
            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
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
            $em->persist($event);
            $em->flush();
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el evento en la bbdd", null, $event);

            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Evento creado!",$event);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_event_update", methods={"PUT"})
     * @SWG\ Response(
     *      response=202,
     *      description="updates a new Event object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="event", ref=@Model(type=Event::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Event $event
     * @param ArtistRepository $artistRepository
     * @param ValidatorInterface $validato
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Event $event, ArtistRepository $artistRepository, ValidatorInterface $validato,
                        ApiUtils $apiUtils): JsonResponse
    {
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $event->setName($data['name']);
            $event->setPlace($data['place']);
            if ($data['city'] !== null)
                $event->setCity($data['city']);
            $event->setCountry($data['country']);
            $event->setDate(new \DateTime($data['date']));
            $event->setPrefixSerialNumber($data['prefix_serial_number']);
            $event->setTicketQuantity($data['ticket_quantity']);
            $event->setArtist($artistRepository->find($data['artist']));
            $event->setImageName($data['imageName']);
            $event->setImageSize($data['imageSize']);
            $event->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($event, Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_event_delete", methods={"DELETE"})
     * @SWG\ Response(
     *      response=200,
     *      description="Delete a event",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="event", ref=@Model(type=Event::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Event $event
     * @return JsonResponse
     */
    public function delete(Request $request, Event $event): JsonResponse
    {
        if ($event === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($event);
        $entityManager->flush();

        return new JsonResponse($event, Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}
