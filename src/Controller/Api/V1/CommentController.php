<?php

namespace App\Controller\Api\V1;

use App\Entity\Comment;
use App\Repository\CommentRepository;
use App\Repository\EventRepository;
use App\Repository\PostRepository;
use App\Repository\ProductRepository;
use App\Repository\PurchaseRepository;
use App\Repository\UserRepository;
use App\Service\ApiUtils;
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
 * Class CommentController
 * @package App\Controller\V1
 * @Route("/api/v1.0/comment")
 */
class CommentController extends AbstractController
{
    /**
     * @Route("/", name="api_comment_retrieve", methods={"GET"})
     * @param Request $request
     * @param CommentRepository $commentRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, CommentRepository $commentRepository, ApiUtils $apiUtils) : JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_UNAUTHORIZED,['Content-type'=>'application/json']);
        }

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));


        // Get result
        try {
            $results = $commentRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Comentarios no encontrados");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_comment_show", methods={"GET"})
     * @param Comment $comment
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Comment $comment, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_UNAUTHORIZED,['Content-type'=>'application/json']);
        }

        if ($comment === ""){
            $apiUtils->notFoundResponse("Comentario no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $comment);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/new", name="api_comment_new", methods={"POST"})
     * @param Request $request
     * @param UserRepository $userRepository
     * @param EventRepository $eventRepository
     * @param ProductRepository $productRepository
     * @param PurchaseRepository $purchaseRepository
     * @param PostRepository $postRepository
     * @param ApiUtils $apiUtils
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function new(Request $request, UserRepository $userRepository,
                        EventRepository $eventRepository, ProductRepository $productRepository,
                        PurchaseRepository $purchaseRepository, PostRepository $postRepository,
                        ApiUtils $apiUtils, ValidatorInterface $validator): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_UNAUTHORIZED,['Content-type'=>'application/json']);
        }

        $comment = new Comment();
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();


        try {
            $comment->setComment($data['comment']);
            $comment->setUser($userRepository->find($data['user']));
            if (isset($data['event']))
                $comment->setEvent($eventRepository->find($data['event']));
            if (isset($data['post']))
                $comment->setPost($postRepository->find($data['post']));
            if (isset($data['product']))
                $comment->setProduct($productRepository->find($data['product']));
            if (isset($data['purchase']))
                $comment->setPurchase($purchaseRepository->find($data['purchase']));
            $comment->setCreatedAt(new \DateTime());
            $comment->setUpdatedAt(new \DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al comentario", $comment);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator, $comment);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($comment);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el comentario en la bbdd", null, $comment);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Comentario creado!",$comment);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_comment_update", methods={"PUT"})
     * @param Request $request
     * @param Comment $comment
     * @param UserRepository $userRepository
     * @param EventRepository $eventRepository
     * @param ProductRepository $productRepository
     * @param PurchaseRepository $purchaseRepository
     * @param ApiUtils $apiUtils
     * @param PostRepository $postRepository
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function edit(Request $request, Comment $comment, UserRepository $userRepository,
                         EventRepository $eventRepository, ProductRepository $productRepository,
                        PurchaseRepository $purchaseRepository, ApiUtils $apiUtils,
                         PostRepository $postRepository, ValidatorInterface $validator): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_UNAUTHORIZED,['Content-type'=>'application/json']);
        }

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        try {
            $comment->setComment($data['comment']);
            $comment->setUser($userRepository->find($data['user']));
            if (isset($data['event']))
                $comment->setEvent($eventRepository->find($data['event']));
            if (isset($data['post']))
                $comment->setPost($postRepository->find($data['post']));
            if (isset($data['product']))
                $comment->setProduct($productRepository->find($data['product']));
            if (isset($data['purchase']))
                $comment->setPurchase($purchaseRepository->find($data['purchase']));
            $comment->setUpdatedAt(new \DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores del comentario", $comment);
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$comment);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar el comentario en la bbdd",null,$comment);
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Comentario editado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_comment_delete", methods={"DELETE"})
     * @param Request $request
     * @param Comment $comment
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Comment $comment, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_UNAUTHORIZED,['Content-type'=>'application/json']);
        }

        try {
            if ($comment === ""){
                $apiUtils->notFoundResponse("Comentario no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($comment);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar el comentario de la base de datos",null,$comment);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Comentario borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}
