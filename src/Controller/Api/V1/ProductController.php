<?php

namespace App\Controller\Api\V1;

use App\Entity\Product;
use App\Repository\ArtistRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class ProductController
 * @package App\Controller\V1
 * @Route("/api/v1/product")
 */
class ProductController extends AbstractController
{
    /**
     * @Route("/", name="api_product_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all products",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="product", ref=@Model(type=Product::class, groups={"serialized"}))
     *      )
     * )
     * @param ProductRepository $productRepository
     * @return JsonResponse
     */
    public function index(ProductRepository $productRepository) : JsonResponse
    {
        $product = $productRepository->findAll();
        return new JsonResponse($product,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_product_show", methods={"GET"})
     * @param Product $product
     * @return JsonResponse
     */
    public function show(Product $product): JsonResponse
    {
        return new JsonResponse($product,Response::HTTP_OK);
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
     * @return JsonResponse
     */
    public function new(Request $request, ArtistRepository $artistRepository,
                        CategoryRepository $categoryRepository): JsonResponse
    {
        $product = new Product();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
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
            $product->setCreatedAt(new \DateTime());
            $product->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($product);
        $em->flush();

        return new JsonResponse($product, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_product_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new Product object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="product", ref=@Model(type=Product::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, Product $product, ArtistRepository $artistRepository,
                        CategoryRepository $categoryRepository): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
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
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($product, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_product_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Product $product): JsonResponse
    {
        if ($product === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($product);
        $entityManager->flush();

        return new JsonResponse($product, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
