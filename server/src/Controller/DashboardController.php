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
use App\Entity\Secteur;
use App\Repository\SecteurRepository;
use App\Entity\EmailNotifications;
use App\Repository\EmailNotificationsRepository;
use App\Entity\Task;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use JWT\Authentication\JWT;
use App\Entity\Reunion;
use App\Entity\ParticipationReunion;
use App\Entity\ParticipationReunionRepository;
use App\Entity\ReunionRepository;
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
use App\Service\SendMailServiceReunion;
use App\Service\SendMailServiceAnnulerReunion;

class DashboardController extends AbstractController
{
    #[Route('/dashboardProjet', name: 'app_dashboardProjet')]
    public function dashboardProjet(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $p = $entityManager
        ->getRepository(Projet::class)
        ->createQueryBuilder('m')      
        ->getQuery()->getResult();
         $n=count($p); 

        $projet = $entityManager
        ->getRepository(Projet::class)
        ->createQueryBuilder('m')
        ->andWhere('m.archive = :archive')
        ->setParameters([
                'archive' => false
              ])
       
        ->getQuery()->getResult();
         $nb=count($projet);

         $projetAr = $entityManager
         ->getRepository(Projet::class)
         ->createQueryBuilder('m')
         ->andWhere('m.archive = :archive')
         ->setParameters([
                 'archive' => true
               ])
         ->getQuery()->getResult();
 
         $nbAr=count($projetAr);
        return $this->json(
            ['n' =>  $n,'nb' =>  $nb,'nbAr' =>  $nbAr]
        );
    }
   

    #[Route('/dasboardProjetU/{id}', name: 'app_dasboardProjetU')]
    public function dasboardProjetU(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('id');  
       $p = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->join('m.user','user')
       ->andWhere('user.id = :id')
       ->setParameters([
               'id'=>$id,
             ])
       ->getQuery()->getResult();
       $n=count($p);

       $projet = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->join('m.projet','projet')
       ->join('m.user','user')
       ->andWhere('user.id = :id')
       ->andWhere('projet.archive = :archive')
       ->setParameters([
               'id'=>$id,
               'archive'=>false,
             ])
       ->getQuery()->getResult();
       $nb=count($projet);

       $projetAr = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->join('m.projet','projet')
       ->join('m.user','user')
       ->andWhere('user.id = :id')
       ->andWhere('projet.archive = :archive')
       ->setParameters([
               'id'=>$id,
               'archive'=>true,
             ])
       ->getQuery()->getResult();
       $nbAr=count($projetAr);

       return $this->json(['n' =>  $n,'nb' =>  $nb,'nbAr' =>  $nbAr]
    ); 
    }



    #[Route('/dashboardUser', name: 'app_dashboardUser', methods: ['GET'])]
public function dashboardUser(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $user = $entityManager
        ->getRepository(User::class)
        ->createQueryBuilder('u')
        ->andWhere('u.roles != :role')
        ->setParameters([ 'role' => '["ROLE_ADMIN"]'])
        ->getQuery()->getResult();
        $nb=count($user);

            $userA = $entityManager
            ->getRepository(User::class)
            ->createQueryBuilder('u')
            ->andWhere('u.roles != :role')
            ->andWhere('u.etat = :etat')
            ->setParameters([ 'role' => '["ROLE_ADMIN"]','etat'=>true])
            ->getQuery()->getResult();
            $nbA=count($userA);

            $userN = $entityManager
            ->getRepository(User::class)
            ->createQueryBuilder('u')
            ->andWhere('u.roles != :role')
            ->andWhere('u.etat = :etat')
            ->setParameters([ 'role' => '["ROLE_ADMIN"]','etat'=>false])
            ->getQuery()->getResult();
            $nbN=count($userN);

            $client = $entityManager
            ->getRepository(User::class)
            ->createQueryBuilder('u')
            ->andWhere('u.roles != :role')
            ->andWhere('u.etat = :etat')
            ->setParameters([ 'role' => '["ROLE_ADMIN"]','etat'=>true])
            ->getQuery()->getResult();
            $nbC=count($client);
      
            return $this->json(['nb' =>  $nb,'nbN' =>  $nbN,'nbA' =>  $nbA]);
            
    }


    
    #[Route('/dashboardUserRole', name: 'app_dashboardRole', methods: ['GET'])]
public function dashboardUserRole(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $client = $entityManager
        ->getRepository(Client::class)
        ->createQueryBuilder('m')
        ->getQuery()->getResult();
        $nbC=count($client);

        $chef = $entityManager
        ->getRepository(ChefProjet::class)
        ->createQueryBuilder('m')
        ->getQuery()->getResult();
        $nbCh=count($chef);
      
        $membre = $entityManager
        ->getRepository(Membre::class)
        ->createQueryBuilder('m')
        ->getQuery()->getResult();
        $nbM=count($membre);
            return $this->json(['nbC' =>  $nbC,'nbM' =>  $nbM,'nbCh' =>  $nbCh]);
            
    }

    #[Route('/dashboardUserClient', name: 'app_dashboardUserClient', methods: ['GET'])]
    public function dashboardUserClient(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $client = $entityManager
        ->getRepository(Client::class)
        ->createQueryBuilder('m')
        ->select('secteur.titre, count(m.id) as counter')
        ->join('m.secteur','secteur')
        ->groupBy('secteur.id')
        ->getQuery()->getResult();

        $secteur = $entityManager
        ->getRepository(Secteur::class)
        ->createQueryBuilder('m')
        ->getQuery()->getResult();
     $data=[];
     $i=0;
        foreach( $secteur as  $secteur){
            $test= $entityManager
            ->getRepository(Client::class)
            ->createQueryBuilder('m')
            ->join('m.secteur','secteur')
            ->andWhere('secteur.id = :id')
            ->setParameters([ 'id' =>$secteur->getId()])
            ->getQuery()->getResult();
            if(count($test)===0){
             $data[$i]=$secteur->getTitre();
             $i=$i+1;
            }
          }
      
            return $this->json(['client' =>  $client,'secteur' =>  $data]);
            
    }

    #[Route('/dashboardUserChef', name: 'app_dashboardUserChef', methods: ['GET'])]
    public function dashboardUserChef(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $chef = $entityManager
        ->getRepository(ChefProjet::class)
        ->createQueryBuilder('m')
        ->select('secteur.titre, count(m.id) as counter')
        ->join('m.secteur','secteur')
        ->groupBy('secteur.id')
        ->getQuery()->getResult();

        $secteur = $entityManager
        ->getRepository(Secteur::class)
        ->createQueryBuilder('m')
        ->getQuery()->getResult();
     $data=[];
     $i=0;
        foreach( $secteur as  $secteur){
            $test= $entityManager
            ->getRepository(ChefProjet::class)
            ->createQueryBuilder('m')
            ->join('m.secteur','secteur')
            ->andWhere('secteur.id = :id')
            ->setParameters([ 'id' =>$secteur->getId()])
            ->getQuery()->getResult();
            if(count($test)===0){
             $data[$i]=$secteur->getTitre();
             $i=$i+1;
            }
          }
      
            return $this->json(['chef' =>  $chef,'secteur' =>  $data]);
            
    }

    #[Route('/dashboardUserMembre', name: 'app_dashboardUserMembre', methods: ['GET'])]
    public function dashboardUserMembre(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $membre = $entityManager
        ->getRepository(Membre::class)
        ->createQueryBuilder('m')
        ->select('m.departement, count(m.id) as counter')
        ->groupBy('m.departement')
        ->getQuery()->getResult();

    $depart=["Développement","Test","Marketing | Communication","Manager","Design","Comptabilité | Finance","Logistique","Autre"];
     $data=[];
     $i=0;
        foreach( $depart as  $depart){
            $test= $entityManager
            ->getRepository(Membre::class)
            ->createQueryBuilder('m')
            ->andWhere('m.departement = :departement')
            ->setParameters([ 'departement' =>$depart])
            ->getQuery()->getResult();
            if(count($test)===0){
             $data[$i]=$depart;
             $i=$i+1;
            }
          }
      
            return $this->json(['membre' =>  $membre,'departement' =>  $data]);
            
    }
    #[Route('/ProjetParUser', name: 'app_ProjetParUser')]
    public function ProjetParUser(EntityManagerInterface $entityManager,Request $request): Response
    {
       $user = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->select('user.username,user.lastname, count(m.id) as counter')
       ->join('m.user','user')
       ->groupBy('user.id')
       ->getQuery()->getResult();

       return $this->json(['user' =>  $user]
    ); 
    }
    #[Route('/userParProjet', name: 'app_UserParProjet')]
    public function UserParProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
       $projet = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->select('projet.nom, count(m.id) as counter')
       ->join('m.projet','projet')
       ->groupBy('projet.id')
       ->getQuery()->getResult();

       return $this->json(['projet' =>  $projet]
    ); 
    }
    #[Route('/membreChefProjet', name: 'app_MembreChefProjet')]
    public function MembreChefProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
       $membre = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->select('user.username,user.lastname, count(m.id) as counter')
       ->join('m.user','user')
       ->andWhere('user.roles = :roles')
       ->andWhere('m.role = :role')
       ->setParameters([ 'roles' => '["ROLE_MEMBRE"]',
       'role' => 'chefProjet'
       ])
       ->groupBy('user.id')
       ->getQuery()->getResult();

       return $this->json(['membre' =>  $membre]
    ); 
    }
    #[Route('/chefChefProjet', name: 'app_chefChefProjet')]
    public function chefChefProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
       $chef = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->select('user.username,user.lastname, count(m.id) as counter')
       ->join('m.user','user')
       ->andWhere('user.roles = :roles')
       ->setParameters([ 'roles' => '["ROLE_CHEFPROJET"]',
       ])
       ->groupBy('user.id')
       ->getQuery()->getResult();

       return $this->json(['chef' =>  $chef]
    ); 
    }
    #[Route('/clientClientProjet', name: 'app_clientClientProjet')]
    public function clientClientProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
       $client = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->select('user.username,user.lastname, count(m.id) as counter')
       ->join('m.user','user')
       ->andWhere('user.roles = :roles')
       ->setParameters([ 'roles' => '["ROLE_CLIENT"]',
       ])
       ->groupBy('user.id')
       ->getQuery()->getResult();

       return $this->json(['client' =>  $client]
    ); 
    }

    #[Route('/membreMembreProjet', name: 'app_membreMembreProjet')]
    public function membreMembreProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
       $membre = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->select('user.username,user.lastname, count(m.id) as counter')
       ->join('m.user','user')
       ->andWhere('user.roles = :roles')
       ->setParameters([ 'roles' => '["ROLE_MEMBRE"]',
       ])
       ->groupBy('user.id')
       ->getQuery()->getResult();

       return $this->json(['membre' =>  $membre]
    ); 
    }

    #[Route('/taskProjetRealise', name: 'app_taskProjetRealise')]
    public function taskProjetRealise(EntityManagerInterface $entityManager,Request $request): Response
    {
        $projet = $entityManager
        ->getRepository(Projet::class)
        ->createQueryBuilder('m')
        ->getQuery()->getResult();

     $p=[];
     $i=0;
     $t=[];
        foreach( $projet as  $projet){
             $p[$i]=$projet->getNom();
             $task = $entityManager
             ->getRepository(Task::class)
             ->createQueryBuilder('m')
             ->join('m.etat','etat')
             ->join('etat.phase','phase')
             ->join('phase.projet','projet')
             ->andWhere('projet.id = :id')
             ->andWhere('etat.titre = :titre')
             ->andWhere('m.valide = :valide')
             ->setParameters([
                     'id'=>$projet->getId(),
                     'titre'=>"Terminé",
                     'valide'=>true
                   ])
             ->getQuery()->getResult();
             $taskProjet = $entityManager
             ->getRepository(Task::class)
             ->createQueryBuilder('m')
             ->join('m.etat','etat')
             ->join('etat.phase','phase')
             ->join('phase.projet','projet')
             ->andWhere('projet.id = :id')
             ->setParameters([
                     'id'=>$projet->getId(),
                   ])
             ->getQuery()->getResult();
             $nb=count($task);
             $nbTous=count($taskProjet);
             if($nbTous!==0){
                 $t[$i]=($nb/$nbTous)*100;}
              if($nbTous===0){
                 $t[$i]=0;}
             $i=$i+1;
            
          }
       return $this->json(
            ['task' =>  $t,'projet' =>  $p]
        );}


//chef
        #[Route('/chefProjets/{id}', name: 'app_chefProjets')]
        public function chefProjets(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
           $chef = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->setParameters([ 'id' => $id,
           ])
           ->getQuery()->getResult();
           $p=[];
           $i=0;
           $nb=[];
              foreach( $chef as  $chef){
                   $p[$i]=$chef->getProjet()->getNom();
                   $projet = $entityManager
                   ->getRepository(DroitAcces::class)
                   ->createQueryBuilder('m')
                   ->join('m.projet','projet')
                   ->andWhere('projet.id = :id')
                   ->setParameters([ 'id' => $chef->getProjet()->getId(),
                   ])
                   ->getQuery()->getResult();
                 
                       $nb[$i]=count($projet);
                 
                   $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'user' =>  $nb]
        ); 
        }
        #[Route('/chefProjetsTasks/{id}', name: 'app_chefProjetsTasks')]
        public function chefProjetsTasks(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
           $chef = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->setParameters([ 'id' => $id,
           ])
           ->getQuery()->getResult();
           $p=[];
           $i=0;
           $t=[];
              foreach( $chef as  $chef){
                $p[$i]=$chef->getProjet()->getNom();
                $task = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->join('phase.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('etat.titre = :titre')
                ->andWhere('m.valide = :valide')
                ->setParameters([
                        'id'=>$chef->getProjet()->getId(),
                        'titre'=>"Terminé",
                        'valide'=>true
                      ])
                ->getQuery()->getResult();
                $taskProjet = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->join('phase.projet','projet')
                ->andWhere('projet.id = :id')
                ->setParameters([
                        'id'=>$chef->getProjet()->getId(),
                      ])
                ->getQuery()->getResult();
                $nb=count($task);
                $nbTous=count($taskProjet);
                if($nbTous!==0){
                    $t[$i]=($nb/$nbTous)*100;}
                 if($nbTous===0){
                    $t[$i]=0;}
                $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'task' =>  $t]
        ); 
        }


        #[Route('/chefProjetsMesTasks/{id}', name: 'app_chefProjetsMesTasks')]
        public function chefProjetsMesTasks(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
           $chef = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->setParameters([ 'id' => $id,
           ])
           ->getQuery()->getResult();
           $p=[];
           $i=0;
           $t=[];
              foreach( $chef as  $chef){
                $p[$i]=$chef->getProjet()->getNom();
                $task = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('users.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('user.id = :idU')
                ->setParameters([
                        'id'=>$chef->getProjet()->getId(),
                        'idU'=>$id,
                      ])
                ->getQuery()->getResult();
              
                    $t[$i]=  $nb=count($task);
                $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'task' =>  $t]
        ); 
        }

        #[Route('/chefProjetsMesTasksRealise/{id}', name: 'app_chefProjetsMesTasksRealise')]
        public function chefProjetsMesTasksRealise(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
           $chef = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->setParameters([ 'id' => $id,
           ])
           ->getQuery()->getResult();
           $p=[];
           $i=0;
           $t=[];
              foreach( $chef as  $chef){
                $p[$i]=$chef->getProjet()->getNom();
                $task = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->join('phase.projet','projet')
                ->andWhere('user.id = :idU')
                ->andWhere('projet.id = :id')
                ->andWhere('etat.titre = :titre')
                ->andWhere('m.valide = :valide')
                ->setParameters([
                        'idU'=>$id,
                        'id'=>$chef->getProjet()->getId(),
                        'titre'=>"Terminé",
                        'valide'=>true
                      ])
                ->getQuery()->getResult();
                $taskProjet = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('users.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('user.id = :idU')
                ->setParameters([
                        'id'=>$chef->getProjet()->getId(),
                        'idU'=>$id,
                      ])
                ->getQuery()->getResult();
                $nb=count($task);
                $nbTous=count($taskProjet);
                if($nbTous!==0){
                    $t[$i]=($nb/$nbTous)*100;}
                 if($nbTous===0){
                    $t[$i]=0;}
                $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'task' =>  $t]
        ); 
        }

//membre
        #[Route('/dasboardProjetUM/{id}', name: 'app_dasboardProjetUM')]
        public function dasboardProjetUM(EntityManagerInterface $entityManager,Request $request): Response
        {
           $id=$request->attributes->get('id');  
           $p = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role= :role')
           ->setParameters([
                   'id'=>$id,
                   'role'=>"membre",
                 ])
           ->getQuery()->getResult();
           $n=count($p);
    
           $projet = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.projet','projet')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role= :role')
           ->andWhere('projet.archive = :archive')
           ->setParameters([
                   'id'=>$id,
                   'archive'=>false,
                   'role'=>"membre",
                 ])
           ->getQuery()->getResult();
           $nb=count($projet);
    
           $projetAr = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.projet','projet')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role= :role')
           ->andWhere('projet.archive = :archive')
           ->setParameters([
                   'id'=>$id,
                   'archive'=>true,
                   'role'=>"membre",
                 ])
           ->getQuery()->getResult();
           $nbAr=count($projetAr);
    
           return $this->json(['n' =>  $n,'nb' =>  $nb,'nbAr' =>  $nbAr]
        ); 
        }

        #[Route('/dasboardProjetUCH/{id}', name: 'app_dasboardProjetUCH')]
        public function dasboardProjetUCH(EntityManagerInterface $entityManager,Request $request): Response
        {
           $id=$request->attributes->get('id');  
           $p = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role= :role')
           ->setParameters([
                   'id'=>$id,
                   'role'=>"chefProjet",
                 ])
           ->getQuery()->getResult();
           $n=count($p);
    
           $projet = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.projet','projet')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role= :role')
           ->andWhere('projet.archive = :archive')
           ->setParameters([
                   'id'=>$id,
                   'archive'=>false,
                   'role'=>"chefProjet",
                 ])
           ->getQuery()->getResult();
           $nb=count($projet);
    
           $projetAr = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.projet','projet')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role= :role')
           ->andWhere('projet.archive = :archive')
           ->setParameters([
                   'id'=>$id,
                   'archive'=>true,
                   'role'=>"chefProjet",
                 ])
           ->getQuery()->getResult();
           $nbAr=count($projetAr);
    
           return $this->json(['n' =>  $n,'nb' =>  $nb,'nbAr' =>  $nbAr]
        ); 
        }

        #[Route('/membreProjetsMesTasks/{id}', name: 'app_membreProjetsMesTasks')]
        public function membreProjetsMesTasks(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
           $membre = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role = :role')
           ->setParameters([ 'id' => $id,
           'role' => 'membre',
           ])
           ->getQuery()->getResult();
           $p=[];
           $i=0;
           $t=[];
              foreach( $membre as  $membre){
                $p[$i]=$membre->getProjet()->getNom();
                $task = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('users.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('user.id = :idU')
                ->setParameters([
                        'id'=>$membre->getProjet()->getId(),
                        'idU'=>$id,
                      ])
                ->getQuery()->getResult();
              
                    $t[$i]=  $nb=count($task);
                $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'task' =>  $t]
        ); 
        }

        #[Route('/membreProjetsMesTasksRealise/{id}', name: 'app_membreProjetsMesTasksRealise')]
        public function membreProjetsMesTasksRealise(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
            $membre = $entityManager
            ->getRepository(DroitAcces::class)
            ->createQueryBuilder('m')
            ->join('m.user','user')
            ->andWhere('user.id = :id')
            ->andWhere('m.role = :role')
            ->setParameters([ 'id' => $id,
            'role' => 'membre',
            ])
            ->getQuery()->getResult();
           $p=[];
           $i=0;
           $t=[];
              foreach( $membre as  $membre){
                $p[$i]=$membre->getProjet()->getNom();
                $task = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->join('phase.projet','projet')
                ->andWhere('user.id = :idU')
                ->andWhere('projet.id = :id')
                ->andWhere('etat.titre = :titre')
                ->andWhere('m.valide = :valide')
                ->setParameters([
                        'idU'=>$id,
                        'id'=>$membre->getProjet()->getId(),
                        'titre'=>"Terminé",
                        'valide'=>true
                      ])
                ->getQuery()->getResult();
                $taskProjet = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('users.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('user.id = :idU')
                ->setParameters([
                        'id'=>$membre->getProjet()->getId(),
                        'idU'=>$id,
                      ])
                ->getQuery()->getResult();
                $nb=count($task);
                $nbTous=count($taskProjet);
                if($nbTous!==0){
                    $t[$i]=($nb/$nbTous)*100;}
                 if($nbTous===0){
                    $t[$i]=0;}
                $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'task' =>  $t]
        ); 
        }

        #[Route('/membreChProjetsMesTasks/{id}', name: 'app_membreChProjetsMesTasks')]
        public function membreChProjetsMesTasks(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
           $membre = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role = :role')
           ->setParameters([ 'id' => $id,
           'role' => 'chefProjet',
           ])
           ->getQuery()->getResult();
           $p=[];
           $i=0;
           $t=[];
              foreach( $membre as  $membre){
                $p[$i]=$membre->getProjet()->getNom();
                $task = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('users.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('user.id = :idU')
                ->setParameters([
                        'id'=>$membre->getProjet()->getId(),
                        'idU'=>$id,
                      ])
                ->getQuery()->getResult();
              
                    $t[$i]=  $nb=count($task);
                $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'task' =>  $t]
        ); 
        }

        #[Route('/membreChProjetsMesTasksRealise/{id}', name: 'app_membreChProjetsMesTasksRealise')]
        public function membreChProjetsMesTasksRealise(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
            $membre = $entityManager
            ->getRepository(DroitAcces::class)
            ->createQueryBuilder('m')
            ->join('m.user','user')
            ->andWhere('user.id = :id')
            ->andWhere('m.role = :role')
            ->setParameters([ 'id' => $id,
            'role' => 'chefProjet',
            ])
            ->getQuery()->getResult();
           $p=[];
           $i=0;
           $t=[];
              foreach( $membre as  $membre){
                $p[$i]=$membre->getProjet()->getNom();
                $task = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->join('phase.projet','projet')
                ->andWhere('user.id = :idU')
                ->andWhere('projet.id = :id')
                ->andWhere('etat.titre = :titre')
                ->andWhere('m.valide = :valide')
                ->setParameters([
                        'idU'=>$id,
                        'id'=>$membre->getProjet()->getId(),
                        'titre'=>"Terminé",
                        'valide'=>true
                      ])
                ->getQuery()->getResult();
                $taskProjet = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('users.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('user.id = :idU')
                ->setParameters([
                        'id'=>$membre->getProjet()->getId(),
                        'idU'=>$id,
                      ])
                ->getQuery()->getResult();
                $nb=count($task);
                $nbTous=count($taskProjet);
                if($nbTous!==0){
                    $t[$i]=($nb/$nbTous)*100;}
                 if($nbTous===0){
                    $t[$i]=0;}
                $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'task' =>  $t]
        ); 
        }


        #[Route('/chefProjetsM/{id}', name: 'app_chefProjetsM')]
        public function chefProjetsM(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
           $chef = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role = :role')
           ->setParameters([ 'id' => $id,
           'role' => "chefProjet",
           ])
           ->getQuery()->getResult();
           $p=[];
           $i=0;
           $nb=[];
              foreach( $chef as  $chef){
                   $p[$i]=$chef->getProjet()->getNom();
                   $projet = $entityManager
                   ->getRepository(DroitAcces::class)
                   ->createQueryBuilder('m')
                   ->join('m.projet','projet')
                   ->andWhere('projet.id = :id')
                   ->setParameters([ 'id' => $chef->getProjet()->getId(),
                   ])
                   ->getQuery()->getResult();
                 
                       $nb[$i]=count($projet);
                 
                   $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'user' =>  $nb]
        ); 
        }
        #[Route('/chefProjetsTasksM/{id}', name: 'app_chefProjetsTasksM')]
        public function chefProjetsTasksM(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
           $chef = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->andWhere('m.role = :role')
           ->setParameters([ 'id' => $id,
           'role' => "chefProjet",
           ])
           ->getQuery()->getResult();
           $p=[];
           $i=0;
           $t=[];
              foreach( $chef as  $chef){
                $p[$i]=$chef->getProjet()->getNom();
                $task = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->join('phase.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('etat.titre = :titre')
                ->andWhere('m.valide = :valide')
                ->setParameters([
                        'id'=>$chef->getProjet()->getId(),
                        'titre'=>"Terminé",
                        'valide'=>true
                      ])
                ->getQuery()->getResult();
                $taskProjet = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->join('phase.projet','projet')
                ->andWhere('projet.id = :id')
                ->setParameters([
                        'id'=>$chef->getProjet()->getId(),
                      ])
                ->getQuery()->getResult();
                $nb=count($task);
                $nbTous=count($taskProjet);
                if($nbTous!==0){
                    $t[$i]=($nb/$nbTous)*100;}
                 if($nbTous===0){
                    $t[$i]=0;}
                $i=$i+1;
                  
                }
           return $this->json(['projet' =>  $p,'task' =>  $t]
        ); 
        }

}


