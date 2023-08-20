<?php

namespace App\Controller;
use App\Entity\Secteur;
use App\Repository\SecteurRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
class SecteurController extends AbstractController
{
    public function __construct(
        private SecteurRepository $secteurRepository,
        )
    {}
    #[Route('/secteur', name: 'app_secteur')]
    public function index(): Response
    {
        $secteur = $this->secteurRepository->findAll();
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($secteur, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre']]);
        return $this->json([
            'secteur' =>  $data ] );
    }
}
