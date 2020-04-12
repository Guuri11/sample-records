<?php

namespace App\Controller\Api\V1;

use App\Entity\Album;
use App\Entity\Song;
use App\Repository\AlbumRepository;
use App\Repository\ArtistRepository;
use App\Repository\SongRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class SongController
 * @package App\Controller\V1
 * @Route("/api/v1/song")
 */
class SongController extends AbstractController
{
    /**
     * @Route("/", name="api_song_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all songs",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="song", ref=@Model(type=Song::class, groups={"serialized"}))
     *      )
     * )
     * @param SongRepository $songRepository
     * @return JsonResponse
     */
    public function index(SongRepository $songRepository) : JsonResponse
    {
        $song = $songRepository->findAll();
        return new JsonResponse($song,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_song_show", methods={"GET"})
     * @param Song $song
     * @return JsonResponse
     */
    public function show(Song $song): JsonResponse
    {
        return new JsonResponse($song,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_song_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Song object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="song", ref=@Model(type=Song::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository,
                        AlbumRepository $albumRepository): JsonResponse
    {
        $song = new Song();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $song->setName($data['name']);
            $song->setArtist($artistRepository->find($data['artist']));
            $song->setAlbum($albumRepository->find($data['album']));
            $song->setDuration($data['duration']);
            $song->setSongFileName($data['song_file']);
            $song->setVideoSrc($data['video_src']);
            $song->setReleasedAt(new \DateTime($data['released_at']));
            $song->setImageName($data['img']);
            $song->setImageSize($data['img_size']);
            $song->setCreatedAt(new \DateTime());
            $song->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($song);
        $em->flush();

        return new JsonResponse($song, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_song_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Song object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="song", ref=@Model(type=Song::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Song $song, ArtistRepository $artistRepository,
                         AlbumRepository $albumRepository): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $song->setName($data['name']);
            $song->setArtist($artistRepository->find($data['artist']));
            $song->setAlbum($albumRepository->find($data['album']));
            $song->setDuration($data['duration']);
            $song->setSongFileName($data['song_file']);
            $song->setVideoSrc($data['video_src']);
            $song->setReleasedAt(new \DateTime($data['released_at']));
            $song->setImageName($data['img']);
            $song->setImageSize($data['img_size']);
            $song->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($song, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_song_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Song $song): JsonResponse
    {
        if ($song === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($song);
        $entityManager->flush();

        return new JsonResponse($song, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
