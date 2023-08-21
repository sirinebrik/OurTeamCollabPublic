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
use App\Entity\EmailNotifications;
use App\Entity\Organisation;
use App\Repository\OrganisationRepository;
use App\Repository\EmailNotificationsRepository;
use App\Entity\DroitAcces;
use App\Entity\Task;
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
use App\Service\FileUploader;
use App\Service\SendMailServiceProjet;
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

class ProjetController extends AbstractController
{

    #[Route('/archivéP/{id}', name: 'app_archivéP')]
    public function archivéP(EntityManagerInterface $entityManager,Request $request,int $id): Response
    {
        $p = $entityManager
                ->getRepository(Projet::class)
                ->findById($id);
                $projet=$p[0];
                $projet->setArchive(true);
                $entityManager->persist($projet);
                $entityManager->flush();
              
                    return $this->json(['success' =>  'success']); 
    }

    #[Route('/désarchivéP/{id}', name: 'app_desarchivéP')]
    public function desarchivéP(EntityManagerInterface $entityManager,Request $request,int $id): Response
    {
        $p = $entityManager
                ->getRepository(Projet::class)
                ->findById($id);
                $projet=$p[0];
                $projet->setArchive(false);
                $entityManager->persist($projet);
                $entityManager->flush();
              
                    return $this->json(['success' =>  'success']); 
    }

    #[Route('/projet/acces/{org}', name: 'app_projet_acces')]
    public function projetDesar(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $org=$request->attributes->get('org');

        $projet = $entityManager
        ->getRepository(Projet::class)
        ->createQueryBuilder('m')
        ->andWhere('m.archive = :archive')
        ->join('m.organisation','organisation')
        ->andWhere('organisation.id = :org')
        ->setParameters([
                'archive' => false,
                'org' => $org
              ])
       
        ->getQuery()->getResult();

        $nb=count($projet);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','nom','id','description','document','dateDebut','dateFin','archive']]);
        return $this->json(
            ['projet' =>  $data,'nb' =>  $nb]
        );
    }
    #[Route('/projet/accesArchive/{org}', name: 'app_projet_accesArchive')]
    public function ProjetAr(EntityManagerInterface $entityManager,Request $request): Response
    {
        $org=$request->attributes->get('org');
        $projet = $entityManager
        ->getRepository(Projet::class)
        ->createQueryBuilder('m')
        ->andWhere('m.archive = :archive')
        ->join('m.organisation','organisation')
        ->andWhere('organisation.id = :org')
        ->setParameters([
                'archive' => true,
                'org' => $org
              ])
        ->getQuery()->getResult();

        $nb=count($projet);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','nom','id','description','document','dateDebut','dateFin','archive']]);
        return $this->json(
            ['projet' =>  $data,'nb' =>  $nb]
        );
    }

    #[Route('/ajouterProjet', name: 'app_ajouterProjet')]
    public function AjouterProjet(Request $request,EntityManagerInterface $entityManager, FileUploader $fileUploader,SendMailServiceProjet $mail): Response
    {
        $test = $entityManager
            ->getRepository(Projet::class)
            ->createQueryBuilder('m')
            ->andWhere('m.nom = :nom')
            ->setParameters([
                    'nom'=>ucfirst($request->request->get('nom'))
                  ])
            ->getQuery()->getResult();
            if(count($test)!==0){
                return $this->json([
                    'danger' =>  "Projet existe déjà !", ] , Response::HTTP_NOT_ACCEPTABLE);
              
            }
            else{
            $datetime1 = new DateTime($request->request->get('dateDebut')); 
            $datetime2 = new DateTime($request->request->get('dateFin'));
            if (($datetime1 > $datetime2)||($datetime1 == $datetime2)){
                return $this->json([
                    'danger' =>  "La date de fin ne peut être antérieure à la date de début !", ] , Response::HTTP_NOT_ACCEPTABLE);
            }
            else{
        $projet = new Projet();
        $organisation = $entityManager
        ->getRepository(Organisation::class)
        ->find($request->request->get('org'));
        $content = json_decode($request->getContent());
        $projet->setOrganisation($organisation);

           $projet->setNom(ucfirst($request->request->get('nom')));
           $projet->setDescription($request->request->get('description'));
           $projet->setDateDebut($request->request->get('dateDebut'));
           $projet->setDateFin($request->request->get('dateFin'));
           $document=$request->files->get('document');
           if($document){
            $file = new UploadedFile($document,"demandeFile");
            $fileName = $fileUploader->upload($file);
            $projet->setDocument($fileName);
           
        } 
        $projet->setArchive(false);
        $entityManager->persist($projet);
        $entityManager->flush();
        $phase = new Phase();
        $phase->setProjet($projet);
        $phase->setTitre("Étude de l'existant");
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

        $phase = new Phase();
        $phase->setProjet($projet);
        $phase->setTitre("Conception");
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

        $phase = new Phase();
        $phase->setProjet($projet);
        $phase->setTitre("Développement");
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

        $phase = new Phase();
        $phase->setProjet($projet);
        $phase->setTitre("Tests");
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

        $client=$request->get('client');
        $membre=$request->get('membre');
        $chef=$request->get('chef');
        if($client) {
          
             $droitAcces = new DroitAcces();
             $u =  $entityManager
                 ->getRepository(User::class)
                 ->findById($client['value']);
              $user=$u[0]  ;
             $droitAcces->setProjet($projet);
             $droitAcces->setUser($user);
             $droitAcces->setRole("client");
             $entityManager->persist($droitAcces);
             $entityManager->flush();

             $mail->send(
                'ourteamcollab@gmail.com',
                $user->getEmail(),
                $user->getUsername().' '.$user->getLastname(),
               "Rejoindre l'espace de projet",
                ucfirst($request->request->get('nom')),
                "Client"
            );
            $email = new EmailNotifications();
            $email->setUser($user);
            $email->setStatus(0);
            $email->setObjet("Rejoindre l'espace de projet");
           $email->setContenu("Bonjour ".$user->getUsername().' '.$user->getLastname().",\nBienvenue chezOur Team Collab!\n 
           Vous avez été ajouté à cet espace de projet: ". ucfirst($request->request->get('nom'))."\n
           Votre droit d'accès: Client\n
         A très vite sur Our Team Collab.");
           $email->setDate(date("Y-m-d"));
           $email->setHeure(date("H:i"));
           $entityManager->persist($email);
           $entityManager->flush();
        }
        if($membre) {
           
             $droitAcces = new DroitAcces();
             $u =  $entityManager
                 ->getRepository(User::class)
                 ->findById($membre['value']);
              $user=$u[0]  ;
             $droitAcces->setProjet($projet);
             $droitAcces->setUser($user);
             $droitAcces->setRole("chefProjet");
             $entityManager->persist($droitAcces);
             $entityManager->flush();
            
             $mail->send(
                'ourteamcollab@gmail.com',
                $user->getEmail(),
                $user->getUsername().' '.$user->getLastname(),
               "Rejoindre l'espace de projet",
                ucfirst($request->request->get('nom')),
                "Chef de Projet"
            );
            $email = new EmailNotifications();
            $email->setUser($user);
            $email->setStatus(0);
            $email->setObjet("Rejoindre l'espace de projet");
           $email->setContenu("Bonjour ".$user->getUsername().' '.$user->getLastname().",\n Bienvenue chez Our Team Collab! \n Vous avez été ajouté à cet espace de projet: ". ucfirst($request->request->get('nom'))." .\nVotre droit d'accès: Chef de Projet \n
         A très vite sur Our Team Collab.");
           $email->setDate(date("Y-m-d"));
           $email->setHeure(date("H:i"));
           $entityManager->persist($email);
           $entityManager->flush();
            
        }
        if($chef) {
           
             $droitAcces = new DroitAcces();
             $u =  $entityManager
                 ->getRepository(User::class)
                 ->findById($chef['value']);
              $user=$u[0]  ;
             $droitAcces->setProjet($projet);
             $droitAcces->setUser($user);
             $droitAcces->setRole("chefProjet");
             $entityManager->persist($droitAcces);
             $entityManager->flush();
            
             $mail->send(
                'ourteamcollab@gmail.com',
                $user->getEmail(),
                $user->getUsername().' '.$user->getLastname(),
               "Rejoindre l'espace de projet",
                ucfirst($request->request->get('nom')),
                "Chef de Projet"
            );
            $email = new EmailNotifications();
            $email->setUser($user);
            $email->setStatus(0);
            $email->setObjet("Rejoindre l'espace de projet");
           $email->setContenu("Bonjour ".$user->getUsername().' '.$user->getLastname().",\n
           Bienvenue chez Our Team Collab!\n 
           Vous avez été ajouté à cet espace de projet: ". ucfirst($request->request->get('nom')).".\n
           Votre droit d'accès: Chef de Projet.\n
         A très vite sur Our Team Collab.");
           $email->setDate(date("Y-m-d"));
           $email->setHeure(date("H:i"));
           $entityManager->persist($email);
           $entityManager->flush();
            
        }
        
        
         return $this->json([
                 'success' =>  'success',
                   ]);}}
     }
       
    
     #[Route('/deleteProjet/{id}', name: 'app_deleteProjet')]
     public function deleteProjet(EntityManagerInterface $entityManager,Request $request): Response
     {
        $id=$request->attributes->get('id');
        $p = $entityManager
                    ->getRepository(Projet::class)
                    ->findById($id);
        $projet=$p[0];
        $qb1 =$entityManager->getRepository(DroitAcces::class)
        ->createQueryBuilder('m');
        $affected1 = $qb1->delete()
                ->where('m.projet = :projet')
                ->getQuery()
                ->execute(['projet' => $projet]);
        $qb2 =$entityManager->getRepository(Phase::class)
            ->createQueryBuilder('m');
         $affected2 = $qb2->delete()
             ->where('m.projet = :projet')
            ->getQuery()
            ->execute(['projet' => $projet]);
             
        $qb =$entityManager->getRepository(Projet::class)
        ->createQueryBuilder('m');
        $affected = $qb->delete()
                ->where('m.id = :id')
                ->getQuery()
                ->execute(['id' => $id]);

                return $this->json(['success' =>  'success']); 
     }
     #[Route('/indexProjet/{id}', name: 'app_indexProjet')]
     public function indexProjet(EntityManagerInterface $entityManager,Request $request): Response
     {
        $id=$request->attributes->get('id');
        $projet = $entityManager
                    ->getRepository(Projet::class)
                    ->findById($id);
      
        return $this->json(['projet' =>  $projet]); 
     }
     #[Route('/indexProjetU/{id}/{idU}', name: 'app_indexProjetU')]
     public function indexProjetU(EntityManagerInterface $entityManager,Request $request): Response
     {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
       
        $projet = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->join('m.user','user')
        ->andWhere('projet.id = :id')
        ->andWhere('user.id = :idU')
        ->setParameters([
                'id'=>$id,
                'idU'=>$idU,
              ])
        ->getQuery()->getResult();
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','archive']]]);
        return $this->json(['projet' =>  $data]); 
     }

     #[Route('/updateProjet/{id}', name: 'app_updateProjet')]
     public function updateProjet(EntityManagerInterface $entityManager,Request $request,FileUploader $fileUploader): Response
     {
        $test = $entityManager
        ->getRepository(Projet::class)
        ->createQueryBuilder('m')
        ->andWhere('m.nom = :nom')
        ->andWhere('m.id != :id')
        ->setParameters([
                'nom'=>ucfirst($request->request->get('nom')),
                'id'=> $id=$request->attributes->get('id')
              ])
        ->getQuery()->getResult();
        if(count($test)!==0){
            return $this->json([
                'danger' =>  "Projet existe déjà !", ] , Response::HTTP_NOT_ACCEPTABLE);
          
        }
        else{
            $datetime1 = new DateTime($request->request->get('dateDebut')); 
            $datetime2 = new DateTime($request->request->get('dateFin'));
            if (($datetime1 > $datetime2)||($datetime1 == $datetime2)){
                return $this->json([
                    'danger' =>  "La date de fin ne peut être antérieure à la date de début !", ] , Response::HTTP_NOT_ACCEPTABLE);
            }
            else{
        $id=$request->attributes->get('id');
        $p = $entityManager
                    ->getRepository(Projet::class)
                    ->findById($id);
        $projet=$p[0];
        $projet->setNom(ucfirst($request->request->get('nom')));
        $projet->setDescription($request->request->get('description'));
        $projet->setDateDebut($request->request->get('dateDebut'));
        $projet->setDateFin($request->request->get('dateFin'));
        $document=$request->files->get('document');
        if($document){
         $file = new UploadedFile($document,"demandeFile");
         $fileName = $fileUploader->upload($file);
         $projet->setDocument($fileName);
        
     } 
         if($request->request->get('archivé')==="true"){
            $projet->setArchive(true);}
            else{
               $projet->setArchive(false);  
            }
          $entityManager->persist($projet);
           $entityManager->flush();
        return $this->json([
            'success' =>  "success" ]);}}
        }
     
        #[Route('/supprimerDocument/{id}', name: 'app_supprimerDocument')]
        public function supprimerDocument(EntityManagerInterface $entityManager,Request $request,int $id): Response
        {
            $p = $entityManager
                    ->getRepository(Projet::class)
                    ->findById($id);
                    $projet=$p[0];
                    $projet->setDocument(null);
                    $entityManager->persist($projet);
                    $entityManager->flush();
                  
                        return $this->json(['success' =>  'success']); 
        } 
//admin
#[Route('/tousUsers/{org}', name: 'app_tousUsers', methods: ['GET'])]
public function tousUsers(EntityManagerInterface $entityManager,Request $request,): Response
 {               $org=$request->attributes->get('org');

     $user = $entityManager
         ->getRepository(User::class)
         ->createQueryBuilder('u')
         ->andWhere('u.roles != :role')
         ->join('u.organisation','organisation')
         ->andWhere('organisation.id = :org')      
         ->setParameters([ 'role' => '["ROLE_ADMIN"]','org' => $org])
         ->getQuery()->getResult();
 
         $nb=count($user);
   
         return $this->json(['users' =>  $user,'nb' =>  $nb]);
 }

 #[Route('/tousProjets/{org}', name: 'app_tousProjets')]
 public function tousProjets(EntityManagerInterface $entityManager,Request $request): Response
 {
    $org=$request->attributes->get('org');

    $projet = $entityManager
    ->getRepository(Projet::class)
    ->createQueryBuilder('m')
    ->join('m.organisation','organisation')
    ->andWhere('organisation.id = :org')  
    ->setParameters([
        'org' => $org
      ])
    ->getQuery()->getResult();
    $serializer = new Serializer([new ObjectNormalizer()]);

    $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','nom','id','description','document','archive']]);
    return $this->json(['projets' =>  $data]); 
 }
 #[Route('/tousProjetsArchi/{org}', name: 'app_tousProjetsArchi')]
 public function tousProjetsArchi(EntityManagerInterface $entityManager,Request $request): Response
 {
    $org=$request->attributes->get('org');

    $projet = $entityManager
    ->getRepository(Projet::class)
    ->createQueryBuilder('m')
    ->andWhere('m.archive = :archive')
    ->join('m.organisation','organisation')
    ->andWhere('organisation.id = :org')    
    ->setParameters([
            'archive'=>true
            ,'org' => $org
          ])
    ->getQuery()->getResult();
    $serializer = new Serializer([new ObjectNormalizer()]);

    $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','nom','id','description','document','archive']]);
    return $this->json(['projets' =>  $data]); 
 }
 #[Route('/tousProjetsRole/{org}', name: 'app_tousProjetsRole')]
 public function tousProjetsRole(EntityManagerInterface $entityManager,Request $request): Response
 {
    $org=$request->attributes->get('org');

    $projet = $entityManager
    ->getRepository(DroitAcces::class)
    ->createQueryBuilder('m')
    ->andWhere('m.role = :role1')
    ->orWhere('m.role = :role2')
    ->join('m.projet','projet')
    ->join('projet.organisation','organisation')
    ->andWhere('organisation.id = :org')   
    ->setParameters([
            'role1'=>'chefProjet',
            'role2'=>'client'
            ,'org' => $org
          ])
    ->getQuery()->getResult();
    $serializer = new Serializer([new ObjectNormalizer()]);

    $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','archive']]]);
    return $this->json(['users' =>  $data]); 
 }

//user
        #[Route('/projetU/{idU}', name: 'app_projetU')]
        public function projetU(EntityManagerInterface $entityManager,Request $request): Response
        {
           $idU=$request->attributes->get('idU');
           $projet = $entityManager
           ->getRepository(DroitAcces::class)
           ->createQueryBuilder('m')
           ->join('m.projet','projet')
           ->join('m.user','user')
           ->andWhere('user.id = :idU')
           ->setParameters([
                   'idU'=>$idU,
                 ])
           ->getQuery()->getResult();
           $serializer = new Serializer([new ObjectNormalizer()]);
   
           $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','archive']]]);
           return $this->json(['projets' =>  $data]); 
        }
      

    #[Route('/tasksUserProjet/{idU}', name: 'app_tasksUserProjet')]
    public function tasksUserProjet(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('idU');
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->andWhere('user.id = :id')
        ->setParameters([
                'id'=>$id,])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
        return $this->json(
            ['task' =>  $data]
        );
    }

    #[Route('/reunionsUserTous/{idU}', name: 'app_reunionsUserTous')]
    public function reunionsUserTous(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('idU');
     
        $par = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->andWhere('user.id = :id')
        ->setParameters([
                'id'=>$id, ])
        ->getQuery()->getResult();
      
      return $this->json([
            'reunions' =>  $par,
              ]);
            
    }
//chefProjet
    #[Route('/tasksChefProjetTous/{id}', name: 'app_tasksChefProjetTous')]
    public function tasksChefProjetTous(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->join('m.etat','etat')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
        return $this->json(
            ['tasks' =>  $data]
        );
    }

    #[Route('/tasksChefProjetValide/{id}', name: 'app_tasksChefProjetValide')]
    public function tasksChefProjetValide(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->andWhere('m.valide = :valide')
        ->join('m.etat','etat')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
                'valide'=>true])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
        return $this->json(
            ['tasks' =>  $data]
        );
    }
    #[Route('/tasksChefProjetRefus/{id}', name: 'app_tasksChefProjetRefus')]
    public function tasksChefProjetRefus(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->andWhere('m.valide = :valide')
        ->join('m.etat','etat')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
                'valide'=>false])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
        return $this->json(
            ['tasks' =>  $data]
        );
    }
    #[Route('/tasksUserTermine/{idU}/{id}', name: 'app_tasksUserTermine')]
    public function tasksUserTermine(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->join('m.etat','etat')
        ->andWhere('etat.titre = :titre')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('user.id = :idU')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
                'idU'=>$idU,
                'titre'=>'Terminé'])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
        return $this->json(
            ['tasks' =>  $data]
        );
    }

    #[Route('/tasksUserBloque/{idU}/{id}', name: 'app_tasksUserBloque')]
    public function tasksUserBloque(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->join('m.etat','etat')
        ->andWhere('etat.titre = :titre')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('user.id = :idU')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
                'idU'=>$idU,
                'titre'=>'Bloqué'])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
        return $this->json(
            ['tasks' =>  $data]
        );
    }
    #[Route('/reunionsChefAnnule/{id}', name: 'app_reunionsChefAnnule')]
    public function reunionsChefAnnule(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
     
        $par = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('m.reunion','reunion')
        ->join('users.projet','projet')
        ->andWhere('projet.id = :id')
        ->andWhere('reunion.annule = :annule')
        ->setParameters([
                'id'=>$id,
                'annule'=>true, ])
        ->groupBy('reunion.id')
        ->getQuery()->getResult();
      
      return $this->json([
            'reunions' =>  $par,
              ]);
            
    }

    #[Route('/reunionsChefTous/{id}', name: 'app_reunionsChefTous')]
    public function reunionsChefTous(Request $request,EntityManagerInterface $entityManager): Response
    {
       
        $idP=$request->attributes->get('id');
        $par = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('m.reunion','reunion')
        ->join('users.projet','projet')
        ->andWhere('projet.id = :idP')
        ->setParameters([
              'idP'=>$idP, ])
        ->groupBy('reunion.id')
        ->getQuery()->getResult();
      
      return $this->json([
            'reunions' =>  $par,
              ]);
            
    }
    #[Route('/tousMembresProjetChef/{id}', name: 'app_tousMembresProjetChef')]
    public function tousMembresProjetChef(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
       $projet = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->andWhere('projet.id = :id')
       ->andWhere('m.role = :role1')
       ->setParameters([
               'role1'=>'membre',
               'id'=>$id
             ])
       ->getQuery()->getResult();
       $serializer = new Serializer([new ObjectNormalizer()]);
   
       $data = $serializer->normalize($projet, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','archive']]]);
       return $this->json(['users' =>  $data]); 
    }
    //membreChefProjet
    #[Route('/tousMembresProjetChefMembre/{id}/{idU}', name: 'app_tousMembresProjetChefMembre')]
    public function tousMembresProjetChefMembre(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $data=[];
        $role = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
         ->join('m.projet','projet')
         ->join('m.user','user')
         ->andWhere('user.id = :idU')
         ->andWhere('projet.id = :id')
        ->andWhere('m.role = :role1')
        ->setParameters([
                'role1'=>'chefProjet',
                'id'=>$id,
                'idU'=>$idU
              ])
        ->getQuery()->getResult();
if(count($role)!==0){
       $users = $entityManager
       ->getRepository(DroitAcces::class)
       ->createQueryBuilder('m')
        ->join('m.projet','projet')
        ->andWhere('projet.id = :id')
       ->andWhere('m.role = :role1')
       ->setParameters([
               'role1'=>'membre',
               'id'=>$id
             ])
       ->getQuery()->getResult();
       $serializer = new Serializer([new ObjectNormalizer()]);
   
       $data = $serializer->normalize($users, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname'],'projet' => ['id','nom','id','description','document','archive']]]);
    }
   
       return $this->json(['users' =>  $data]); 
    }
    #[Route('/tousTasksChefMembre/{id}/{idU}', name: 'app_tousTasksChefMembre')]
    public function tousTasksChefMembre(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $data=[];
        $role = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
         ->join('m.projet','projet')
         ->join('m.user','user')
         ->andWhere('user.id = :idU')
         ->andWhere('projet.id = :id')
        ->andWhere('m.role = :role1')
        ->setParameters([
                'role1'=>'chefProjet',
                'id'=>$id,
                'idU'=>$idU
              ])
        ->getQuery()->getResult();
if(count($role)!==0){
    $task = $entityManager
    ->getRepository(Task::class)
    ->createQueryBuilder('m')
    ->join('m.etat','etat')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id])
    ->getQuery()->getResult();

    $serializer = new Serializer([new ObjectNormalizer()]);

    $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
    }
   
       return $this->json(['tasks' =>  $data]); 
    }
    #[Route('/tasksMembreTous/{id}/{idU}', name: 'app_tasksMembreTous')]
    public function tasksMembreTous(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->join('m.etat','etat')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('projet.id = :id')
        ->andWhere('user.id = :idU')
        ->setParameters([
                'id'=>$id,
                'idU'=>$idU,
               ])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
        return $this->json(
            ['tasks' =>  $data]
        );
    }
    #[Route('/tasksMembreValide/{id}/{idU}', name: 'app_tasksMembreValide')]
    public function tasksMembreValide(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $data=[];
        $role = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
         ->join('m.projet','projet')
         ->join('m.user','user')
         ->andWhere('user.id = :idU')
         ->andWhere('projet.id = :id')
        ->andWhere('m.role = :role1')
        ->setParameters([
                'role1'=>'chefProjet',
                'id'=>$id,
                'idU'=>$idU
              ])
        ->getQuery()->getResult();
if(count($role)!==0){
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->andWhere('m.valide = :valide')
        ->join('m.etat','etat')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
                'valide'=>true])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
}
        return $this->json(
            ['tasks' =>  $data]
        );
    }

    #[Route('/tasksMembreRefus/{id}/{idU}', name: 'app_tasksMembreRefus')]
    public function tasksMembreRefus(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $data=[];
        $role = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
         ->join('m.projet','projet')
         ->join('m.user','user')
         ->andWhere('user.id = :idU')
         ->andWhere('projet.id = :id')
        ->andWhere('m.role = :role1')
        ->setParameters([
                'role1'=>'chefProjet',
                'id'=>$id,
                'idU'=>$idU
              ])
        ->getQuery()->getResult();
if(count($role)!==0){
        $task = $entityManager
        ->getRepository(Task::class)
        ->createQueryBuilder('m')
        ->andWhere('m.valide = :valide')
        ->join('m.etat','etat')
        ->join('etat.phase','phase')
        ->join('phase.projet','projet')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
                'valide'=>false])
        ->getQuery()->getResult();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
}
        return $this->json(
            ['tasks' =>  $data]
        );
    }


    
    #[Route('/reunionMembreChefTous/{id}/{idU}', name: 'app_reunionMembreChefTous')]
    public function reunionMembreChefTous(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $data=[];
        $role = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
         ->join('m.projet','projet')
         ->join('m.user','user')
         ->andWhere('user.id = :idU')
         ->andWhere('projet.id = :id')
        ->andWhere('m.role = :role1')
        ->setParameters([
                'role1'=>'chefProjet',
                'id'=>$id,
                'idU'=>$idU
              ])
        ->getQuery()->getResult();
if(count($role)!==0){

    $par = $entityManager
    ->getRepository(ParticipationReunion::class)
    ->createQueryBuilder('m')
    ->join('m.user','users')
    ->join('m.reunion','reunion')
    ->join('users.projet','projet')
    ->andWhere('projet.id = :id')
    ->setParameters([
          'id'=>$id, ])
    ->groupBy('reunion.id')
    ->getQuery()->getResult();
        $data = $par;
}
        return $this->json(
            ['reunions' =>  $data]
        );
    }


    #[Route('/reunionMembreChefAnnule/{id}/{idU}', name: 'app_reunionMembreChefAnnule')]
    public function reunionMembreChefAnnule(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $data=[];
        $role = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
         ->join('m.projet','projet')
         ->join('m.user','user')
         ->andWhere('user.id = :idU')
         ->andWhere('projet.id = :id')
        ->andWhere('m.role = :role1')
        ->setParameters([
                'role1'=>'chefProjet',
                'id'=>$id,
                'idU'=>$idU
              ])
        ->getQuery()->getResult();
if(count($role)!==0){

    $par = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('m.reunion','reunion')
        ->join('users.projet','projet')
        ->andWhere('projet.id = :id')
        ->andWhere('reunion.annule = :annule')
        ->setParameters([
                'id'=>$id,
                'annule'=>true, ])
        ->groupBy('reunion.id')
        ->getQuery()->getResult();

        $data = $par;
}
        return $this->json(
            ['reunions' =>  $data]
        );
    }

    #[Route('/reunionMembreTous/{id}/{idU}', name: 'app_reunionMembreTous')]
    public function reunionMembreTous(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $data=[];
        $role = $entityManager
        ->getRepository(DroitAcces::class)
        ->createQueryBuilder('m')
         ->join('m.projet','projet')
         ->join('m.user','user')
         ->andWhere('user.id = :idU')
         ->andWhere('projet.id = :id')
        ->andWhere('m.role = :role1')
        ->setParameters([
                'role1'=>'membre',
                'id'=>$id,
                'idU'=>$idU
              ])
        ->getQuery()->getResult();
if(count($role)!==0){

    $par = $entityManager
    ->getRepository(ParticipationReunion::class)
    ->createQueryBuilder('m')
    ->join('m.user','users')
    ->join('users.user','user')
    ->join('users.projet','projet')
    ->andWhere('projet.id = :id')
    ->andWhere('user.id = :idU')
    ->setParameters([
          'id'=>$id,
          'idU'=>$idU,])
    ->getQuery()->getResult();

        $data =$par;
}
        return $this->json(
            ['reunions' =>  $data]
        );
    }
    #[Route('/reunionClientTous/{id}/{idU}', name: 'app_reunionClientTous')]
    public function reunionClientTous(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
     $par = $entityManager
    ->getRepository(ParticipationReunion::class)
    ->createQueryBuilder('m')
    ->join('m.user','users')
    ->join('users.user','user')
    ->join('users.projet','projet')
    ->andWhere('projet.id = :id')
    ->andWhere('user.id = :idU')
    ->setParameters([
          'id'=>$id,
          'idU'=>$idU,])
    ->getQuery()->getResult();

        return $this->json(
            ['reunions' =>  $par]
        );
    }
}
