<?php

namespace App\Controller\Api\V1;

use App\Repository\ArtistRepository;
use App\Repository\EventRepository;
use App\Repository\PostRepository;
use App\Repository\ProductRepository;
use App\Repository\SongRepository;
use App\Service\ApiUtils;
use DateTime;
use Doctrine\DBAL\DBALException;
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
 * Class SearchController
 * @package App\Controller\V1
 * @Route("/api/v1.0/search")
 */
class SearchController extends AbstractController
{
    /**
     * @Route("/", name="api_search_retrieve", methods={"GET"})
     *
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @param EventRepository $eventRepository
     * @param PostRepository $postRepository
     * @param ProductRepository $productRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     * @throws Exception
     */
    public function getSearchRequest(Request $request, ArtistRepository $artistRepository, EventRepository $eventRepository,
                                     PostRepository $postRepository, ProductRepository $productRepository, ApiUtils $apiUtils) : JsonResponse
    {
        $data['search'] = $request->query->get('search');
        $data['until'] = $request->query->has('until') ? $request->query->get('until'): null;
        $data['available'] = $request->query->has('available') ? $request->query->get('available'): null;

        $artists = $artistRepository->getSearchRequest($data['search']);
        $events = $eventRepository->getSearchRequest($data);
        $posts = $postRepository->getSearchRequest($data['search']);
        $products = $productRepository->getSearchRequest($data);

        $results = array_filter(["artists"=>$artists,"events"=>$events,"posts"=>$posts,"products"=>$products]);
        if (!$results){
            $response = [
                "succes"=>false,
                "message"=>"No se han encontrado resultados"];
            $apiUtils->setResponse($response);
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NO_CONTENT);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/last", name="api_search_last_retrieve", methods={"GET"})
     * @param Request $request
     * @param ApiUtils $apiUtils
     * @param AlbumRepository $albumRepository
     * @param SongRepository $songRepository
     * @param EventRepository $eventRepository
     * @param PostRepository $postRepository
     * @return JsonResponse
     */
    public function getLastTwo(Request $request, ApiUtils $apiUtils, AlbumRepository $albumRepository, SongRepository $songRepository,
                                EventRepository $eventRepository, PostRepository $postRepository) : JsonResponse
    {
        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $albums = $albumRepository->getRequestResult($apiUtils->getParameters());
            $events = $eventRepository->getRequestResult($apiUtils->getParameters());
            $posts = $postRepository->getRequestResult($apiUtils->getParameters());
            $songs = $songRepository->getRequestResult($apiUtils->getParameters());

            $resultsQuery = [$albums[0],$albums[1],$events[0],$events[1],$posts[0],$posts[1],$songs[0],$songs[1]];

            usort($resultsQuery, function ($obj1,$obj2){return $obj1->getCreatedAt() < $obj2->getCreatedAt();});

            $results = [$resultsQuery[0],$resultsQuery[1]];

        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Si resultados");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("OK",$resultsQuery);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }
}