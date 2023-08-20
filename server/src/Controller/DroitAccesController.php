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
use App\Entity\DroitAcces;
use App\Entity\Task;
use App\Entity\TaskRepository;
use App\Entity\DroitAccesRepository;
use App\Repository\UserRepository;
use App\Repository\MembreRepository;
use App\Repository\ChefProjetRepository;
use App\Repository\ClientRepository;
use App\Repository\ProjetRepository;
use App\Entity\EmailNotifications;
use App\Repository\EmailNotificationsRepository;
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

class DroitAccesController extends AbstractController
{
   

    #[Route('/droit/accesU/{id}', name: 'app_droit_accesUser', methods: ['GET'])]
    public function ProjetsUser(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $id=$request->attributes->get('id');
        $projet = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->join('m.user','user')
        ->andWhere('projet.archive = :archive')
        ->andWhere('user.id = :id')
        ->setParameters([
                'archive' => false,
                'id'=>$id
              ])
        ->groupBy('projet.id')
        ->getQuery()->getResult();

        $nb=count($projet);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'projet' => ['id','nom','id','description','document','dateDebut','dateFin','archive']]]);
        return $this->json(
            ['projet' =>  $data,'nb' =>  $nb]
        );
    }
    #[Route('/droit/accesArchiveU/{id}', name: 'app_droit_accesArchiveUser', methods: ['GET'])]
    public function ProjetsArchivéUser(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $projet = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->join('m.user','user')
        ->andWhere('projet.archive = :archive')
        ->andWhere('user.id = :id')
        ->setParameters([
                'archive' => true,
                'id'=>$id
              ])
        ->groupBy('projet.id')
        ->getQuery()->getResult();

        $nb=count($projet);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'projet' => ['id','nom','id','description','document','dateDebut','dateFin','archive']]]);
        return $this->json(
            ['projet' =>  $data,'nb' =>  $nb]
        );
    }


#[Route('/projetChef/{id}', name: 'app_projetChef', methods: ['GET'])]
    public function ProjetChef(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $projet = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->andWhere('projet.id = :id')
        ->andWhere('m.role = :chefProjet')
        ->setParameters([
                'id'=>$id,
                'chefProjet'=>'chefProjet'
              ])
        ->getQuery()->getResult();

        $nb=count($projet);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','archive']]]);
        return $this->json(
            ['projet' =>  $data,'nb' =>  $nb]
        );
    }


    #[Route('/detailProjet/{id}', name: 'app_detailProjet', methods: ['GET'])]
    public function detailProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $projet = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->join('m.user','user')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id
              ])
        ->getQuery()->getResult();

        $nb=count($projet);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','dateDebut','dateFin','archive']]]);
        return $this->json(
            ['projet' =>  $data,'nb' =>  $nb]
        );
    }

    
    #[Route('/detailMembreProjet/{id}', name: 'app_detailMembreProjet', methods: ['GET'])]
    public function detailMembreProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $projet = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
        ->andWhere('m.role != :role')
        ->join('m.projet','projet')
        ->join('m.user','user')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
                'role'=>'client'
              ])
        ->getQuery()->getResult();

        $nb=count($projet);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','dateDebut','dateFin','archive']]]);
        return $this->json(
            ['projet' =>  $data,'nb' =>  $nb]
        );
    }


    #[Route('/updateProjetUsers/{id}', name: 'app_updateProjetUsers')]
    public function updateProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('id');
       $users=$request->get('users');
       
      foreach($users as $users) {
       
        $d = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
       ->join('m.projet','projet')
       ->join('m.user','user')
       ->andWhere('projet.id = :id')
       ->andWhere('user.id = :idU')
       ->setParameters([
               'id'=>$id,
               'idU'=>$users['id'],
             ])
       ->getQuery()->getResult();
     
      if($d){
        $droitAccès=$d[0];
        
        if(($users['roles']==="ROLE_MEMBRE")&&($users['checkedM']==="true"||$users['checked']==="true")&&($droitAccès->getRole()!==$users['role'])){
            $droitAccès->setRole($users['role']);
            $entityManager->persist($droitAccès);
            $entityManager->flush();
        }
        if($users['checked']==="false"&&$users['checkedM']==="false"){
            $p = $entityManager
            ->getRepository(Projet::class)
            ->findById($id);
            $projet=$p[0];
            $u = $entityManager
            ->getRepository(User::class)
            ->findById($users['id']);
            $user=$u[0];
            $t = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->join('m.user','user')
            ->join('user.user','users')
            ->join('user.projet','projet')
            ->andWhere('projet.id = :id')
            ->andWhere('users.id = :idU')
            ->setParameters([
                'id'=>$id,
                    'idU'=>$users['id'],
                  ])
            ->getQuery()->getResult();
            if($t){
            foreach($t as $t) {
              $t->setUser(null);
              $entityManager->persist($t);
              $entityManager->flush();}}
            $qb1 =$entityManager->getRepository(DroitAcces::class)
            ->createQueryBuilder('m');
            $affected1 = $qb1->delete()
            ->andWhere('m.projet = :projet')
            ->andWhere('m.user = :user')
            ->setParameters(['projet' => $projet,'user' => $user])
            ->getQuery()
            ->execute();
            
          
        }
      }
      }
       return $this->json([
           'success' =>  $users]);
       }
       #[Route('/detailProjetEquipeChef/{id}', name: 'app_detailProjetEquipeChef', methods: ['GET'])]
       public function detailProjetEquipeChef(EntityManagerInterface $entityManager,Request $request): Response
       {
           $id=$request->attributes->get('id');
           $projet = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.projet','projet')
           ->join('m.user','user')
           ->andWhere('projet.id = :id')
           ->andWhere('m.role = :role')
           ->setParameters([
                   'id'=>$id,
                   'role'=>"chefProjet"
                 ])
           ->getQuery()->getResult();
   
           $nb=count($projet);
           $serializer = new Serializer([new ObjectNormalizer()]);
   
           $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','dateDebut','dateFin','archive']]]);
           return $this->json(
               ['projet' =>  $data,'nb' =>  $nb]
           );
       }

       #[Route('/detailProjetEquipeMembre/{id}', name: 'app_detailProjetEquipeMembre', methods: ['GET'])]
       public function detailProjetEquipeMembre(EntityManagerInterface $entityManager,Request $request): Response
       {
           $id=$request->attributes->get('id');
           $projet = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.projet','projet')
           ->join('m.user','user')
           ->andWhere('projet.id = :id')
           ->andWhere('m.role = :role')
           ->setParameters([
                   'id'=>$id,
                   'role'=>"membre"
                 ])
           ->getQuery()->getResult();
   
           $nb=count($projet);
           $serializer = new Serializer([new ObjectNormalizer()]);
   
           $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','dateDebut','dateFin','archive']]]);
           return $this->json(
               ['projet' =>  $data,'nb' =>  $nb]
           );
       }

       #[Route('/detailProjetEquipeClient/{id}', name: 'app_detailProjetEquipeClient', methods: ['GET'])]
       public function detailProjetEquipeClient(EntityManagerInterface $entityManager,Request $request): Response
       {
           $id=$request->attributes->get('id');
           $projet = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.projet','projet')
           ->join('m.user','user')
           ->andWhere('projet.id = :id')
           ->andWhere('m.role = :role')
           ->setParameters([
                   'id'=>$id,
                   'role'=>"client"
                 ])
           ->getQuery()->getResult();
   
           $nb=count($projet);
           $serializer = new Serializer([new ObjectNormalizer()]);
   
           $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','dateDebut','dateFin','archive']]]);
           return $this->json(
               ['projet' =>  $data,'nb' =>  $nb]
           );
       }
       #[Route('/detailProjetUser/{id}', name: 'app_detailProjetUser', methods: ['GET'])]
       public function detailProjetUser(EntityManagerInterface $entityManager,Request $request): Response
       {
           $id=$request->attributes->get('id');
           $projet = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.user','user')
           ->andWhere('user.id = :id')
           ->setParameters([
                   'id'=>$id,
                 ])
           ->getQuery()->getResult();
   
           $nb=count($projet);
           $serializer = new Serializer([new ObjectNormalizer()]);
   
           $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','dateDebut','dateFin','archive']]]);
           return $this->json(
               ['projet' =>  $data,'nb' =>  $nb]
           );
       }

       #[Route('/ajouterUserProjet/{id}', name: 'app_ajouterUserProjet')]
       public function AjouterUserProjet(Request $request,EntityManagerInterface $entityManager,SendMailServiceProjet $mail,SendMailServiceChangeChef $mailCh,SendMailServiceChangeClient $mailC): Response
       {    $id=$request->attributes->get('id');
        $p = $entityManager
        ->getRepository(Projet::class)
        ->createQueryBuilder('m')
        ->andWhere('m.id = :id')
        ->setParameters([
             'id'=>$id,
           ])
        ->getQuery()->getResult();
        $projet=$p[0];
        $userId=$request->request->get('userId');
        $u =  $entityManager
        ->getRepository(User::class)
        ->findById($userId);
         $user=$u[0]  ;
         $role=$request->request->get('role');
         $roleUser="";
         $sexe="";
         if(($user->getSexe())==="femme"){ $sexe="elle"; }
         else{$sexe="il"  ; }

        if($role==="membre") {
              $droitAcces = new DroitAcces();
              $droitAcces->setProjet($projet);
                $droitAcces->setUser($user);
                $droitAcces->setRole($role);
                $entityManager->persist($droitAcces);
                $entityManager->flush();
                $roleUser="Membre";
                $mail->send(
                    'ourteamcollab@gmail.com',
                    $user->getEmail(),
                    $user->getUsername().' '.$user->getLastname(),
                   "Rejoindre l'espace de projet",
                    ucfirst($projet->getNom()),
                    $roleUser
                );
                $email = new EmailNotifications();
                $email->setUser($user);
                $email->setStatus(0);
                $email->setObjet("Rejoindre l'espace de projet");
               $email->setContenu("Bonjour ".$user->getUsername().' '.$user->getLastname().",\n
               Bienvenue chez Our Team Collab!\n Vous avez été ajouté à cet espace de projet: ". $projet->getNom().".\n
               Votre droit d'accès: Membre.\n
             A très vite sur Our Team Collab.");
               $email->setDate(date("Y-m-d"));
               $email->setHeure(date("H:i"));
               $entityManager->persist($email);
               $entityManager->flush();
            }
            if($role==="client") {
                    $roleUser="Client";
                    $d = $entityManager
                    ->getRepository(DroitAcces::class)
                    ->createQueryBuilder('m')
                    ->join('m.projet','projet')
                    ->andWhere('projet.id = :id')
                    ->andWhere('m.role = :role')
                    ->setParameters([
                            'id'=>$id,
                            'role'=>"client",
                          ])
                    ->getQuery()->getResult();
                    $droitAcces=$d[0];
                    $droitAcces->setUser($user);
                    $entityManager->persist($droitAcces);
                    $entityManager->flush(); 

                    $membreProjet = $entityManager
                    ->getRepository(DroitAcces::class)
                    ->createQueryBuilder('m')
                    ->join('m.projet','projet')
                    ->andWhere('projet.id = :id')
                    ->join('m.user','user')
                    ->andWhere('user.id != :idU')
                    ->setParameters([
                            'id'=>$id,
                            'idU'=> $userId,
                          ])
                    ->getQuery()->getResult(); 
                    $mail->send(
                        'ourteamcollab@gmail.com',
                        $user->getEmail(),
                        $user->getUsername().' '.$user->getLastname(),
                       "Rejoindre l'espace de projet",
                        ucfirst($projet->getNom()),
                        $roleUser
                    );  
                    $email = new EmailNotifications();
                $email->setUser($user);
                $email->setStatus(0);
                $email->setObjet("Rejoindre l'espace de projet");
               $email->setContenu("Bonjour ".$user->getUsername().' '.$user->getLastname().",\n
               Bienvenue chez Our Team Collab!\n Vous avez été ajouté à cet espace de projet: ". $projet->getNom().".\n
               Votre droit d'accès: " .$roleUser.".\n
             A très vite sur Our Team Collab.");
               $email->setDate(date("Y-m-d"));
               $email->setHeure(date("H:i"));
               $entityManager->persist($email);
               $entityManager->flush();  
                    
                    foreach($membreProjet  as $m){
                        $mailC->send(
                            'ourteamcollab@gmail.com',
                            ($m->getUser())->getEmail(),
                           "Changement de client",
                            ucfirst($projet->getNom()),
                            $user->getUsername().' '.$user->getLastname(),
                            $sexe,);  
                            $email = new EmailNotifications();
                $email->setUser($m->getUser());
                $email->setStatus(0);
                $email->setObjet("Changement de client");
               $email->setContenu("Chers membres de l'équipe de projet ".ucfirst($projet->getNom()).",\n
               J'espère que vous allez bien.\n Je tenais à vous informer d'un changement important concernant notre projet.
               \nNous aurons un nouveau client qui prendra la responsabilité du projet actuel.
               \nNous sommes heureux de vous annoncer que ".  $user->getUsername().' '.$user->getLastname()." assumera la responsabilité du projet. 
               \nNous sommes convaincus qu'".$sexe." apportera une nouvelle dynamique et de nouvelles opportunités à notre collaboration.
               \n
             A très vite sur Our Team Collab.\nCordialement.");
               $email->setDate(date("Y-m-d"));
               $email->setHeure(date("H:i"));
               $entityManager->persist($email);
               $entityManager->flush();
                    }

                }
            if($role==="chefProjet"){
                    $roleUser="Chef de Projet";
                    $d = $entityManager
                    ->getRepository(DroitAcces::class)
                    ->createQueryBuilder('m')
                    ->join('m.projet','projet')
                    ->andWhere('projet.id = :id')
                    ->andWhere('m.role = :role')
                    ->setParameters([
                            'id'=>$id,
                            'role'=>"chefProjet",
                          ])
                    ->getQuery()->getResult();
                    $droitAcces=$d[0];
                    $mailCh->send(
                        'ourteamcollab@gmail.com',
                        ($droitAcces->getUser())->getEmail(),
                       "Changement de chef de projet",
                        ucfirst($projet->getNom()),
                        $user->getUsername().' '.$user->getLastname(),
                        $sexe,
                        ($droitAcces->getUser())->getUsername().' '.($droitAcces->getUser())->getLastname(),

                    );  
                    $email = new EmailNotifications();
                    $email->setUser($droitAcces->getUser());
                    $email->setStatus(0);
                    $email->setObjet("Changement de chef de projet");
                   $email->setContenu("Chers membres de l'équipe de projet ". ucfirst($projet->getNom()).",
                   \nJ'espère que ce message vous trouve bien.
                   \n Je tiens à vous informer d'un changement important au sein de notre équipe dans notre projet.  
                   \nNous aurons un nouveau chef de projet qui prendra les rênes de notre projet.
                   \nAprès une durée de service dévoué et d'excellent leadership de la part de 
                   ".($droitAcces->getUser())->getUsername().' '.($droitAcces->getUser())->getLastname().", nous lui exprimons nos sincères remerciements pour ses contributions précieuses et son dévouement.
                   \nJe suis ravi de vous annoncer que  ". $user->getUsername().' '.$user->getLastname()." assumera le rôle de chef de projet. 
                   \nNous sommes confiants qu'".$sexe." dirigera notre équipe/projet avec succès.
                  \n
                   A très vite sur Our Team Collab.\n Cordialement.");
                   $email->setDate(date("Y-m-d"));
                   $email->setHeure(date("H:i"));
                   $entityManager->persist($email);
                   $entityManager->flush();
                    $droitAcces->setUser($user);
                    $entityManager->persist($droitAcces);
                    $entityManager->flush(); 

                    $membreProjet = $entityManager
                    ->getRepository(DroitAcces::class)
                    ->createQueryBuilder('m')
                    ->join('m.projet','projet')
                    ->andWhere('projet.id = :id')
                    ->join('m.user','user')
                    ->andWhere('user.id != :idU')
                    ->setParameters([
                            'id'=>$id,
                            'idU'=> $userId,
                          ])
                    ->getQuery()->getResult(); 
                    $mail->send(
                        'ourteamcollab@gmail.com',
                        $user->getEmail(),
                        $user->getUsername().' '.$user->getLastname(),
                       "Rejoindre l'espace de projet",
                        ucfirst($projet->getNom()),
                        $roleUser
                    );  
                    $email = new EmailNotifications();
                    $email->setUser($user);
                    $email->setStatus(0);
                    $email->setObjet("Rejoindre l'espace de projet");
                   $email->setContenu("Bonjour ".$user->getUsername().' '.$user->getLastname().",\n
                   Bienvenue chez Our Team Collab! \n Vous avez été ajouté à cet espace de projet: ". $projet->getNom()." .\n
                   Votre droit d'accès:" .$roleUser.". \n
                 A très vite sur Our Team Collab.");
                   $email->setDate(date("Y-m-d"));
                   $email->setHeure(date("H:i"));
                   $entityManager->persist($email);
                   $entityManager->flush(); 
                  
                    foreach($membreProjet  as $m){
                        $mailCh->send(
                            'ourteamcollab@gmail.com',
                            ($m->getUser())->getEmail(),
                           "Changement de chef de projet",
                            ucfirst($projet->getNom()),
                            $user->getUsername().' '.$user->getLastname(),
                            $sexe,
                            ($droitAcces->getUser())->getUsername().' '.($droitAcces->getUser())->getLastname(),

                        );  

                        $email = new EmailNotifications();
                        $email->setUser($m->getUser());
                        $email->setStatus(0);
                        $email->setObjet("Changement de chef de projet");
                       $email->setContenu("Chers membres de l'équipe de projet ". ucfirst($projet->getNom()).",
                       \nJ'espère que ce message vous trouve bien.
                       \n Je tiens à vous informer d'un changement important au sein de notre équipe dans notre projet.  
                       \nNous aurons un nouveau chef de projet qui prendra les rênes de notre projet.
                       \nAprès une durée de service dévoué et d'excellent leadership de la part de 
                       ".($droitAcces->getUser())->getUsername().' '.($droitAcces->getUser())->getLastname().", nous lui exprimons nos sincères remerciements pour ses contributions précieuses et son dévouement.
                       \nJe suis ravi de vous annoncer que  ". $user->getUsername().' '.$user->getLastname()." assumera le rôle de chef de projet. 
                       \nNous sommes confiants qu'".$sexe." dirigera notre équipe/projet avec succès.
                      \n
                       A très vite sur Our Team Collab.\n Cordialement.");
                       $email->setDate(date("Y-m-d"));
                       $email->setHeure(date("H:i"));
                       $entityManager->persist($email);
                       $entityManager->flush();
                    }
                }
          return $this->json([
                    'success' =>  'success',
                      ]);
        }
}
