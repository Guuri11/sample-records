<?php

namespace App\Controller;

use App\Entity\Artist;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

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

        // now pass the array of link object to the view
        return $this->render('default/index.html.twig', [
            'artists' => $artists,
        ]);
    }

}
