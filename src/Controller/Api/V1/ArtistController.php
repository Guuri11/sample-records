<?php

namespace App\Controller\Api\V1;

use App\Entity\Artist;
use App\Repository\ArtistRepository;
use App\Service\ApiUtils;
use App\Service\CustomFileUploader;
use DateTime;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class ArtistController
 * @package App\Controller\V1
 * @Route("/api/v1.0/artist")
 */
class ArtistController extends AbstractController
{
    /**
     * @Route("/", name="api_artist_retrieve", methods={"GET"})
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, ArtistRepository $artistRepository, ApiUtils $apiUtils) : JsonResponse
    {


        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $artistRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Artistas no encontrados");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_artist_show", methods={"GET"}, requirements={"id"="\d+"})
     * @param Artist $artist
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Artist $artist, ApiUtils $apiUtils): JsonResponse
    {
        

        if ($artist === ""){
            $apiUtils->notFoundResponse("Artista no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $artist);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{alias}", name="api_artist_show_alias", methods={"GET"})
     * @param Artist $artist
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function showByAlias(Artist $artist, ApiUtils $apiUtils): JsonResponse
    {


        if ($artist === ""){
            $apiUtils->notFoundResponse("Artista no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $artist);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_artist_new", methods={"POST"})
     * @param Request $request
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function new(Request $request, ValidatorInterface $validator, ApiUtils $apiUtils): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $artist = new Artist();
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));;
        $data = $apiUtils->getData();

        // CSRF Protection process
        if (!empty($data["token"])) {
            // if token received is the same than original do process
            if (hash_equals($_SESSION["token"], $data["token"])) {

                // Process data
                try {
                    if ($data['name'] !== "")
                        $artist->setName($data['name']);
                    $artist->setAlias($data['alias']);
                    if ($data['surname'] !== "")
                        $artist->setSurname($data['surname']);
                    if ($data['is_from'] !== "")
                        $artist->setIsFrom($data['is_from']);
                    $artist->setBio($data['bio']);
                    if ($data['birth'] !== "")
                        $artist->setBirth(New DateTime($data['birth']));
                    $artist->setImageName('artist-default.png');
                    $artist->setImageSize(123);
                    $artist->setCreatedAt(new DateTime());
                    $artist->setUpdatedAt(new DateTime());
                }catch (Exception $e){
                    $apiUtils->errorResponse($e, "No se pudo insertar los valores al artista", $artist);
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
                }

                // Check errors, if there is any errror return it
                try {
                    $apiUtils->validateData($validator, $artist);
                } catch (Exception $e) {
                    $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
                }

                // Upload obj to the database
                try {
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($artist);
                    $em->flush();
                }catch (Exception $e) {
                    $apiUtils->errorResponse($e, "No se pudo crear el artista en la bbdd", null, $artist);

                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
                }

                $apiUtils->successResponse("¡Artista creado!",$artist);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);

            }else {
                // Send error response if csrf token isn't valid
                $apiUtils->setResponse([
                    "success" => false,
                    "message" => "Validación no completada",
                    "errors" => []
                ]);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }
        }else {
            // Send error response if there's no csrf token
            $apiUtils->setResponse([
                "success" => false,
                "message" => "Validación no completada",
                "errors" => $data["token"]
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
    }


    /**
     * @Route("/edit/{id}", name="api_artist_update", methods={"PUT"})
     * @param Request $request
     * @param Artist $artist
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Artist $artist, ValidatorInterface $validator,
                         ApiUtils $apiUtils): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');


        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // CSRF Protection process
        if (!empty($data["token"])) {
            // if token received is the same than original do process
            if (hash_equals($_SESSION["token"], $data["token"])) {

                // Process data
                try {
                    if ($data['name'] !== "")
                        $artist->setName($data['name']);
                    if ($data['aliass'] !== "")
                        $artist->setAlias($data['alias']);
                    $artist->setSurname($data['surname']);
                    $artist->setIsFrom($data['is_from']);
                    $artist->setBio($data['bio']);
                    if ($data['birth'] !== "")
                        $artist->setBirth(New DateTime($data['birth']));
                    $artist->setUpdatedAt(new DateTime());
                }catch (Exception $e){
                    $apiUtils->errorResponse($e, "No se pudo actualizar los valores del artista", $artist);

                    return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
                }

                // Check errors, if there is any errror return it
                try {
                    $apiUtils->validateData($validator, $artist);
                } catch (Exception $e) {
                    $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
                }

                // Update obj to the database
                try {
                    $em = $this->getDoctrine()->getManager();
                    $em->flush();
                }catch (Exception $e) {
                    $apiUtils->errorResponse($e,"No se pudo actualizar el artista en la bbdd",null,$artist);
                    return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
                }

                $apiUtils->successResponse("¡Artista editado!",$artist);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);

            }else {
                // Send error response if csrf token isn't valid
                $apiUtils->setResponse([
                    "success" => false,
                    "message" => "Validación no completada",
                    "errors" => []
                ]);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }
        }else {
            // Send error response if there's no csrf token
            $apiUtils->setResponse([
                "success" => false,
                "message" => "Validación no completada",
                "errors" => $data["token"]
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
    }

    /**
     * @Route("/delete/{id}", name="api_artist_delete", methods={"DELETE"})
     * @param Request $request
     * @param Artist $artist
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Artist $artist, ApiUtils $apiUtils): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // CSRF Protection process
        if (!empty($data["token"])) {
            // if token received is the same than original do process
            if (hash_equals($_SESSION["token"], $data["token"])) {

                try {
                    if ($artist === ""){
                        $apiUtils->notFoundResponse("Artista no encontrado");
                        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
                    }
                    $entityManager = $this->getDoctrine()->getManager();
                    $entityManager->remove($artist);
                    $entityManager->flush();

                }catch (Exception $e) {
                    $apiUtils->errorResponse($e,"No se pudo borrar el artista de la base de datos",null,$artist);
                    return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
                }

                $apiUtils->successResponse("¡Artista borrado!");
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);

            }else {
                // Send error response if csrf token isn't valid
                $apiUtils->setResponse([
                    "success" => false,
                    "message" => "Validación no completada",
                    "errors" => []
                ]);
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }
        }else {
            // Send error response if there's no csrf token
            $apiUtils->setResponse([
                "success" => false,
                "message" => "Validación no completada",
                "errors" => $data["token"]
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
    }

    /**
     * @Route("/upload-img/{id}", name="api_artist_upload_image", methods={"POST"})
     * @param Request $request
     * @param Artist $artist
     * @param ApiUtils $apiUtils
     * @param CustomFileUploader $fileUploader
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function uploadFile(Request $request, Artist $artist, ApiUtils $apiUtils, CustomFileUploader $fileUploader,
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
        $errors = $fileUploader->uploadImage($img,CustomFileUploader::ARTIST, $artist->getImageName());

        // if could upload image

        // send response
        if (count($errors) === 0){
            try {
                $artist->setImageName($fileUploader->getFileName());
                $artist->setUpdatedAt(new \DateTime('now'));
            }catch (Exception $e){
                $apiUtils->errorResponse($e, "No se pudieron insertar los datos al artista");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
            }

            // Check errors, if there is any error return it
            try {
                $apiUtils->validateData($validator, $artist);
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
            }

            // Upload obj to the database
            try {
                $em = $this->getDoctrine()->getManager();
                $em->flush();
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, "No se pudo editar el artista en la bbdd");

                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }

            $apiUtils->successResponse("¡Subida de imagen con éxtio!",$artist);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
        } else {
            $apiUtils->setFormErrors($errors);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se pudo subir la imagen",
                "errors" => $apiUtils->getFormErrors(),
                "results" => $artist
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

    }
}
