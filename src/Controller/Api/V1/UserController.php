<?php

namespace App\Controller\Api\V1;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Service\ApiUtils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Exception;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class UserController
 * @package App\Controller\V1
 * @Route("/api/v1.0/user")
 * @SWG\Tag(name="user")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", name="api_user_retrieve", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get all users",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param UserRepository $userRepository
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function index(Request $request, UserRepository $userRepository, ApiUtils $apiUtils) : JsonResponse
    {
        // Get params
        $apiUtils->getRequestParams($request);

        // Sanitize data
        $apiUtils->setParameters($apiUtils->sanitizeData($apiUtils->getParameters()));

        // Get result
        try {
            $results = $userRepository->getRequestResult($apiUtils->getParameters());
        } catch (Exception $e) {
            $apiUtils->errorResponse($e, "Usuarios no encontrados");
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$results);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

    }

    /**
     * @Route("/{id}", name="api_user_show", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get one user",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user, ApiUtils $apiUtils): JsonResponse
    {
        if ($user === null){
            $apiUtils->notFoundResponse("Usuario no encontrado");
            return new JsonResponse($apiUtils->getResponse(),Response::HTTP_NOT_FOUND,['Content-type'=>'application/json']);
        }
        $apiUtils->successResponse("OK",$user);
        return new JsonResponse($apiUtils->getResponse(),Response::HTTP_OK);

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
     * @param ValidatorInterface $validator
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function new(Request $request, ValidatorInterface $validator, ApiUtils $apiUtils): JsonResponse
    {
        $user = new User();

        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();
        
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
            $apiUtils->errorResponse($e, "No se pudo insertar los valores al usuario", $user);
            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
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

            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Usuario creado!",$user);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/edit/{id}", name="api_user_update", methods={"PUT"})
     * @SWG\ Response(
     *      response=202,
     *      description="updates a new User object",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param User $user
     * @param ApiUtils $apiUtils
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    public function edit(Request $request, User $user, ApiUtils $apiUtils, ValidatorInterface $validator): JsonResponse
    {
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

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
            $apiUtils->errorResponse($e, "No se pudo actualizar los valores al usuario", $user);
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
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

            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
        }

        $apiUtils->successResponse("¡Usuario editado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/delete/{id}", name="api_user_delete", methods={"DELETE"})
     * @SWG\ Response(
     *      response=202,
     *      description="Delete a user",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param User $user
     * @param ApiUtils $apiUtils
     * @return JsonResponse
     */
    public function delete(Request $request, User $user, ApiUtils $apiUtils): JsonResponse
    {
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

        $apiUtils->successResponse("¡Usuario borrado!");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_ACCEPTED,['Content-type'=>'application/json']);
    }

    /**
     * @Route("/profile/info", name="api_user_info", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get personal info from the user logged",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
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

        $apiUtils->successResponse("OK");
        return new JsonResponse($info);
    }

    /**
     * @Route("/profile/comments", name="api_user_comments", methods={"GET"})
     * @SWG\ Response(
     *      response=200,
     *      description="Get all the comments from the user logged",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
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
     * @SWG\ Response(
     *      response=200,
     *      description="Get all the purchases from the user logged",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
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
     * @SWG\ Response(
     *      response=201,
     *      description="Register a user",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
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
            $user->setRoles(['ROLE_USER']);
            $user->setPassword(
                $passwordEncoder->encodePassword(
                    $user,
                    $data['password']
                )
            );
            $user->setCreatedAt(new \DateTime('now'));
            $user->setUpdatedAt(new \DateTime('now'));
        }catch (Exception $e){
            $apiUtils->errorResponse($e, "No se pudieron insertar los datos al usuario", $user);
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
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

            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Registro con existo!",$user);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/login", name="api_user_login", methods={"POST"})
     * @SWG\ Response(
     *      response=200,
     *      description="Log the user",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
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
     * @SWG\ Response(
     *      response=200,
     *      description="Logout the user",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     * @throws \Exception
     */
    public function logout()
    {
        // controller can be blank: it will never be executed!
        throw new \Exception('Don\'t forget to activate logout in security.yaml');
    }

    /**
     * @Route("/profile/change-password", name="api_user_change_password", methods={"POST"})
     * @SWG\ Response(
     *      response=200,
     *      description="Log the user",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
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

        if ($data['password'] === null)
            $errors['required_old_password'] = "Por favor introduzca su contraseña actual";
        if ($data['new_password'] === null)
            $errors['required_new_password'] = "Por favor introduzca su nueva contraseña";
        if ($data['repeat_password'] === null)
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
            return new JsonResponse($apiUtils->getResponse(),400,['Content-type'=>'application/json']);
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

            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("¡Cambio de contraseña con existo!",$user);
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_CREATED, ['Content-type' => 'application/json']);

    }

    /**
     * @Route("/contact", name="api_user_contact", methods={"POST"})
     * @SWG\ Response(
     *      response=200,
     *      description="Send the user question to email account",
     * @SWG\ Schema(
     *          type="object",
     * @SWG\ Property(property="user", ref=@Model(type=User::class, groups={"serialized"}))
     *      )
     * )
     * @param Request $request
     * @param ApiUtils $apiUtils
     * @param \Swift_Mailer $mailer
     * @return JsonResponse
     */
    public function contact(Request $request,ApiUtils $apiUtils, \Swift_Mailer $mailer)
    {
        // Get request data
        $apiUtils->getContent($request);

        // Sanitize data
        $apiUtils->setData($apiUtils->sanitizeData($apiUtils->getData()));
        $data = $apiUtils->getData();

        $name = $data['name'];
        $email = $data['email'];
        $subject = $data['subject'];
        $message = $data['message'];

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
            return new JsonResponse($apiUtils->getResponse(), 400, ['Content-type' => 'application/json']);
        }

        $apiUtils->successResponse("Correo enviado");
        return new JsonResponse($apiUtils->getResponse(), Response::HTTP_OK);
    }
}
