<?php

namespace App\Controller\Api\V1;

use App\Entity\Product;
use App\Repository\ArtistRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use App\Service\ApiUtils;
use App\Service\CustomFileUploader;
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
 * @SWG\ Response(
 *      response=401,
 *      description="Unauthorized"
 * )
 */
class ProductController extends AbstractController
{
    /**
     * @Route("/", name="api_product_retrieve", methods={"GET"})
     * @param Request $request
     * @param ProductRepository $productRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, ProductRepository $productRepository, ApiUtils $apiUtils) : JsonResponse
    {
        

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $productRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Productos no encontrados");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_product_show", methods={"GET"})
     * @param Product $product
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(Product $product, ApiUtils $apiUtils): JsonResponse
    {
        

        if ($product === ""){
            $apiUtils->notFoundResponse("Producto no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK", $product);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/new", name="api_product_new", methods={"POST"})
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

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $product = new Product();
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();
        
        try {
            $product->setName($data['name']);
            $product->setCategory($categoryRepository->find($data['category']));
            if($data['artist'] !== "")
                $product->setArtist($artistRepository->find($data['artist']));
            $product->setPrice($data['price']);
            if($data['discount'] !== "")
                $product->setDiscount($data['discount']);
            if($data['size'] !== "")
                $product->setSize($data['size']);
            $product->setStock($data['stock']);
            $product->setAvaiable($data['avaiable']);
            $product->setDescription($data['description']);
            $product->setImageName('product-default.png');
            $product->setImageSize(1234);
            $product->setCreatedAt(new \DateTime());
            $product->setUpdatedAt(new \DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al producto",$product);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
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

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Producto creado!",$product);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_product_update", methods={"PUT"})
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
        $this->denyAccessUnlessGranted('ROLE_ADMIN');


        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        try {
            if($data['name'] !== "")
                $product->setName($data['name']);
            if($data['category'] !== "")
                $product->setCategory($categoryRepository->find($data['category']));
            if($data['artist'] !== "")
                $product->setArtist($artistRepository->find($data['artist']));
            if($data['price'] !== "")
                $product->setPrice($data['price']);
            if($data['discount'] !== "")
                $product->setDiscount($data['discount']);
            if($data['size'] !== "")
                $product->setSize($data['size']);
            if($data['stock'] !== "")
                $product->setStock($data['stock']);
            if($data['avaiable'] !== "")
                $product->setAvaiable($data['avaiable']);
            if($data['description'] !== "")
                $product->setDescription($data['description']);
            $product->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores al producto",$product);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
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

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Producto editado!",$product);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_product_delete", methods={"DELETE"})
     * @param Request $request
     * @param Product $product
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, Product $product, ApiUtils $apiUtils): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            if ($product === ""){
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

    /**
     * @Route("/upload-img/{id}", name="api_product_upload_image", methods={"POST"})
     * @param Request $request
     * @param Product $product
     * @param ApiUtils $apiUtils
     * @param CustomFileUploader $fileUploader
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function uploadFile(Request $request, Product $product, ApiUtils $apiUtils, CustomFileUploader $fileUploader,
                               ValidatorInterface $validator): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get image
        $img = $_FILES['img'];

        // check if not empty
        if (!array_key_exists('img',$_FILES)) {
            $apiUtils->setFormErrors(["not_found"=>"No se ha enviado ninguna foto"]);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se ha enviado ninguna imagen",
                "errors" => $apiUtils->getFormErrors()
            ]);
            return new JsonResponse([$_FILES,$img], Response::HTTP_NO_CONTENT, ['Content-type' => 'application/json']);
        }

        // Upload image
        $errors = $fileUploader->uploadImage($img,CustomFileUploader::PRODUCT, $product->getImageName());

        // if could upload image

        // send response
        if (count($errors) === 0){
            try {
                $product->setImageName($fileUploader->getFileName());
                $product->setUpdatedAt(new \DateTime('now'));
            }catch (Exception $e){
                $apiUtils->errorResponse($e, "No se pudieron insertar los datos al product");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
            }

            // Check errors, if there is any error return it
            try {
                $apiUtils->validateData($validator, $product);
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
            }

            // Upload obj to the database
            try {
                $em = $this->getDoctrine()->getManager();
                $em->flush();
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, "No se pudo editar el producto en la bbdd");

                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }

            $apiUtils->successResponse("¡Subida de imagen con éxtio!",$product);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
        } else {
            $apiUtils->setFormErrors($errors);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se pudo subir la imagen",
                "errors" => $apiUtils->getFormErrors(),
                "results" => $product
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

    }
}
