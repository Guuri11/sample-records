<?php

namespace App\Controller\Api\V1;

use App\Entity\Event;
use App\Repository\ArtistRepository;
use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class EventController
 * @package App\Controller\V1
 * @Route("/api/v1/event")
 */
class EventController extends AbstractController
{
    /**
     * @Route("/", name="api_event_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all events",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="event", ref=@Model(type=Event::class, groups={"serialized"}))
     *      )
     * )
     * @param EventRepository $eventRepository
     * @return JsonResponse
     */
    public function index(EventRepository $eventRepository) : JsonResponse
    {
        $event = $eventRepository->findAll();
        return new JsonResponse($event,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_event_show", methods={"GET"})
     * @param Event $event
     * @return JsonResponse
     */
    public function show(Event $event): JsonResponse
    {
        return new JsonResponse($event,Response::HTTP_OK);
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
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository): JsonResponse
    {
        $event = new Event();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $event->setName($data['name']);
            $event->setPlace($data['place']);
            $event->setCity($data['city']);
            $event->setCountry($data['country']);
            $event->setDate(new \DateTime($data['date']));
            $event->setPrefixSerialNumber($data['prefix_serial_number']);
            $event->setTicketQuantity($data['quantity_ticket']);
            $event->setArtist($artistRepository->find($data['artist']));
            $event->setImageName($data['img']);
            $event->setImageSize($data['img_size']);
            $event->setCreatedAt(new \DateTime());
            $event->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($event);
        $em->flush();

        return new JsonResponse($event, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_event_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Event object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="event", ref=@Model(type=Event::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Event $event, ArtistRepository $artistRepository): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $event->setName($data['name']);
            $event->setPlace($data['place']);
            $event->setCity($data['city']);
            $event->setCountry($data['country']);
            $event->setDate(new \DateTime($data['date']));
            $event->setPrefixSerialNumber($data['prefix_serial_number']);
            $event->setTicketQuantity($data['quantity_ticket']);
            $event->setArtist($artistRepository->find($data['artist']));
            $event->setImageName($data['img']);
            $event->setImageSize($data['img_size']);
            $event->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($event, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_artist_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Event $event): JsonResponse
    {
        if ($event === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($event);
        $entityManager->flush();

        return new JsonResponse($event, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
