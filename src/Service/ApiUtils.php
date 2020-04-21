<?php

namespace App\Service;


use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ApiUtils
{
    /**
     * Response names
     */
    protected const CODE = "code";
    protected const ERROR = "error";
    protected const ERRORS = "errors";
    protected const FILE = "file";
    protected const LINE = "line";
    protected const MESSAGE = "message";
    protected const OBJECT = "obj";
    protected const RESULTS = "results";
    protected const SUCCESS = "success";

    /**
     * Params name
     */
    protected const ARTIST = "artist";
    protected const ALBUM = "album";
    protected const CATEGORY = "category";
    protected const EVENT = "event";
    protected const FIRST = "first";
    protected const LAST = "last";
    protected const ORDER = "ord";
    protected const PRODUCT = "product";
    protected const PURCHASE = "purchase";
    protected const SEARCH = "search";
    protected const TAG = "tag";
    // Extract data until this data
    protected const UNTIL = "until";


    /**
     * @var array
     */
    protected $response = [
        self::SUCCESS => "",
        self::MESSAGE => "",
        ];

    /**
     * @var array
     */
    protected $parameters = [];

    /**
     * @var array
     */
    protected $data = [];

    /**
     * @var array
     */
    protected $formErrors = [];

    /**
     * @param Request $request
     * Gets the query string sanitizing it
     */
    public function getRequestParams(Request $request)
    {
        $request->query->has(self::ARTIST) ?
            $this->parameters[self::ARTIST] = intval($request->query->get(self::ARTIST)):null;
        $request->query->has(self::ALBUM) ?
            $this->parameters[self::ALBUM] = intval($request->query->get(self::ALBUM)):null;
        $request->query->has(self::CATEGORY) ? $this->parameters[self::CATEGORY] = intval($request->query->get(self::CATEGORY)):null;
        $request->query->has(self::EVENT) ? $this->parameters[self::EVENT] = intval($request->query->get(self::EVENT)):null;
        $request->query->has(self::FIRST) ? $this->parameters[self::FIRST] = intval($request->query->get(self::FIRST)):null;
        $request->query->has(self::LAST) ? $this->parameters[self::LAST] = intval($request->query->get(self::LAST)):null;
        $request->query->has(self::ORDER) ?
            $this->parameters[self::ORDER] = strtoupper($request->query->get(self::ORDER)): $this->parameters[self::ORDER] = "DESC";
        $request->query->has(self::PRODUCT) ? $this->parameters[self::PRODUCT] = intval($request->query->get(self::PRODUCT)):null;
        $request->query->has(self::PURCHASE) ? $this->parameters[self::PURCHASE] = intval($request->query->get(self::PURCHASES)):null;
        $request->query->has(self::SEARCH) ? $this->parameters[self::SEARCH] = $request->query->get(self::SEARCH):null;
        $request->query->has(self::TAG) ? $this->parameters[self::TAG] = intval($request->query->get(self::TAG)):null;
        $request->query->has(self::UNTIL) ? $this->parameters[self::UNTIL] = $request->query->get(self::UNTIL):null;

        $this->parameters = array_filter($this->parameters);
    }

    /**
     * @param Request $request
     */
    public function getContent(Request $request)
    {
        if ($content = $request->getContent()){
            $this->data = json_decode($content,true);
        }
    }


    /**
     * @param array $data
     * @return array
     *
     * Sanitize the request data checking html tags and trimming it
     */
    public function sanitizeData ($data)
    {
        foreach ($data as $key => $item) {
            $data[$key] = trim(strip_tags($item));
        }
        return $data;
    }

    /**
     * @param ValidatorInterface $validator
     * @param $value
     * @throws Exception
     */
    public function validateData (ValidatorInterface $validator, $value)
    {
        $errors = $validator->validate($value);
        if (count($errors) >0){
            for ($idx=0; $idx < count($errors); $idx ++){
                $prop = $errors->get($idx)->getPropertyPath();
                $this->formErrors[$prop] = $errors->get($idx)->getMessage();
            }
        }
        if (count($this->formErrors) >0)
            throw new Exception("Error al validar el objeto");
    }

    /**
     * @param Exception $e
     * @param string $message
     * @param null $obj
     * Prepares error response setting the information
     */
    public function errorResponse (Exception $e, string $message, $errors = null, $obj = null)
    {
        $error[self::CODE] = $e->getCode();
        $error[self::MESSAGE] = $e->getMessage();
        if ($errors !== null)
            $error[self::ERRORS] = $errors;
        $obj !== null ? $error[self::OBJECT] = $obj:null;
        $this->response[self::SUCCESS] = false;
        $this->response[self::MESSAGE] = $message;
        $this->response[self::ERROR] = $error;
    }

    public function notFoundResponse (string $message)
    {
        $error[self::MESSAGE] = "Objeto no encontrado";
        $this->response[self::SUCCESS] = false;
        $this->response[self::MESSAGE] = $message;
        $this->response[self::ERROR] = $error;
    }

    public function successResponse (string $message, $results = null)
    {
        $this->response[self::SUCCESS] = true;
        $this->response[self::MESSAGE] = $message;
        if ($results !== null)
            $this->response[self::RESULTS] = $results;
    }

    /**
     * Attempt authorization using jwt-verifier
     *
     * @return bool
     */
    public function isAuthorized(): bool
    {
        if (! isset( $_SERVER['HTTP_AUTHORIZATION'])) {
            return false;
        }

        $authType = null;
        $authData = null;

        // Extract the auth type and the data from the Authorization header.
        @list($authType, $authData) = explode(" ", $_SERVER['HTTP_AUTHORIZATION'], 2);

        // If the Authorization Header is not a bearer type, return a 401.
        if ($authType != 'Bearer') {
            return false;
        }

        // Attempt authorization with the provided token
        try {

            // Setup the JWT Verifier
            $jwtVerifier = (new \Okta\JwtVerifier\JwtVerifierBuilder())
                ->setAdaptor(new \Okta\JwtVerifier\Adaptors\SpomkyLabsJose())
                ->setAudience('api://default')
                ->setClientId('0oaa2rqjwqSSAxR8w4x6')
                ->setIssuer('https://dev-837444.okta.com/oauth2/default')
                ->build();

            // Verify the JWT from the Authorization Header.
            $jwt = $jwtVerifier->verify($authData);
        } catch (\Exception $e) {

            // We encountered an error, return a 401.
            return false;
        }

        return true;
    }

    /**
     * @return array
     */
    public function getResponse(): array
    {
        return $this->response;
    }

    /**
     * @param array $response
     */
    public function setResponse(array $response): void
    {
        $this->response = $response;
    }

    /**
     * @return array
     */
    public function getParameters(): array
    {
        return $this->parameters;
    }

    /**
     * @param array $parameters
     */
    public function setParameters(array $parameters): void
    {
        $this->parameters = $parameters;
    }

    /**
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * @param array $data
     */
    public function setData(array $data): void
    {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function getFormErrors(): array
    {
        return $this->formErrors;
    }

    /**
     * @param array $formErrors
     */
    public function setFormErrors(array $formErrors): void
    {
        $this->formErrors = $formErrors;
    }

}
