<?php

namespace App\Controller\Api\V1;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Service\ApiUtils;
use App\Service\CustomFileUploader;
use App\Service\CustomLog;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Exception;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class UserController
 * @package App\Controller\V1
 * @Route("/api/v1.0/user")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", name="api_user_retrieve", methods={"GET"})
     * @param Request $request
     * @param UserRepository $userRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, UserRepository $userRepository, ApiUtils $apiUtils) : JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $userRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Usuarios no encontrados");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/{id}", name="api_user_show", methods={"GET"},requirements={"id"="\d+"})
     * @param User $user
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function show(User $user, ApiUtils $apiUtils): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        if ($user === ""){
            $apiUtils->notFoundResponse("Usuario no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$user);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/new", name="api_user_new", methods={"POST"})
     * @param Request $request
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @return JsonResponse
     */
    public function new(Request $request, ValidatorInterface $validator, ApiUtils $apiUtils, UserPasswordEncoderInterface $passwordEncoder): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $user = new User();

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();
        
        try {
            $user->setName($data['name']);
            if ($data['surname'] !== "")
                $user->setSurname($data['surname']);
            $user->setEmail($data['email']);
            $user->setPassword(
                $passwordEncoder->encodePassword(
                    $user,
                    $data['new_password']
                )
            );
            $user->setRoles([$data['roles']]);
            if ($data['address'] !== "")
                $user->setAddress($data['address']);
            if ($data['postal_code'] !== "")
                $user->setPostalCode($data['postal_code']);
            if ($data['town'] !== "")
                $user->setTown($data['town']);
            if ($data['city'] !== "")
                $user->setCity($data['city']);
            if ($data['phone'] !== "")
                $user->setPhone($data['phone']);
            $user->setProfileImage('user-default.png');
            $user->setProfileSize(123);
            $user->setHeaderImage('header-default.png');
            $user->setHeaderSize(123);
            $user->setCreatedAt(new \DateTime());
            $user->setUpdatedAt(new \DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al usuario", $user);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
        // Check errors, if there is any error return it
        try {
            $apiUtils->validateData($validator, $user);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el usuario en la bbdd", null, $user);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $log = new CustomLog("users_created","new_users");
        $log->info($user->getEmail()." se ha registrado!");
        $apiUtils->successResponse("¡Usuario creado!",$user);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_user_update", methods={"PUT"})
     * @param Request $request
     * @param User $user
     * @param ApiUtils $apiUtils
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function edit(Request $request, User $user, ApiUtils $apiUtils, ValidatorInterface $validator): JsonResponse
    {
        

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        try {
            $user->setName($data['name']);
            if ($data['surname'] !== "")
                $user->setSurname($data['surname']);
            $user->setSurname($data['surname']);
            if ($data['email'] !== "")
            $user->setEmail($data['email']);
            if ($data['roles'] !== "")
                $user->setRoles($data['roles']);
            if ($data['address'] !== "")
                $user->setAddress($data['address']);
            if ($data['postal_code'] !== "")
                $user->setPostalCode($data['postal_code']);
            if ($data['town'] !== "")
                $user->setTown($data['town']);
            if ($data['city'] !== "")
                $user->setCity($data['city']);
            if ($data['phone'] !== "")
                $user->setPhone($data['phone']);
            $user->setUpdatedAt(new \DateTime());
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores al usuario", $user);
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$user);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar el usuario en la bbdd",null,$user);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Usuario editado!",$user);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_user_delete", methods={"DELETE"})
     * @param Request $request
     * @param User $user
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, User $user, ApiUtils $apiUtils): JsonResponse
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            if ($user === ""){
                $apiUtils->notFoundResponse("Usuario no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($user);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar el usuario de la base de datos",null,$user);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $log = new CustomLog("deleted_users","deleted_users");
        $log->info($user->getEmail()." ha sido eliminado!");
        $apiUtils->successResponse("¡Usuario borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/upload-img/{id}", name="api_user_upload_image", methods={"POST"})
     * @param Request $request
     * @param User $user
     * @param ApiUtils $apiUtils
     * @param CustomFileUploader $fileUploader
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function uploadFile(Request $request, User $user, ApiUtils $apiUtils, CustomFileUploader $fileUploader,
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
        $errors = $fileUploader->uploadImage($img,CustomFileUploader::USER_PROFILE, $user->getProfileImage());

        // if could upload image

        // send response
        if (count($errors) === 0){
            try {
                $user->setProfileImage($fileUploader->getFileName());
                $user->setUpdatedAt(new \DateTime('now'));
            }catch (Exception $e){
                $apiUtils->errorResponse($e, "No se pudieron insertar los datos al usuario");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
            }

            // Check errors, if there is any error return it
            try {
                $apiUtils->validateData($validator, $user);
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
            }

            // Upload obj to the database
            try {
                $em = $this->getDoctrine()->getManager();
                $em->flush();
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, "No se pudo editar el usuario en la bbdd");

                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }

            $apiUtils->successResponse("¡Subida de imagen con éxtio!",$user);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
        } else {
            $apiUtils->setFormErrors($errors);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se pudo subir la imagen",
                "errors" => $apiUtils->getFormErrors(),
                "results" => $user
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

    }

    /**
     * @Route("/deleteaccount", name="api_user_delete_account", methods={"DELETE"})
     * @param UserRepository $userRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function deleteAccount(UserRepository $userRepository,ApiUtils $apiUtils): JsonResponse
    {

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $user = $userRepository->findOneBy(['email'=>$this->getUser()->getUsername()]);

        // logout user
        $this->get('session')->invalidate();
        $this->get('security.token_storage')->setToken(null);

        try {
            if ($user === null){
                $apiUtils->notFoundResponse("Usuario no encontrado");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($user);
            $entityManager->flush();

        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo borrar el usuario de la base de datos",null,$user);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $log = new CustomLog("deleted_users","deleted_users");
        $log->info($user->getEmail()." ha sido eliminado!");
        $apiUtils->successResponse("¡Usuario borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/profile/info", name="api_user_info", methods={"GET"})
     * @param ApiUtils $apiUtils
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function personalInfo(ApiUtils $apiUtils, UserRepository $userRepository)
    {

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        try {
            $info = $userRepository->getInfo($this->getUser()->getUsername());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se encontraron los datos",null);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("OK",$info);
        return new JsonResponse($apiUtils->getResponse());
    }

    /**
     * @Route("/profile/edit/info", name="api_user_edit_info", methods={"PUT"})
     * @param Request $request
     * @param ApiUtils $apiUtils
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function editPersonalInfo(Request $request,ApiUtils $apiUtils, UserRepository $userRepository, ValidatorInterface $validator)
    {

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();


        try {
            $user = $userRepository->findOneBy(['email'=>$this->getUser()->getUsername()]);
            $user->setName($data['name']);
            if ($data['surname'] !== "")
                $user->setSurname($data['surname']);
            if ($data['address'] !== "")
                $user->setAddress($data['address']);
            if ($data['postal_code'] !== "")
                $user->setPostalCode($data['postal_code']);
            if ($data['town'] !== "")
                $user->setTown($data['town']);
            if ($data['city'] !== "")
                $user->setCity($data['city']);
            if ($data['phone'] !== "")
                $user->setPhone($data['phone']);
            if ($data['credit_card'] !== "")
                $user->setCreditCard($data['credit_card']);

        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores al usuario", $user);
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }
        // Check errors, if there is any errror return it
        try {
            $apiUtils->validateData($validator,$user);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(),$apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }


        // Update obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }catch (Exception $e) {
            $apiUtils->errorResponse($e,"No se pudo actualizar el usuario en la bbdd",null,$user);

            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        $info_updated = $userRepository->getInfo($this->getUser()->getUsername());
        $apiUtils->successResponse("¡Información actualizada!",$info_updated);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/profile/comments", name="api_user_comments", methods={"GET"})
     * @param ApiUtils $apiUtils
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function getComments(ApiUtils $apiUtils, UserRepository $userRepository)
    {

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        try {
            $info = $userRepository->getComments($this->getUser()->getUsername());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No hay comentarios", null);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("OK");
        return new JsonResponse($info);
    }

    /**
     * @Route("/profile/purchases", name="api_user_purchases", methods={"GET"})
     * @param ApiUtils $apiUtils
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function purchases(ApiUtils $apiUtils, UserRepository $userRepository)
    {

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        try {
            $info = $userRepository->getPurchases($this->getUser()->getUsername());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e,"No hay compras realizadas",null);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("OK");
        return new JsonResponse($info);
    }

    /**
     * @Route("/register", name="api_user_register", methods={"POST"})
     * @param Request $request
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param ApiUtils $apiUtils
     * @param ValidatorInterface $validator
     * @return Response
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, ApiUtils $apiUtils,
                            ValidatorInterface $validator): Response
    {

        $user = new User();

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        try {
            $user->setName($data['name']);
            $user->setEmail($data['email']);
            $user->setProfileImage('user-default.png');
            $user->setProfileSize(123);
            $user->setHeaderImage('header-default.jpg');
            $user->setHeaderSize(123);
            $user->setRoles(['ROLE_USER']);
            $user->setPassword($data['password']);
            $user->setCreatedAt(new \DateTime('now'));
            $user->setUpdatedAt(new \DateTime('now'));
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudieron insertar los datos al usuario", $user);
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        // Check errors, if there is any error return it
        try {
            $apiUtils->validateData($validator, $user);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo validar los datos", $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // hash of the password we do it here because of validateData
        $user->setPassword(
            $passwordEncoder->encodePassword(
                $user,
                $data['password']
            )
        );
        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo crear el usuario en la bbdd", null, $user);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $token = new UsernamePasswordToken(
            $user,
            null,
            'main',
            $user->getRoles()
        );
        $this->get('security.token_storage')->setToken($token);
        $this->get('session')->set('_security_main', serialize($token));


        $log = new CustomLog("new_users","new_users");
        $log->info($user->getEmail()." se ha registrado!");
        $apiUtils->successResponse("¡Registro con existo!",$user);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/login", name="api_user_login", methods={"POST"})
     * @param AuthenticationUtils $authenticationUtils
     * @param ApiUtils $apiUtils
     * @return Response
     */
    public function login(AuthenticationUtils $authenticationUtils, ApiUtils $apiUtils)
    {

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        $apiUtils->successResponse("Usuario logueado");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_OK);
    }

    /**
     * @Route("/logout", name="api_user_logout", methods={"GET"})
     * @throws Exception
     */
    public function logout()
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // controller can be blank: it will never be executed!
        throw new Exception('Don\'t forget to activate logout in security.yaml');
    }

    /**
     * @Route("/authenticated", name="api_user_authenticated", methods={"GET"})
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function isAuthenticated(UserRepository $userRepository) : JsonResponse
    {
        if (!$this->getUser()){
            $response = [
                "success"=>false,
                "message"=>"No has iniciado sesión",
                "errors"=> []
            ];
            return new JsonResponse($response,Response::HTTP_NON_AUTHORITATIVE_INFORMATION);
        } else {
            $user = $userRepository->findOneBy(['email'=>$this->getUser()->getUsername()]);
            $response = [
                "success"=>true,
                "message"=>"Usuario logueado",
                "errors"=> [],
                "results"=>['id'=>$user->getId()]
            ];
            if (in_array('ROLE_ADMIN', $user->getRoles()))
                $response["is_admin"] = true;

            return new JsonResponse($response,Response::HTTP_OK);
        }
    }


    /**
     * @Route("/profile/change-password", name="api_user_change_password", methods={"POST"})
     * @param Request $request
     * @param ApiUtils $apiUtils
     * @param UserRepository $repository
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function changePassword(Request $request, ApiUtils $apiUtils, UserRepository $repository,
                                   UserPasswordEncoderInterface $passwordEncoder, ValidatorInterface $validator): JsonResponse
    {

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $user = $repository->findOneBy(['email'=>$this->getUser()->getUsername()]);
        $errors = [];
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        if ($data['password'] === "")
            $errors['required_old_password'] = "Por favor introduzca su contraseña actual";
        if ($data['new_password'] === "")
            $errors['required_new_password'] = "Por favor introduzca su nueva contraseña";
        if ($data['repeat_password'] === "")
            $errors['required_repeat_password'] = "Por favor introduzca de nuevo la nueva contraseña";

        if (count($errors) > 0){
            $response = [
                "success"=>false,
                "message"=>"Cambio de contraseña fallido",
                "errors"=>$errors
            ];
            return new JsonResponse($response,Response::HTTP_BAD_REQUEST);
        }elseif (!password_verify($data['password'],$user->getPassword())) {
            $errors['old_password_fail'] = "No ha introducido correctamente su contraseña";
            $response = [
                "success"=>false,
                "message"=>"Contraseña incorrecta",
                "errors"=>$errors
            ];
            return new JsonResponse($response,Response::HTTP_BAD_REQUEST);
        }elseif ($data['new_password'] !== $data['repeat_password']){
            $errors['new_password_fail'] = "No ha introducido correctamente su nueva contraseña";
            $response = [
                "success"=>false,
                "message"=>"Contraseña incorrecta",
                "errors"=>$errors
            ];
            return new JsonResponse($response,Response::HTTP_BAD_REQUEST);
        }

        try {
            $user->setPassword(
                $passwordEncoder->encodePassword(
                    $user,
                    $data['new_password']
                )
            );
            $user->setUpdatedAt(new \DateTime('now'));
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudieron insertar los datos al usuario", $user);
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
        }

        // Check errors, if there is any error return it
        try {
            $apiUtils->validateData($validator, $user);
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
        }

        // Upload obj to the database
        try {
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "No se pudo editar el usuario en la bbdd", null, $user);

            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Cambio de contraseña con existo!",$user);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);

    }

    /**
     * @Route("/profile/change-profile-image", name="api_user_change_profile_image", methods={"POST"})
     * @param ApiUtils $apiUtils
     * @param UserRepository $repository
     * @param ValidatorInterface $validator
     * @param CustomFileUploader $fileUploader
     * @return JsonResponse
     */
    public function changeProfileImage( ApiUtils $apiUtils, UserRepository $repository, ValidatorInterface $validator,
                                    CustomFileUploader $fileUploader): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $errors = [];
        // Get user object
        $user = $repository->findOneBy(['email'=>$this->getUser()->getUsername()]);

        // Get image
        $img_profile = $_FILES['img_profile'];
        // check if not empty

        if (!array_key_exists('img_profile',$_FILES)) {
            $apiUtils->setFormErrors(["not_found"=>"No se ha enviado ninguna foto"]);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se pudo cambiar la foto de perfil",
                "errors" => $apiUtils->getFormErrors()
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        // Upload image
        $errors = $fileUploader->uploadImage($img_profile,CustomFileUploader::USER_PROFILE, $user->getProfileImage());
        // if could upload image

        // send response
        if (count($errors) === 0){
            try {
                $user->setProfileImage($fileUploader->getFileName());
                $user->setUpdatedAt(new \DateTime('now'));
            }catch (Exception $e){
                $apiUtils->errorResponse($e, "No se pudieron insertar los datos al usuario");
                return new JsonResponse($apiUtils->getResponse(),Response::HTTP_BAD_REQUEST,['Content-type'=>'application/json']);
            }

            // Check errors, if there is any error return it
            try {
                $apiUtils->validateData($validator, $user);
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, $e->getMessage(), $apiUtils->getFormErrors());
                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST);
            }

            // Upload obj to the database
            try {
                $em = $this->getDoctrine()->getManager();
                $em->flush();
            } catch (Exception $e) {
                $apiUtils->errorResponse($e, "No se pudo editar el usuario en la bbdd");

                return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
            }

            $apiUtils->successResponse("¡Cambio de imagen con exito!",["profile_image"=>$user->getProfileImage()]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
        } else {
            $apiUtils->setFormErrors($errors);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se pudo cambiar la foto de perfil",
                "errors" => $apiUtils->getFormErrors()
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }
    }

    /**
     * @Route("/contact", name="api_user_contact", methods={"POST"})
     * @param Request $request
     * @param ApiUtils $apiUtils
     * @param \Swift_Mailer $mailer
     * @return JsonResponse
     */
    public function contact(Request $request,ApiUtils $apiUtils, \Swift_Mailer $mailer)
    {
        $error = [];

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        $name = $data["name"];
        if ($name === "")
            $error["empty_name"] = "Por favor, indique su nombre";
        $email = $data["email"];
        if ($email === "")
            $error["empty_email"] = "Por favor, indique su correo";
        if ($email !== "" && filter_var($email,FILTER_VALIDATE_EMAIL) === false)
            $error["not_email"] = "Correo no válido";
        $subject = $data['subject'];
        if ($subject === "")
            $error["empty_subject"] = "Por favor, indique el motivo de su duda";
        $message = $data['message'];
        if ($message === "")
            $error["empty_message"] = "Escriba su duda por favor";

        if (count($error) > 0){
            $apiUtils->setFormErrors([$error]);
            $apiUtils->setResponse([
                "success" => false,
                "message" => "No se pudo enviar el correo",
                "errors" => $apiUtils->getFormErrors()
            ]);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        try {
            $send_email = (new \Swift_Message('Mensaje de contacto'))
                ->setFrom('sample.records11@gmail.com')
                ->setTo('sample.records11@gmail.com')
                ->setSubject("Mensaje de un cliente de la web")
                ->setBody(
                    "Nombre: $name\n
                Email: $email\n
                Asunto: $subject\n
                Mensaje: $message"
                );
            // Send the message
            $mailer->send($send_email);
        }catch (\Swift_SwiftException $e){
            $apiUtils->errorResponse($e, "No se pudo enviar el correo", null);
            return new JsonResponse($apiUtils->getResponse(), Response::HTTP_BAD_REQUEST, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("Correo enviado");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_OK,['Content-type' => 'application/json']);
    }

    /**
     * @Route("/datatocomment", name="api_user_comment", methods={"GET"})
     * @param ApiUtils $apiUtils
     * @param UserRepository $userRepository
     * @return JsonResponse
     */
    public function dataToComment(ApiUtils $apiUtils, UserRepository $userRepository) : JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $user = $this->getUser()->getUsername();

        $user = $userRepository->findOneBy(['email'=>$user]);

        $data = [
            "name"=>$user->getName(),
            "email"=> $user->getEmail(),
            "surname"=>$user->getSurname(),
            "img_profile"=>$user->getProfileImage()
        ];

        $response = [
            "success"=> true,
            "results"=> $data
        ];

        $apiUtils->setResponse($response);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_OK,['Content-type' => 'application/json']);
    }

}
