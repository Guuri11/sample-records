<?php

namespace App\Controller\Api\V1;

use App\Entity\Ticket;
use App\Repository\ArtistRepository;
use App\Repository\EventRepository;
use App\Repository\TicketRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class TicketController
 * @package App\Controller\V1
 * @Route("/api/v1/ticket")
 */
class TicketController extends AbstractController
{
    /**
     * @Route("/", name="api_ticket_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all tickets",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="ticket", ref=@Model(type=Ticket::class, groups={"serialized"}))
     *      )
     * )
     * @param TicketRepository $ticketRepository
     * @return JsonResponse
     */
    public function index(TicketRepository $ticketRepository) : JsonResponse
    {
        $ticket = $ticketRepository->findAll();
        return new JsonResponse($ticket,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_ticket_show", methods={"GET"})
     * @param Ticket $ticket
     * @return JsonResponse
     */
    public function show(Ticket $ticket): JsonResponse
    {
        return new JsonResponse($ticket,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_ticket_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Ticket object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="ticket", ref=@Model(type=Ticket::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request, EventRepository $eventRepository): JsonResponse
    {
        $ticket = new Ticket();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $ticket->setEvent($eventRepository->find($data['event']));
            $ticket->setSerialNumber($ticket->getEvent()->getPrefixSerialNumber().$data['serial_number']);
            $ticket->setPrice($data['price']);
            $ticket->setCreatedAt(new \DateTime());
            $ticket->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($ticket);
        $em->flush();

        return new JsonResponse($ticket, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_ticket_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Ticket object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="ticket", ref=@Model(type=Ticket::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Ticket $ticket, EventRepository $eventRepository): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $ticket->setEvent($eventRepository->find($data['event']));
            $ticket->setSerialNumber($ticket->getEvent()->getPrefixSerialNumber().$data['serial_number']);
            $ticket->setPrice($data['price']);
            $ticket->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($ticket, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_ticket_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Ticket $ticket): JsonResponse
    {
        if ($ticket === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($ticket);
        $entityManager->flush();

        return new JsonResponse($ticket, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
