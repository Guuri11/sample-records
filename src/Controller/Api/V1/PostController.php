<?php

namespace App\Controller\Api\V1;

use App\Entity\Post;
use App\Entity\Tag;
use App\Repository\ArtistRepository;
use App\Repository\PostRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class PostController
 * @package App\Controller\V1
 * @Route("/api/v1/post")
 */
class PostController extends AbstractController
{
    /**
     * @Route("/", name="api_post_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all posts",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="post", ref=@Model(type=Post::class, groups={"serialized"}))
     *      )
     * )
     * @param PostRepository $postRepository
     * @return JsonResponse
     */
    public function index(PostRepository $postRepository) : JsonResponse
    {
        $post = $postRepository->findAll();
        return new JsonResponse($post,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_post_show", methods={"GET"})
     * @param Post $post
     * @return JsonResponse
     */
    public function show(Post $post): JsonResponse
    {
        return new JsonResponse($post,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_post_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Post object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="post", ref=@Model(type=Post::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository): JsonResponse
    {
        $post = new Post();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }

        // TODO: TAGS
        try {
            $post->setTitle($data['title']);
            $post->setDescription($data['description']);
            $post->setArtist($artistRepository->find($data['artist']));
            $post->setImageName($data['img']);
            $post->setImageSize($data['img_size']);
            $post->setCreatedAt(new \DateTime());
            $post->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($post);
        $em->flush();

        return new JsonResponse($post, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_post_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Post object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="post", ref=@Model(type=Post::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Post $post, ArtistRepository $artistRepository): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $post->setTitle($data['title']);
            $post->setDescription($data['description']);
            $post->setArtist($artistRepository->find($data['artist']));
            $post->setImageName($data['img']);
            $post->setImageSize($data['img_size']);
            $post->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($post, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_artist_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Post $post): JsonResponse
    {
        if ($post === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($post);
        $entityManager->flush();

        return new JsonResponse($post, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
