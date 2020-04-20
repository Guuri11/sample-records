<?php

namespace App\Controller\Api\V1;

use App\Entity\Post;
use App\Entity\Tag;
use App\Repository\ArtistRepository;
use App\Repository\PostRepository;
use App\Repository\TagRepository;
use App\Service\ApiUtils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Exception;
use Symfony\Component\Validator\Validator\ValidatorInterface;


/**
 * Class PostController
 * @package App\Controller\V1
 * @Route("/api/v1.0/post")
 * @SWG\Tag(name="post")
 */
class PostController extends AbstractController
{
    /**
     * @Route("/", name="api_post_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get all posts",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="post", ref=@Model(type=Post::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param PostRepository $postRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request ,PostRepository $postRepository, ApiUtils $apiUtils) : JsonResponse
    {
        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $postRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Noticias no encontradas");
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_post_show", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get one post",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="post", ref=@Model(type=Post::class, groups={"serialized"}))
     *      )
     * )
     * @param Post $post
     * @return JsonResponse
     */
    public function show(Post $post, ApiUtils $apiUtils): JsonResponse
    {
        if ($post === null){
            $apiUtils->notFoundResponse("Noticia no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $post);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

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
     * @param ArtistRepository $artistRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @param TagRepository $tagRepository
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils, TagRepository $tagRepository): JsonResponse
    {
        $post = new Post();
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $post->setTitle($data['title']);
            $post->setDescription($data['description']);
            $post->setArtist($artistRepository->find($data['artist']));
            $post->setImageName($data['imageName']);
            $post->setImageSize($data['imageSize']);
            if($data['tag'] !== null){
                $tag = $tagRepository->find($data['tag']);
                $post->addTag($tag);
            }
            $post->setCreatedAt(new \DateTime());
            $post->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores de la noticia", $post);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }
        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$post);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($post);
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo crear el noticia en la bbdd",null,$post);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Noticia creada!",$post);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED,['Content-type'=>'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_post_update", methods={"PUT"})
     * @SWG\ Response(
     *      response=2002,
     *      description="updates a new Post object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="post", ref=@Model(type=Post::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Post $post
     * @param ArtistRepository $artistRepository
     * @param TagRepository $tagRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Post $post, ArtistRepository $artistRepository, TagRepository $tagRepository,
                        ValidatorInterface $validator, ApiUtils $apiUtils): JsonResponse
    {
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $post->setTitle($data['title']);
            $post->setDescription($data['description']);
            $post->setArtist($artistRepository->find($data['artist']));
            $post->setImageName($data['imageName']);
            $post->setImageSize($data['imageSize']);
            if($data['tag'] !== null){
                $tag = $tagRepository->find($data['tag']);
                $post->removeTag($post->getTag()->first());
                $post->addTag($tag);
            }
            $post->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores de la noticia",$post);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }
        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$post);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar la noticia en la bbdd",null,$post);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Noticia editada!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_post_delete", methods={"DELETE"})
     * @SWG\ Response(
     *      response=200,
     *      description="Deletes a post",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="post", ref=@Model(type=Post::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Post $post
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Post $post, ApiUtils $apiUtils): JsonResponse
    {
        try {
            if ($post === null){
                $apiUtils->notFoundResponse("Noticia no encontrada");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($post);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar la noticia de la base de datos",null,$post);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Noticia borrada!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}
