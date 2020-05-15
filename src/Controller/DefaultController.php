<?php

namespace App\Controller;

use App\Entity\Artist;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\CustomLog;

class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="default")
     */
    public function default()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/{reactRouting}", name="homepage", requirements={"reactRouting"=".+","reactRouting"="^(?!api).+"}, defaults={"reactRouting": null})
     */
    public function index()
    {
        return $this->render('default/index.html.twig');
    }

}
