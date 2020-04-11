<?php

namespace App\Controller;

use App\Entity\Song;
use App\Form\SongType;
use App\Repository\SongRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\FileUploader;

/**
 * @Route("/song")
 */
class SongController extends AbstractController
{
    /**
     * @Route("/", name="song_index", methods={"GET"})
     */
    public function index(SongRepository $songRepository): Response
    {
        return $this->render('song/index.html.twig', [
            'songs' => $songRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="song_new", methods={"GET","POST"})
     */
    public function new(Request $request, FileUploader $fileUploader): Response
    {
        $song = new Song();
        $form = $this->createForm(SongType::class, $song);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $song->setCreatedAt(new \DateTime('now'));
            $song->setUpdatedAt(new \DateTime('now'));
            $songFile = $form['songFile']->getData();
            $songFileName = $fileUploader->upload($songFile);
            $song->setSongFileName($songFileName);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($song);
            $entityManager->flush();

            return $this->redirectToRoute('song_index');
        }

        return $this->render('song/new.html.twig', [
            'song' => $song,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="song_show", methods={"GET"})
     */
    public function show(Song $song): Response
    {
        return $this->render('song/show.html.twig', [
            'song' => $song,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="song_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Song $song, FileUploader $fileUploader): Response
    {
        $form = $this->createForm(SongType::class, $song);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $song->setUpdatedAt(new \DateTime('now'));

            $songFile = $form['songFile']->getData();
            if ($songFile){
                $songFileName = $fileUploader->upload($songFile);
                $song->setSongFileName($songFileName);
            }

            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('song_index');
        }

        return $this->render('song/edit.html.twig', [
            'song' => $song,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="song_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Song $song): Response
    {
        if ($this->isCsrfTokenValid('delete'.$song->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($song);
            $entityManager->flush();
        }

        return $this->redirectToRoute('song_index');
    }
}
