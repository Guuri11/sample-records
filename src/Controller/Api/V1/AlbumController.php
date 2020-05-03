<?php

namespace App\Controller\Api\V1;

use App\Repository\ArtistRepository;
use App\Service\ApiUtils;
use DateTime;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Album;
use App\Repository\AlbumRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class AlbumController
 * @package App\Controller\V1
 * @Route("/api/v1.0/album")
 */
class AlbumController extends AbstractController
{
    /**
     * @Route("/", name="api_album_retrieve", methods={"GET"})
     * @param Request $request
     * @param AlbumRepository $albumRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request,AlbumRepository $albumRepository, ApiUtils $apiUtils) : JsonResponse
    {

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $albumRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Albums no encontrados");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_album_show", methods={"GET"})
     * @param Album $album
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Album $album, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }

        if ($album === ""){
            $apiUtils->notFoundResponse("Album no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $album);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_album_new", methods={"POST"})
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
    {

        $album = new Album();

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $album->setName($data['name']);
            $album->setArtist($artistRepository->find($data['artist']));
            $album->setPrice($data['price']);
            $album->setDuration($data['duration']);
            if ($data['imageFile'] !== "") {
                $album->setImageFile(new File($data['imageFile']));
                $album->setImageName($data['imageName']);
                $album->setImageSize($data['imageSize']);
            }else {
                $album->setImageName('artist-default.jpg');
                $album->setImageSize(234);
            }
            $album->setReleasedAt(new DateTime($data['released_at']));
            $album->setUpdatedAt(new DateTime());
            $album->setCreatedAt(new DateTime());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al album", $album);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        // Check errors, if there is any error return it
        try {
            $apiUtils->validateData($validator, $album);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($album);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el album en la bbdd", null, $album);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Album creado!",$album);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/edit/{id}", name="api_album_update", methods={"PUT"})
     * @param Request $request
     * @param Album $album
     * @param ArtistRepository $artistRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Album $album, ArtistRepository $artistRepository, ValidatorInterface $validator,
                         ApiUtils $apiUtils): JsonResponse
    {
        

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            if ($data['name'] !== "")
                $album->setName($data['name']);
            if ($data['artist'] !== "")
                $album->setArtist($artistRepository->find($data['artist']));
            if ($data['price'] !== "")
                $album->setPrice($data['price']);
            if ($data['duration'] !== "")
                $album->setDuration($data['duration']);
            if ($data['imageFile'] !== "") {
                $album->setImageFile(new File($data['imageFile']));
                $album->setImageName($data['imageName']);
                $album->setImageSize($data['imageSize']);
            }
            if ($data['released_at'] !== "")
                $album->setReleasedAt(new DateTime($data['released_at']));
            $album->setUpdatedAt(new DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores al album", $album);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$album);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar el album en la bbdd",null,$album);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Album editado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_album_delete", methods={"DELETE"})
     * @param Request $request
     * @param Album $album
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Album $album, ApiUtils $apiUtils): JsonResponse
    {
        

        try {
            if ($album === ""){
                $apiUtils->notFoundResponse("Album no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($album);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar el album de la base de datos",null,$album);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Album borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}