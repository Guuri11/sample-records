<?php

namespace App\Controller\Api\V1;

use App\Entity\Purchase;
use App\Repository\ArtistRepository;
use App\Repository\ProductRepository;
use App\Repository\PurchaseRepository;
use App\Repository\TicketRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * Class PurchaseController
 * @package App\Controller\V1
 * @Route("/api/v1/purchase")
 */
class PurchaseController extends AbstractController
{
    /**
     * @Route("/", name="api_purchase_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all purchases",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="purchase", ref=@Model(type=Purchase::class, groups={"serialized"}))
     *      )
     * )
     * @param PurchaseRepository $purchaseRepository
     * @return JsonResponse
     */
    public function index(PurchaseRepository $purchaseRepository) : JsonResponse
    {
        $purchase = $purchaseRepository->findAll();
        return new JsonResponse($purchase,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_purchase_show", methods={"GET"})
     * @param Purchase $purchase
     * @return JsonResponse
     */
    public function show(Purchase $purchase): JsonResponse
    {
        return new JsonResponse($purchase,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_purchase_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Purchase object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="purchase", ref=@Model(type=Purchase::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository, UserRepository $userRepository,
                        TicketRepository $ticketRepository, ProductRepository $productRepository): JsonResponse
    {
        $purchase = new Purchase();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $purchase->setSerialNumber($data['serial_number']);
            $purchase->setDate(new \DateTime($data['date']));
            $purchase->setTime(new \DateTime($data['time']));
            $purchase->setReceived($data['received']);
            $purchase->setAddress($data['address']);
            $purchase->setTown($data['town']);
            $purchase->setCity($data['city']);
            $purchase->setCountry($data['country']);
            $purchase->setComment($data['comment']);
            $purchase->setFinalPrice($data['final_price']);
            $purchase->setUser($userRepository->find($data['user']));
            $purchase->setCreatedAt(new \DateTime());
            $purchase->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($purchase);
        $em->flush();

        return new JsonResponse($purchase, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_purchase_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Purchase object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="purchase", ref=@Model(type=Purchase::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Purchase $purchase, UserRepository $userRepository,
                        TicketRepository $ticketRepository, ProductRepository $productRepository): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $purchase->setSerialNumber($data['serial_number']);
            $purchase->setDate(new \DateTime($data['date']));
            $purchase->setTime(new \DateTime($data['time']));
            $purchase->setReceived($data['received']);
            $purchase->setAddress($data['address']);
            $purchase->setTown($data['town']);
            $purchase->setCity($data['city']);
            $purchase->setCountry($data['country']);
            $purchase->setComment($data['comment']);
            $purchase->setFinalPrice($data['final_price']);
            $purchase->setUser($userRepository->find($data['user']));
            // TODO: TAG & PRODUCT
            $purchase->setCreatedAt(new \DateTime('now'));
            $purchase->setUpdatedAt(new \DateTime('now'));
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($purchase, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_purchase_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Purchase $purchase): JsonResponse
    {
        if ($purchase === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($purchase);
        $entityManager->flush();

        return new JsonResponse($purchase, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
