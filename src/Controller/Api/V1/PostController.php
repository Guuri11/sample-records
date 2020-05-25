<?php

namespace App\Controller\Api\V1;

use App\Entity\Post;
use App\Entity\Tag;
use App\Repository\ArtistRepository;
use App\Repository\PostRepository;
use App\Repository\TagRepository;
use App\Service\ApiUtils;
use App\Service\CustomFileUploader;
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
 */
class PostController extends AbstractController
{
    /**
     * @Route("/", name="api_post_retrieve", methods={"GET"})
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
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_post_show", methods={"GET"})
     * @param Post $post
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Post $post, ApiUtils $apiUtils): JsonResponse
    {
        

        if ($post === ""){
            $apiUtils->notFoundResponse("Noticia no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $post);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/new", name="api_post_new", methods={"POST"})
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
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

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
            $post->setImageName('post-default.png');
            $post->setImageSize(123);
            if($data['tag'] !== ""){
                foreach ($data['tag'] as $tag) {
                    $tag = $tagRepository->find($tag);
                    $post->addTag($tag);
                }
            }
            $post->setCreatedAt(new \DateTime());
            $post->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores de la noticia", $post);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
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

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Noticia creada!",$post);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED,['Content-type'=>'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_post_update", methods={"PUT"})
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

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $post->setTitle($data['title']);
            $post->setDescription($data['description']);
            if($data['artist'] !== "")
                $post->setArtist($artistRepository->find($data['artist']));
            if($data['tag'] !== ""){
                $post->getTag()->clear();
                foreach ($data['tag'] as $tag) {
                    $tag = $tagRepository->find($tag);
                    $post->addTag($tag);
                }
            }
            $post->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores de la noticia",$post);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
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

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Noticia editada!", $post);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_post_delete", methods={"DELETE"})
     * @param Request $request
     * @param Post $post
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Post $post, ApiUtils $apiUtils): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            if ($post === ""){
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

    /**
     * @Route("/upload-img/{id}", name="api_post_upload_image", methods={"POST"})
     * @param Request $request
     * @param Post $post
     * @param ApiUtils $apiUtils
     * @param CustomFileUploader $fileUploader
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function uploadFile(Request $request, Post $post, ApiUtils $apiUtils, CustomFileUploader $fileUploader,
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
        $errors = $fileUploader->uploadImage($img,CustomFileUploader::POST, $post->getImageName());

        // if could upload image

        // send response
        if (count($errors) === 0){
            try {
                $post->setImageName($fileUploader->getFileName());
                $post->setUpdatedAt(new \DateTime('now'));
            }catch (Exception $e){
                $apiUtils->errorResponse($e, "No se pudieron insertar los datos al artista");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
            }

            // Check errors, if there is any error return it
            try {
                $apiUtils->validateData($validator, $post);
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
            }

            // Upload obj to the database
            try {
                $em = $this->getDoctrine()->getManager();
                $em->flush();
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, "No se pudo editar la noticia en la bbdd");

                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }

            $apiUtils->successResponse("¡Subida de imagen con éxtio!",$post);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
        } else {
            $apiUtils->setFormErrors($errors);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se pudo subir la imagen",
                "errors" => $apiUtils->getFormErrors(),
                "results" => $post
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

    }
}
