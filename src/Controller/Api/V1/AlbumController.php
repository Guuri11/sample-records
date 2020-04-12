<?php

namespace App\Controller\Api\V1;

use App\Repository\ArtistRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Album;
use App\Repository\AlbumRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class AlbumController
 * @package App\Controller\V1
 * @Route("/api/v1/album")
 */
class AlbumController extends AbstractController
{
    /**
     * @Route("/", name="api_album_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all albums",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="album", ref=@Model(type=Album::class, groups={"serialized"}))
     *      )
     * )
     * @param AlbumRepository $albumRepository
     * @return JsonResponse
     */
    public function index(AlbumRepository $albumRepository) : JsonResponse
    {
        $albums = $albumRepository->findAll();
        return new JsonResponse($albums,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_artist_show", methods={"GET"})
     * @param Album $album
     * @return JsonResponse
     */
    public function show(Album $album): JsonResponse
    {
        return new JsonResponse($album,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_album_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Album object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="album", ref=@Model(type=Album::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository): JsonResponse
    {
        $album = new Album();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $album->setName($data['name']);
            $album->setArtist($artistRepository->find($data['artist']));
            $album->setPrice($data['price']);
            $album->setDuration($data['duration']);
            $album->setImageName($data['img']);
            $album->setImageSize($data['img_size']);
            $album->setReleasedAt(new \DateTime($data['released_at']));
            $album->setCreatedAt(new \DateTime());
            $album->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($album);
        $em->flush();

        return new JsonResponse($album, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_album_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Album object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="album", ref=@Model(type=Album::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Album $album, ArtistRepository $artistRepository): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $album->setName($data['name']);
            $album->setArtist($artistRepository->find($data['artist']));
            $album->setPrice($data['price']);
            $album->setDuration($data['duration']);
            $album->setImageName($data['img']);
            $album->setImageSize($data['img_size']);
            $album->setReleasedAt(new \DateTime($data['released_at']));
            $album->setCreatedAt(new \DateTime());
            $album->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($album, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_album_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Album $album): JsonResponse
    {
        if ($album === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($album);
        $entityManager->flush();

        return new JsonResponse($album, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
