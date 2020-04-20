<?php

namespace App\Controller\Api\V1;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use App\Service\ApiUtils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class CategoryController
 * @package App\Controller\V1
 * @Route("/api/v1.0/category")
 * @SWG\Tag(name="category")
 */
class CategoryController extends AbstractController
{
    /**
     * @Route("/", name="api_category_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get all categories",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="category", ref=@Model(type=Category::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param CategoryRepository $categoryRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, CategoryRepository $categoryRepository, ApiUtils $apiUtils) : JsonResponse
    {
        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $categoryRepository->getRequestResult($apiUtils->getParameters());
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, "Categorias no encontradas");
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }

        return new JsonResponse($results,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_category_show", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get one categories",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="category", ref=@Model(type=Category::class, groups={"serialized"}))
     *      )
     * )
     * @param Category $category
     * @return JsonResponse
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
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function new(Request $request, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
    {
        $category = new Category();

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();
        
        try {
            $category->setName($data['name']);
            $category->setCreatedAt(new \DateTime());
            $category->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores de la categoria", $category);
            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator, $category);
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($category);
            $em->flush();
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear la categoria en la bbdd", null, $category);

            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Categoria creada!",$category);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/edit/{id}", name="api_category_update", methods={"PUT"})
     * @SWG\ Response(
     *      response=200,
     *      description="Updates a new Category object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="category", ref=@Model(type=Category::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Category $category
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Category $category, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
    {
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        // Process data
        try {
            $category->setName($data['name']);
            $category->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores de la categoria", $category);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }

        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$category);
        } catch (\Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (\Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar la categoria en la bbdd",null,$category);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Categoria editada!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_category_delete", methods={"DELETE"})
     * @SWG\ Response(
     *      response=200,
     *      description="Deletes a category",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="category", ref=@Model(type=Category::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Category $category
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Category $category, ApiUtils $apiUtils): JsonResponse
    {
        try {
            if ($category === null){
                $apiUtils->notFoundResponse("Categoria no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($category);
            $entityManager->flush();

        }catch (\Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar la categoria de la base de datos",null,$category);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Categoria borrada!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}
