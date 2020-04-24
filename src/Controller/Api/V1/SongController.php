<?php

namespace App\Controller\Api\V1;

use App\Entity\Song;
use App\Repository\AlbumRepository;
use App\Repository\ArtistRepository;
use App\Repository\SongRepository;
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
 * Class SongController
 * @package App\Controller\V1
 * @Route("/api/v1.0/song")
 */
class SongController extends AbstractController
{
    /**
     * @Route("/", name="api_song_retrieve", methods={"GET"})
     * @param Request $request
     * @param SongRepository $songRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request ,SongRepository $songRepository, ApiUtils $apiUtils) : JsonResponse
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
            $results = $songRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Canciones no encontradas");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_song_show", methods={"GET"})
     * @param Song $song
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Song $song, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_UNAUTHORIZED,['Content-type'=>'application/json']);
        }

        if ($song === ""){
            $apiUtils->notFoundResponse("Canción no encontrada");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $song);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_song_new", methods={"POST"})
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @param AlbumRepository $albumRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository,
                        AlbumRepository $albumRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_UNAUTHORIZED,['Content-type'=>'application/json']);
        }

        $song = new Song();
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();
        
        try {
            $song->setName($data['name']);
            $song->setArtist($artistRepository->find($data['artist']));
            if ($data['album'] !== "")
                $song->setAlbum($albumRepository->find($data['album']));
            $song->setDuration($data['duration']);
            $song->setSongFileName($data['song_file']);
            $song->setVideoSrc($data['video_src']);
            $song->setReleasedAt(new \DateTime($data['released_at']));
            if ($data['imageFile'] !== ""){
                $song->setImageFile($data['imageFile']);
                $song->setImageName($data['imageName']);
                $song->setImageSize($data['imageSize']);
            } else {
                $song->setImageName('song-default.png');
                $song->setImageSize(1234);
            }
            $song->setCreatedAt(new \DateTime());
            $song->setUpdatedAt(new \DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores a la canción", $song);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
        // Check errors, if there is any error return it
        try {
            $apiUtils->validateData($validator, $song);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($song);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear la canción en la bbdd", null, $song);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Canción creada!",$song);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_song_update", methods={"PUT"})
     * @param Request $request
     * @param Song $song
     * @param ArtistRepository $artistRepository
     * @param AlbumRepository $albumRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Song $song, ArtistRepository $artistRepository,
                         AlbumRepository $albumRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
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
            $song->setName($data['name']);
            $song->setArtist($artistRepository->find($data['artist']));
            if ($data['album'] !== "")
                $song->setAlbum($albumRepository->find($data['album']));
            $song->setDuration($data['duration']);
            $song->setSongFileName($data['song_file']);
            $song->setVideoSrc($data['video_src']);
            $song->setReleasedAt(new \DateTime($data['released_at']));
            if ($data['imageFile'] !== ""){
                $song->setImageFile($data['imageFile']);
                $song->setImageName($data['imageName']);
                $song->setImageSize($data['imageSize']);
            }
            $song->setUpdatedAt(new \DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores a la canción", $song);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$song);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar la canción en la bbdd",null,$song);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Canción editada!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_song_delete", methods={"DELETE"})
     * @param Request $request
     * @param Song $song
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Song $song, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,Response::HTTP_UNAUTHORIZED,['Content-type'=>'application/json']);
        }
        try {
            if ($song === ""){
                $apiUtils->notFoundResponse("Canción no encontrada");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($song);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar la canción de la base de datos",null,$song);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Canción borrada!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}
