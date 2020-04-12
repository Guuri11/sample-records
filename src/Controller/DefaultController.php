<?php

namespace App\Controller;

use App\Entity\Artist;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\CustomLog;

class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="homepage")
     */
    public function index()
    {
        // get the Link repository (it is like our model)
        $repository = $this->getDoctrine()->getRepository(Artist::class);

        // retrieve all links
        $artists = $repository->findAll();

        $logger = new CustomLog('SR-INFO','test.log');
        $logger->info('hola mundo');


        // now pass the array of link object to the view
        return $this->render('default/index.html.twig', [
            'artists' => $artists,
        ]);
    }

}
