<?php

namespace App\Controller\Api\V1;

use App\Entity\Tag;
use App\Form\TagType;
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
 * Class TagController
 * @package App\Controller\V1
 * @SWG\Tag(name="tag")
 * @Route("/api/v1.0/tag")
 */
class TagController extends AbstractController
{
    /**
     * @Route("/", name="api_tag_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get all tags",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="tag", ref=@Model(type=Tag::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param TagRepository $tagRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, TagRepository $tagRepository, ApiUtils $apiUtils) : JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }
        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $tagRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Tags no encontrados");
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_tag_show", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get one tag",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="tag", ref=@Model(type=Tag::class, groups={"serialized"}))
     *      )
     * )
     * @param Tag $tag
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Tag $tag, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }

        if ($tag === null){
            $apiUtils->notFoundResponse("Tag no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$tag);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_tag_new", methods={"POST"})
     * @SWG\ Response(
     *      response=202,
     *      description="Creates a new Tag object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="tag", ref=@Model(type=Tag::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function new(Request $request, ValidatorInterface $validator, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }

        $tag = new Tag();
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();
        try {
            $tag->setTag($data['tag']);
            $tag->setCreatedAt(new \DateTime());
            $tag->setUpdatedAt(new \DateTime());
        } catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al tag", $tag);
            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        // Check errors, if there is any error return it
        try {
            $apiUtils->validateData($validator, $tag);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($tag);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el tag en la bbdd", null, $tag);

            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Tag creado!",$tag);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_tag_update", methods={"PUT"})
     * @SWG\ Response(
     *      response=201,
     *      description="updates a new Tag object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="tag", ref=@Model(type=Tag::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Tag $tag
     * @param ApiUtils $apiUtils
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function edit(Request $request, Tag $tag, ApiUtils $apiUtils, ValidatorInterface $validator): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        try {
            $tag->setTag($data['tag']);
            $tag->setUpdatedAt(new \DateTime());
        } catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo editar los valores del tag", $tag);
            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        // Update obj to the database
        try {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->flush();
        }catch (\Exception $e){
            $apiUtils->errorResponse($e,"No se pudo actualizar el tag en la bbdd",null,$tag);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Tag editado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_tag_delete", methods={"DELETE"})
     * @SWG\ Response(
     *      response=201,
     *      description="Delete a tag",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="tag", ref=@Model(type=Tag::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Tag $tag
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Tag $tag, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }

        try {
            if ($tag === null){
                $apiUtils->notFoundResponse("Tag no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($tag);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar el tag de la base de datos",null,$tag);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Tag borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}