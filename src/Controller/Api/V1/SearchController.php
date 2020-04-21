<?php

namespace App\Controller\Api\V1;

use App\Repository\ArtistRepository;
use App\Repository\EventRepository;
use App\Repository\PostRepository;
use App\Repository\ProductRepository;
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
 * Class SearchController
 * @package App\Controller\V1
 * @SWG\Tag(name="search")
 * @Route("/api/v1.0/search")
 */
class SearchController extends AbstractController
{
    /**
     * @Route("/", name="api_search_retrieve", methods={"POST"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get search request"
     * )
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @param EventRepository $eventRepository
     * @param PostRepository $postRepository
     * @param ProductRepository $productRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function getSearchRequest(Request $request, ArtistRepository $artistRepository, EventRepository $eventRepository,
                                     PostRepository $postRepository, ProductRepository $productRepository, ApiUtils $apiUtils) : JsonResponse
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

        $artists = $artistRepository->getSearchRequest($data['search']);
        $events = $eventRepository->getSearchRequest($data['search']);
        $posts = $postRepository->getSearchRequest($data['search']);
        $products = $productRepository->getSearchRequest($data['search']);

        $results = array_filter(["artists"=>$artists,"events"=>$events,"posts"=>$posts,"products"=>$products]);
        if (!$results){
            $response = [
                "succes"=>false,
                "message"=>"No se han encontrado resultados"];
            $apiUtils->setResponse($response);
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }
}