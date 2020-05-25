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
     *
     * Route to home page
     */
    public function default()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/{reactRouting}", name="homepage", requirements={"reactRouting"=".+","reactRouting"="^(?!admin).+"}, defaults={"reactRouting": null})
     *
     * Controls all the public routes but dont access into /admin
     */
    public function index()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/admin/", name="admin")
     *
     * Route to admin page
     */
    public function default_admin()
    {
        return $this->render('default/admin.html.twig');
    }

    /**
     * @Route("/admin/{reactRouting}", name="admin_homepage", requirements={"reactRouting"=".+","reactRouting"="^(?!api).+"}, defaults={"reactRouting": null})
     *
     * Controls all the public routes but dont access into /admin
     */
    public function admin_index()
    {
        return $this->render('default/admin.html.twig');
    }

}
