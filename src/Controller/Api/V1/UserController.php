<?php

namespace App\Controller\Api\V1;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Encoder\JsonEncode;

/**
 * Class UserController
 * @package App\Controller\V1
 * @Route("/api/v1/user")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", name="api_user_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=201,
     *      description="Get all users",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function index(UserRepository $userRepository) : JsonResponse
    {
        $user = $userRepository->findAll();
        return new JsonResponse($user,Response::HTTP_OK);
    }

    /**
     * @Route("/{id}", name="api_user_show", methods={"GET"})
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        return new JsonResponse($user,Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="api_user_new", methods={"POST"})
     * @SWG\ Response(
     *      response=201,
     *      description="Creates a new User object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @return JsonResponse
     */
    public function new(Request $request): JsonResponse
    {
        $user = new User();
        $data = [];
        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        
        try {
            $user->setName($data['name']);
            $user->setSurname($data['surname']);
            $user->setEmail($data['email']);
            $user->setPassword($data['password']);
            $user->setRoles($data['roles']);
            $user->setAddress($data['address']);
            $user->setPostalCode($data['postal_code']);
            $user->setTown($data['town']);
            $user->setCity($data['city']);
            $user->setPhone($data['phone']);
            $user->setCreditCard($data['credit_card']);
            $user->setProfileImage($data['profile_image']);
            $user->setHeaderImage($data['header_image']);
            $user->setProfileSize($data['profile_size']);
            $user->setHeaderSize($data['header_size']);
            $user->setCreatedAt(new \DateTime());
            $user->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,Response::HTTP_BAD_REQUEST);
        }
        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        return new JsonResponse($user, Response::HTTP_CREATED);
    }


    /**
     * @Route("/edit/{id}", name="api_user_update", methods={"PUT"})
     *  @SWG\ Response(
     *      response=201,
     *      description="updates a new User object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     */
    public function edit(Request $request, User $user): JsonResponse
    {
        $data = [];

        if ($content = $request->getContent()){
            $data = json_decode($content,true);
        }
        try {
            $user->setName($data['name']);
            $user->setSurname($data['surname']);
            $user->setEmail($data['email']);
            $user->setPassword($data['password']);
            $user->setRoles($data['roles']);
            $user->setAddress($data['address']);
            $user->setPostalCode($data['postal_code']);
            $user->setTown($data['town']);
            $user->setCity($data['city']);
            $user->setPhone($data['phone']);
            $user->setCreditCard($data['credit_card']);
            $user->setProfileImage($data['profile_image']);
            $user->setHeaderImage($data['header_image']);
            $user->setProfileSize($data['profile_size']);
            $user->setHeaderSize($data['header_size']);
            $user->setUpdatedAt(new \DateTime());
        }catch (\Exception $e){
            $error['code'] = $e->getCode();
            $error['message'] = $e->getMessage();
            return new JsonResponse($error,400,['Content-type'=>'application/json']);
        }
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new JsonResponse($user, Response::HTTP_OK,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_user_delete", methods={"DELETE"})
     */
    public function delete(Request $request, User $user): JsonResponse
    {
        if ($user === null)
            return new JsonResponse(['message'=>'Link not found'],
                Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($user);
        $entityManager->flush();

        return new JsonResponse($user, Response::HTTP_OK,['Content-type'=>'application/json']);
    }
}
