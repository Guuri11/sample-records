<?php

namespace App\Controller\Api\V1;

use App\Entity\Comment;
use App\Repository\CommentRepository;
use App\Repository\EventRepository;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class CommentController
 * @package App\Controller\V1
 * @Route("/api/v1/comment")
 */
class CommentController extends AbstractController
{
    /**
     * @Route("/", name="api_comment_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all comments",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="comment", ref=@Model(type=Comment::class, groups={"serialized"}))
     *      )
     * )
     * @param CommentRepository $commentRepository
     * @return JsonResponse
     */
    public function index(CommentRepository $commentRepository) : JsonResponse
    {
        $comment = $commentRepository->findAll();
        return new JsonResponse($comment,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_comment_show", methods={"GET"})
     * @param Comment $comment
     * @return JsonResponse
     */
    public function show(Comment $comment): JsonResponse
    {
        return new JsonResponse($comment,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_comment_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Comment object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="comment", ref=@Model(type=Comment::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request, UserRepository $userRepository,
                        EventRepository $eventRepository, ProductRepository $productRepository): JsonResponse
    {
        $comment = new Comment();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $comment->setComment($data['comment']);
            $comment->setUser($userRepository->find($data['user']));
            if (isset($data['event']))
                $comment->setEvent($eventRepository->find($data['event']));
            if (isset($data['product']))
                $comment->setProduct($productRepository->find($data['product']));
            $comment->setCreatedAt(new \DateTime());
            $comment->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($comment);
        $em->flush();

        return new JsonResponse($comment, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_comment_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Comment object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="comment", ref=@Model(type=Comment::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Comment $comment, UserRepository $userRepository,
                         EventRepository $eventRepository, ProductRepository $productRepository): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $comment->setComment($data['comment']);
            $comment->setUser($userRepository->find($data['user']));
            if (isset($data['event']))
                $comment->setEvent($eventRepository->find($data['event']));
            if (isset($data['product']))
                $comment->setProduct($productRepository->find($data['product']));
            $comment->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($comment, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_artist_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Comment $comment): JsonResponse
    {
        if ($comment === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($comment);
        $entityManager->flush();

        return new JsonResponse($comment, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
