<?php

namespace App\Controller\Api\V1;

use App\Entity\Tag;
use App\Repository\ArtistRepository;
use App\Repository\TagRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class TagController
 * @package App\Controller\V1
 * @Route("/api/v1/tag")
 */
class TagController extends AbstractController
{
    /**
     * @Route("/", name="api_tag_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all tags",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="tag", ref=@Model(type=Tag::class, groups={"serialized"}))
     *      )
     * )
     * @param TagRepository $tagRepository
     * @return JsonResponse
     */
    public function index(TagRepository $tagRepository) : JsonResponse
    {
        $tag = $tagRepository->findAll();
        return new JsonResponse($tag,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_tag_show", methods={"GET"})
     * @param Tag $tag
     * @return JsonResponse
     */
    public function show(Tag $tag): JsonResponse
    {
        return new JsonResponse($tag,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_tag_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Tag object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="tag", ref=@Model(type=Tag::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request): JsonResponse
    {
        $tag = new Tag();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $tag->setTag($data['tag']);
            $tag->setCreatedAt(new \DateTime());
            $tag->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($tag);
        $em->flush();

        return new JsonResponse($tag, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_tag_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Tag object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="tag", ref=@Model(type=Tag::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Tag $tag): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $tag->setTag($data['tag']);
            $tag->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($tag, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_tag_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Tag $tag): JsonResponse
    {
        if ($tag === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($tag);
        $entityManager->flush();

        return new JsonResponse($tag, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
