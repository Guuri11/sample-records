<?php

namespace App\Controller\Api\V1;

use App\Entity\Product;
use App\Repository\ArtistRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
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
use Exception;


/**
 * Class ProductController
 * @package App\Controller\V1
 * @Route("/api/v1.0/product")
 * @SWG\Tag(name="product")
 */
class ProductController extends AbstractController
{
    /**
     * @Route("/", name="api_product_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get all products",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="product", ref=@Model(type=Product::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param ProductRepository $productRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, ProductRepository $productRepository, ApiUtils $apiUtils) : JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $productRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Productos no encontrados");
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_product_show", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get one product",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="product", ref=@Model(type=Product::class, groups={"serialized"}))
     *      )
     * )
     * @param Product $product
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Product $product, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }

        if ($product === null){
            $apiUtils->notFoundResponse("Producto no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $product);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/new", name="api_product_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new Product object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="product", ref=@Model(type=Product::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param ArtistRepository $artistRepository
     * @param CategoryRepository $categoryRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository,
                        CategoryRepository $categoryRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }

        $product = new Product();
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();
        
        try {
            $product->setName($data['name']);
            $product->setCategory($categoryRepository->find($data['category']));
            if($data['artist'] !== null)
                $product->setArtist($artistRepository->find($data['artist']));
            $product->setPrice($data['price']);
            $product->setDiscount($data['discount']);
            if($data['artist'] !== null)
                $product->setSize($data['size']);
            $product->setStock($data['stock']);
            $product->setAvaiable($data['avaiable']);
            $product->setDescription($data['description']);
            $product->setImageName($data['imageName']);
            $product->setImageSize($data['imageSize']);
            $product->setCreatedAt(new \DateTime());
            $product->setUpdatedAt(new \DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al producto",$product);
            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator, $product);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($product);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el producto en la bbdd", null, $product);

            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Producto creado!",$product);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_product_update", methods={"PUT"})
     * @SWG\ Response(
     *      response=200,
     *      description="updates a new Product object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="product", ref=@Model(type=Product::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Product $product
     * @param ArtistRepository $artistRepository
     * @param CategoryRepository $categoryRepository
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function edit(Request $request, Product $product, ArtistRepository $artistRepository,
                        CategoryRepository $categoryRepository, ValidatorInterface $validator,
                        ApiUtils $apiUtils): JsonResponse
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

        try {
            $product->setName($data['name']);
            $product->setCategory($categoryRepository->find($data['category']));
            $product->setArtist($artistRepository->find($data['artist']));
            $product->setPrice($data['price']);
            $product->setDiscount($data['discount']);
            $product->setSize($data['size']);
            $product->setStock($data['stock']);
            $product->setAvaiable($data['avaiable']);
            $product->setDescription($data['description']);
            $product->setImageName($data['img']);
            $product->setImageSize($data['img_size']);
            $product->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores al producto",$product);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }
        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$product);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar el producto en la bbdd",null,$product);

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Producto editado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_product_delete", methods={"DELETE"})
     * @SWG\ Response(
     *      response=200,
     *      description="Delete a product",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="product", ref=@Model(type=Product::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param Product $product
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Product $product, ApiUtils $apiUtils): JsonResponse
    {
        // Check Oauth
        if (!$apiUtils->isAuthorized()){
            $response = ["success"=>false,"message"=>"Autentificación fallida"];
            return new JsonResponse($response,400,['Content-type'=>'application/json']);
        }
        try {
            if ($product === null){
                $apiUtils->notFoundResponse("Producto no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($product);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar el producto de la base de datos",null,$product);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Producto borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }
}
