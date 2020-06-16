<?php


namespace App\Controller\Api\V1;

use App\Service\ApiUtils;
use App\Service\TwitterService;
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
 * Class TwitterController
 * @package App\Controller\V1
 * @Route("/api/v1.0/twitter")
 */
class TwitterController extends AbstractController
{

    /**
     * @Route("/post", name="api_tw_post", methods={"POST"})
     * @param Request $request
     * @param ApiUtils $apiUtils
     * @param TwitterService $twitterService
     * @return JsonResponse
     */
    public function post(Request $request, ApiUtils $apiUtils, TwitterService $twitterService): JsonResponse
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

                // Post tweet and check if success
                if ($twitterService->postItem($data["text"], $data["image"]))
                    $apiUtils->setResponse([
                        "success"=>true,
                        "message"=>"",
                    ]);
                else
                    $apiUtils->setResponse([
                        "success"=>false,
                        "message"=>"No se pudo subir el tweet",
                    ]);
            }else {
                // Send error response if csrf token isn't valid
                $apiUtils->setResponse([
                    "success" => false,
                    "message" => "Validación no completada",
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

        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/events-tweets", name="api_tw_get", methods={"GET"})
     * @param Request $request
     * @param ApiUtils $apiUtils
     * @param TwitterService $twitterService
     * @return JsonResponse
     */
    public function getEventsTweets(Request $request, ApiUtils $apiUtils, TwitterService $twitterService): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $tweets = $twitterService->getEventTweets();

        if (count($tweets) === 0)
            $apiUtils->setResponse(
                [
                    "success"=>false,
                    "message"=>"No hay tweets"
                ]
            );
        else
            $apiUtils->setResponse(
                [
                    "success"=>true,
                    "message"=>"Tweets encontrados",
                    "results"=>$tweets
                ]
            );

        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

}