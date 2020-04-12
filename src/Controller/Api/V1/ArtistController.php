<?php

namespace App\Controller\Api\V1;

use App\Entity\Artist;
use App\Repository\ArtistRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Album;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class ArtistController
 * @package App\Controller\V1
 * @Route("/api/v1/artist")
 */
class ArtistController extends AbstractController
{
    /**
     * @Route("/", name="api_artist_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all artists",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="artist", ref=@Model(type=Artist::class, groups={"serialized"}))
     *      )
     * )
     * @param ArtistRepository $artistRepository
     * @return JsonResponse
     */
    public function index(ArtistRepository $artistRepository) : JsonResponse
    {
        $artists = $artistRepository->findAll();
        return new JsonResponse($artists,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_artist_show", methods={"GET"})
     * @param Artist $artist
     * @return JsonResponse
     */
    public function show(Artist $artist): JsonResponse
    {
        return new JsonResponse($artist,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_artist_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Artist object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="artist", ref=@Model(type=Artist::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request): JsonResponse
    {
        $artist = new Artist();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $artist->setName($data['name']);
            $artist->setAlias($data['alias']);
            $artist->setSurname($data['surname']);
            $artist->setIsFrom($data['is_from']);
            $artist->setBio($data['bio']);
            $artist->setBirth(New \DateTime($data['birth']));
            $artist->setImageName($data['img']);
            $artist->setImageSize($data['img_size']);
            $artist->setCreatedAt(new \DateTime());
            $artist->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($artist);
        $em->flush();

        return new JsonResponse($artist, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_artist_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Artist object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="artist", ref=@Model(type=Artist::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Artist $artist): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $artist->setName($data['name']);
            $artist->setAlias($data['alias']);
            $artist->setSurname($data['surname']);
            $artist->setIsFrom($data['is_from']);
            $artist->setBio($data['bio']);
            $artist->setBirth(New \DateTime($data['birth']));
            $artist->setImageName($data['img']);
            $artist->setImageSize($data['img_size']);
            $artist->setCreatedAt(new \DateTime());
            $artist->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($artist, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_artist_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Artist $artist): JsonResponse
    {
        if ($artist === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($artist);
        $entityManager->flush();

        return new JsonResponse($artist, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
