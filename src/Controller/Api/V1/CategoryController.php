<?php

namespace App\Controller\Api\V1;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class CategoryController
 * @package App\Controller\V1
 * @Route("/api/v1/category")
 */
class CategoryController extends AbstractController
{
    /**
     * @Route("/", name="api_category_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all categories",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="category", ref=@Model(type=Category::class, groups={"serialized"}))
     *      )
     * )
     * @param CategoryRepository $categoryRepository
     * @return JsonResponse
     */
    public function index(CategoryRepository $categoryRepository) : JsonResponse
    {
        $category = $categoryRepository->findAll();
        return new JsonResponse($category,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_category_show", methods={"GET"})
     *
     */
    public function show(Category $category): JsonResponse
    {
        return new JsonResponse($category,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_category_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Category object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="category", ref=@Model(type=Category::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request): JsonResponse
    {
        $category = new Category();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $category->setName($data['name']);
            $category->setCreatedAt(new \DateTime());
            $category->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($category);
        $em->flush();

        return new JsonResponse($category, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_category_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Category object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="category", ref=@Model(type=Category::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Category $category): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $category->setName($data['name']);
            $category->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($category, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_artist_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Category $category): JsonResponse
    {
        if ($category === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($category);
        $entityManager->flush();

        return new JsonResponse($category, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
