<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Entity\Projet;
use App\Entity\ChefProjet;
use App\Entity\Membre;
use App\Entity\Client;
use App\Entity\Phase;
use App\Entity\Etat;
use App\Entity\DroitAcces;
use App\Entity\DroitAccesRepository;
use App\Repository\UserRepository;
use App\Repository\MembreRepository;
use App\Repository\ChefProjetRepository;
use App\Repository\ClientRepository;
use App\Repository\ProjetRepository;
use App\Repository\PhaseRepository;
use App\Repository\EtatRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\SendMailServiceProjet;
use App\Service\SendMailServiceChangeChef;
use App\Service\SendMailServiceChangeClient;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
class EtatController extends AbstractController
{
    #[Route('/etat/{id}', name: 'app_etat')]
    public function indexEtat(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $etat = $entityManager
        ->getRepository(Etat::class)
        ->createQueryBuilder('m')
        ->join('m.phase','phase')
        ->andWhere('phase.id = :id')
        ->setParameters([
                'id'=>$id
              ])
        ->getQuery()->getResult();

        $nb=count($etat);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($etat, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre']]);
        return $this->json(
            ['etat' =>  $data,'nb' =>  $nb]
        );
    }
    #[Route('/ajouterEtat/{id}', name: 'app_ajouterEtat')]
    public function AjouterEtat(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
        $E= $entityManager
        ->getRepository(Etat::class)
        ->createQueryBuilder('m')
        ->join('m.phase','phase')
        ->andWhere('phase.id = :id')
        ->andWhere('m.titre = :titre')
        ->setParameters([
                'id'=>$id,
                'titre'=>ucfirst($request->request->get('titre'))
              ])
        ->getQuery()->getResult();
        if(count($E)!==0){
            return $this->json([
                'danger' =>  "Etat existe déja !", ] , Response::HTTP_NOT_ACCEPTABLE);
          
        }
        else{
        $etat = new Etat();
        $etat->setTitre(ucfirst($request->request->get('titre')));
        $p =  $entityManager
        ->getRepository(Phase::class)
        ->findById($id);
        $phase=$p[0]  ;
        $etat->setPhase($phase);
        $entityManager->persist($etat);
        $entityManager->flush();

        return $this->json([
            'success' =>  'success',
              ]);}
    }

    #[Route('/updateEtat/{idPh}/{id}', name: 'app_updateEtat')]
    public function UpdateEtat(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
        $idPh=$request->attributes->get('idPh');
        $e = $entityManager
        ->getRepository(Etat::class)
        ->createQueryBuilder('m')
        ->join('m.phase','phase')
        ->andWhere('phase.id = :idPh')
        ->andWhere('m.titre = :titre')
        ->andWhere('m.id != :id')
        ->setParameters([
                'id'=>$id,
                'titre'=>ucfirst($request->request->get('titre')),
                'idPh'=> $idPh
              ])
        ->getQuery()->getResult();
        if(count($e)!==0){
            return $this->json([
                'danger' =>  "Etat existe déja !", ] , Response::HTTP_NOT_ACCEPTABLE);
          
        }
        else{
            $e = $entityManager
            ->getRepository(Etat::class)
            ->findById($id);
           $etat=$e[0];
        $etat->setTitre(ucfirst($request->request->get('titre')));
        $p =  $entityManager
        ->getRepository(Phase::class)
        ->findById($idPh);
        $phase=$p[0]  ;
        $etat->setPhase($phase);
        $entityManager->persist($etat);
        $entityManager->flush();
        return $this->json([
            'success' =>  'success',
              ]);}
    }
    #[Route('/deleteEtat/{id}', name: 'app_deleteEtat')]
    public function deleteEtat(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('id');
       $qb =$entityManager->getRepository(Etat::class)
       ->createQueryBuilder('m');
       $affected = $qb->delete()
               ->where('m.id = :id')
               ->getQuery()
               ->execute(['id' => $id]);

               return $this->json(['success' =>  'success']); 
    }

    #[Route('/etatTask/{id}', name: 'app_etatTask')]
    public function etatTask(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $etat = $entityManager
        ->getRepository(Etat::class)
        ->createQueryBuilder('m')
        ->andWhere('m.id = :id')
        ->setParameters([
                'id'=>$id
              ])
        ->getQuery()->getResult();
        $serializer = new Serializer([new ObjectNormalizer()]);
        $data = $serializer->normalize($etat, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre']]);
        return $this->json(
            ['etat' =>  $data]
        );
    }
}
