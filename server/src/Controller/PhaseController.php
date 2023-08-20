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
use App\Entity\Task;
use App\Entity\TaskRepository;
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

class PhaseController extends AbstractController
{
    #[Route('/phase/{id}', name: 'app_phase')]
    public function indexPhase(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $phase = $entityManager
        ->getRepository(Phase::class)
        ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id
              ])
        ->getQuery()->getResult();

        $nb=count($phase);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($phase, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre']]);
        return $this->json(
            ['phase' =>  $data,'nb' =>  $nb]
        );
    }

    #[Route('/ajouterPhase/{id}', name: 'app_ajouterPhase')]
    public function AjouterPhase(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
        $ph = $entityManager
        ->getRepository(Phase::class)
        ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->andWhere('projet.id = :id')
        ->andWhere('m.titre = :titre')
        ->setParameters([
                'id'=>$id,
                'titre'=>ucfirst($request->request->get('titre'))
              ])
        ->getQuery()->getResult();
        if(count($ph)!==0){
            return $this->json([
                'danger' =>  "Phase existe déja !", ] , Response::HTTP_NOT_ACCEPTABLE);
          
        }
        else{
        $phase = new Phase();
        $phase->setTitre(ucfirst($request->request->get('titre')));
        $p =  $entityManager
        ->getRepository(Projet::class)
        ->findById($id);
        $projet=$p[0]  ;
        $phase->setProjet($projet);
        $entityManager->persist($phase);
        $entityManager->flush();

        $etat = new Etat();
        $etat->setPhase($phase);
        $etat->setTitre("À faire");
        $entityManager->persist($etat);
        $entityManager->flush();
        $etat = new Etat();
        $etat->setPhase($phase);
        $etat->setTitre("En cours");
        $entityManager->persist($etat);
        $entityManager->flush();
        $etat = new Etat();
        $etat->setPhase($phase);
        $etat->setTitre("Terminé");
        $entityManager->persist($etat);
        $entityManager->flush();
        $etat = new Etat();
        $etat->setPhase($phase);
        $etat->setTitre("Bloqué");
        $entityManager->persist($etat);
        $entityManager->flush();
        return $this->json([
            'success' =>  'success',
              ]);}
    }

    #[Route('/updatePhase/{idPh}/{id}', name: 'app_updatePhase')]
    public function UpdatePhase(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
        $idPh=$request->attributes->get('idPh');
        $ph = $entityManager
        ->getRepository(Phase::class)
        ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->andWhere('projet.id = :id')
        ->andWhere('m.titre = :titre')
        ->andWhere('m.id != :idPh')
        ->setParameters([
                'id'=>$id,
                'titre'=>ucfirst($request->request->get('titre')),
                'idPh'=> $idPh
              ])
        ->getQuery()->getResult();
        if(count($ph)!==0){
            return $this->json([
                'danger' =>  "Phase existe déja !", ] , Response::HTTP_NOT_ACCEPTABLE);
          
        }
        else{
            $ph = $entityManager
            ->getRepository(Phase::class)
            ->findById($idPh);
           $phase=$ph[0];
        $phase->setTitre(ucfirst($request->request->get('titre')));
        $p =  $entityManager
        ->getRepository(Projet::class)
        ->findById($id);
        $projet=$p[0]  ;
        $phase->setProjet($projet);
        $entityManager->persist($phase);
        $entityManager->flush();
        return $this->json([
            'success' =>  'success',
              ]);}
    }
    #[Route('/deletePhase/{id}', name: 'app_deletePhase')]
    public function deletePhase(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('id');
       
    
       $qb =$entityManager->getRepository(Phase::class)
       ->createQueryBuilder('m');
       $affected = $qb->delete()
               ->where('m.id = :id')
               ->getQuery()
               ->execute(['id' => $id]);

               return $this->json(['success' =>  'success']); 
    }
    #[Route('/detailPhase/{id}', name: 'app_detailPhase')]
    public function detailPhase(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('id');
       $p = $entityManager
                   ->getRepository(Phase::class)
                   ->findById($id);
       $phase=$p[0];
       $serializer = new Serializer([new ObjectNormalizer()]);
       $data = $serializer->normalize($phase, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre']]);
    return $this->json(['phase' =>  $data]); 
    }

    #[Route('/tasksEtat/{idP}', name: 'app_tasksEtat')]
    public function tasksEtat(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('idP');
       $taskFaire = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
               'titre'=>"À faire",
             ])
        ->getQuery()->getResult();
        $taskCours = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'titre'=>"En cours",
             ])
       ->getQuery()->getResult();
       $taskTerminéV = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->andWhere('m.valide = :valide')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'titre'=>"Terminé",
               'valide'=>true,
             ])
       ->getQuery()->getResult();
       $taskTerminéNV = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->andWhere('m.valide = :valide')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'titre'=>"Terminé",
               'valide'=>false,
             ])
       ->getQuery()->getResult();
       $taskTerminéAtt = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->andWhere('m.valide is NULL')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'titre'=>"Terminé",
            
              
             ])
       ->getQuery()->getResult();
       $taskBloqué = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'titre'=>"Bloqué",
             ])
       ->getQuery()->getResult();
       $task = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->join('m.etat','etat')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,])
        ->getQuery()->getResult();
        $time = new \DateTime();
       $time->format('Y-m-d');
        $taskRetard = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->andWhere('m.tauxAvancement != :tauxAvancement')
       ->andWhere('m.dateFin <= :today')
       ->join('m.etat','etat')      
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'tauxAvancement'=>"100",
               'today'=>$time,])
       ->getQuery()->getResult();
       $nbRetard=count($taskRetard);
        $nbre=count($task);
    return $this->json(['taskFaire' =>  $taskFaire,'taskCours' =>  $taskCours,'taskTerminéV' =>  $taskTerminéV,
    'taskTerminéNV' =>  $taskTerminéNV,'taskTerminéAtt' =>  $taskTerminéAtt,'taskBloqué' =>  $taskBloqué
    ,'nbre' =>  $nbre,'counter' =>  $nbRetard]); 
    }

    #[Route('/tasksEtatPhase/{idP}/{idPh}', name: 'app_tasksEtatPhase')]
    public function tasksEtatPhase(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('idP');
       $idPh=$request->attributes->get('idPh');
       $taskFaire = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'titre'=>"À faire",
             ])
        ->getQuery()->getResult();
        $taskCours = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
                'idPh'=>$idPh,
               'titre'=>"En cours",
             ])
       ->getQuery()->getResult();
       $taskTerminéV = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->andWhere('m.valide = :valide')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'titre'=>"Terminé",
               'valide'=>true,
             ])
       ->getQuery()->getResult();
       $taskTerminéNV = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->andWhere('m.valide = :valide')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'titre'=>"Terminé",
               'valide'=>false,
             ])
       ->getQuery()->getResult();
       $taskTerminéAtt = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->andWhere('m.valide is NULL')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'titre'=>"Terminé",
              
             ])
       ->getQuery()->getResult();
       $taskBloqué = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'titre'=>"Bloqué",
             ])
       ->getQuery()->getResult();
       $task = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->join('m.etat','etat')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,])
        ->getQuery()->getResult();
        $time = new \DateTime();
       $time->format('Y-m-d');
        $taskRetard = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->andWhere('m.tauxAvancement != :tauxAvancement')
       ->andWhere('m.dateFin <= :today')
       ->join('m.etat','etat')      
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'tauxAvancement'=>"100",
               'today'=>$time,])
       ->getQuery()->getResult();
       $nbRetard=count($taskRetard);
        $nbre=count($task);
    return $this->json(['taskFaire' =>  $taskFaire,'taskCours' =>  $taskCours,'taskTerminéV' =>  $taskTerminéV,
    'taskTerminéNV' =>  $taskTerminéNV,'taskTerminéAtt' =>  $taskTerminéAtt,'taskBloqué' =>  $taskBloqué
    ,'nbre' =>  $nbre,'counter' =>  $nbRetard]); 
    }

    #[Route('/tasksEtatUser/{idP}/{idU}', name: 'app_tasksEtatUser')]
    public function tasksEtatUser(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('idP');
       $idU=$request->attributes->get('idU');
       $taskFaire = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
               'idU'=>$idU,
               'titre'=>"À faire",
             ])
        ->getQuery()->getResult();
        $taskCours = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idU'=>$idU,
               'titre'=>"En cours",
             ])
       ->getQuery()->getResult();
       $taskTerminéV = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->andWhere('m.valide = :valide')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idU'=>$idU,
               'titre'=>"Terminé",
               'valide'=>true,
             ])
       ->getQuery()->getResult();
       $taskTerminéNV = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->andWhere('m.valide = :valide')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idU'=>$idU,
               'titre'=>"Terminé",
               'valide'=>false,
             ])
       ->getQuery()->getResult();
       $taskTerminéAtt = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->andWhere('m.valide is NULL')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idU'=>$idU,
               'titre'=>"Terminé",
              
             ])
       ->getQuery()->getResult();
       $taskBloqué = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idU'=>$idU,
               'titre'=>"Bloqué",
             ])
       ->getQuery()->getResult();
       $task = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->join('m.etat','etat')
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
        'idU'=>$idU,
               'idP'=>$id,])
        ->getQuery()->getResult();
        $time = new \DateTime();
       $time->format('Y-m-d');
        $taskRetard = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->andWhere('m.tauxAvancement != :tauxAvancement')
       ->andWhere('m.dateFin <= :today')
       ->join('m.etat','etat')      
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idU'=>$idU,
               'tauxAvancement'=>"100",
               'today'=>$time,])
       ->getQuery()->getResult();
       $nbRetard=count($taskRetard);
        $nbre=count($task);
    return $this->json(['taskFaire' =>  $taskFaire,'taskCours' =>  $taskCours,'taskTerminéV' =>  $taskTerminéV,
    'taskTerminéNV' =>  $taskTerminéNV,'taskTerminéAtt' =>  $taskTerminéAtt,'taskBloqué' =>  $taskBloqué
    ,'nbre' =>  $nbre,'counter' =>  $nbRetard]); 
    }

    #[Route('/tasksEtatPhaseUser/{idP}/{idU}/{idPh}', name: 'app_tasksEtatPhaseUser')]
    public function tasksEtatPhaseUser(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('idP');
       $idU=$request->attributes->get('idU');
       $idPh=$request->attributes->get('idPh');
       $taskFaire = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'idU'=>$idU,
               'titre'=>"À faire",
             ])
        ->getQuery()->getResult();
        $taskCours = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'idU'=>$idU,
               'titre'=>"En cours",
             ])
       ->getQuery()->getResult();
       $taskTerminéV = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->andWhere('m.valide = :valide')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'idU'=>$idU,
               'titre'=>"Terminé",
               'valide'=>true,
             ])
       ->getQuery()->getResult();
       $taskTerminéNV = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->andWhere('m.valide = :valide')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'idU'=>$idU,
               'titre'=>"Terminé",
               'valide'=>false,
             ])
       ->getQuery()->getResult();
       $taskTerminéAtt = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->andWhere('m.valide is NULL')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'idU'=>$idU,
               'titre'=>"Terminé",
               
             ])
       ->getQuery()->getResult();
       $taskBloqué = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('etat.titre, count(m.id) as counter')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->join('m.etat','etat')
       ->andWhere('etat.titre = :titre')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'idU'=>$idU,
               'titre'=>"Bloqué",
             ])
       ->getQuery()->getResult();
       $task = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->join('m.etat','etat')
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
        'idU'=>$idU,
        'idPh'=>$idPh,
               'idP'=>$id,])
        ->getQuery()->getResult();
        $time = new \DateTime();
       $time->format('Y-m-d');
        $taskRetard = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->join('m.user','user')
       ->join('user.user','my')
       ->andWhere('my.id = :idU')
       ->andWhere('m.tauxAvancement != :tauxAvancement')
       ->andWhere('m.dateFin <= :today')
       ->join('m.etat','etat')      
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
        ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
               'idU'=>$idU,
               'tauxAvancement'=>"100",
               'today'=>$time,])
       ->getQuery()->getResult();
       $nbRetard=count($taskRetard);
        $nbre=count($task);
    return $this->json(['taskFaire' =>  $taskFaire,'taskCours' =>  $taskCours,'taskTerminéV' =>  $taskTerminéV,
    'taskTerminéNV' =>  $taskTerminéNV,'taskTerminéAtt' =>  $taskTerminéAtt,'taskBloqué' =>  $taskBloqué
    ,'nbre' =>  $nbre,'counter' =>  $nbRetard]); 
    }


    #[Route('/userProjetTasks/{idP}', name: 'app_userProjetTasks')]
    public function userProjetTasks(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('idP');
       $tasksUser = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('users.username,users.lastname, count(m.id) as counter')
       ->join('m.user','droitAcces')
       ->join('droitAcces.projet','projet')
       ->join('droitAcces.user','users')
        ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
             ])
       ->groupBy('users.id')
        ->getQuery()->getResult();

        $tasksUserNull = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('count(m.id) as counter')
       ->andWhere('m.user is NULL')
       ->join('m.etat','etat')      
       ->join('etat.phase','phase')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
             ])
        ->getQuery()->getResult();
        
      
    return $this->json(['tasksUser' =>  $tasksUser,'tasksUserNull' =>  $tasksUserNull]); 
    }

    #[Route('/userProjetPhaseTasks/{idP}/{idPh}', name: 'app_userProjetPhaseTasks')]
    public function userProjetPhaseTasks(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('idP');
       $idPh=$request->attributes->get('idPh');
       $tasksUser = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('users.username,users.lastname, count(m.id) as counter')
       ->join('m.user','droitAcces')
       ->join('droitAcces.projet','projet')
       ->join('droitAcces.user','users')
       ->join('m.etat','etat')      
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
        ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
             ])
       ->groupBy('users.id')
        ->getQuery()->getResult();

        $tasksUserNull = $entityManager
       ->getRepository(Task::class)
       ->createQueryBuilder('m')
       ->select('count(m.id) as counter')
       ->andWhere('m.user is NULL')
       ->join('m.etat','etat')      
       ->join('etat.phase','phase')
       ->andWhere('phase.id = :idPh')
       ->join('phase.projet','projet')
       ->andWhere('projet.id = :idP')
       ->setParameters([
               'idP'=>$id,
               'idPh'=>$idPh,
             ])
        ->getQuery()->getResult();
     return $this->json(['tasksUser' =>  $tasksUser,'tasksUserNull' =>  $tasksUserNull]); 
    }

    #[Route('/userProjet/{idP}', name: 'app_userProjet')]
    public function userProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('idP');
       $userMembre = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->join('m.user','user')
       ->join('m.projet','projet')
        ->andWhere('projet.id = :idP')
        ->andWhere('m.role = :role')
       ->setParameters([
               'idP'=>$id,
               'role'=>"membre",
             ])
       ->getQuery()->getResult();
      $countM=count($userMembre);

       $userClient = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->join('m.user','user')
       ->join('m.projet','projet')
        ->andWhere('projet.id = :idP')
        ->andWhere('m.role = :role')
       ->setParameters([
               'idP'=>$id,
               'role'=>"client",
             ])
       ->getQuery()->getResult();
       $countC=count($userClient);

       $userChef = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->join('m.user','user')
       ->join('m.projet','projet')
        ->andWhere('projet.id = :idP')
        ->andWhere('m.role = :role')
       ->setParameters([
               'idP'=>$id,
               'role'=>"chefProjet",
             ])
       ->getQuery()->getResult();
       $countCh=count($userChef);
     return $this->json(['userMembre' =>  $countM,'userClient' =>  $countC,'userChef' =>  $countCh]); 
    }
}
