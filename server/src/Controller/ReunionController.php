<?php

namespace App\Controller;

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

class ReunionController extends AbstractController
{
  
  public function __construct(
     
    private JWTEncoderInterface $encoder,
    
    )
{}
    #[Route('/mesReunions/{id}/{idU}', name: 'app_mesReunions')]
    public function mesReunions(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $reunion = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->join('users.projet','projet')
        ->andWhere('user.id = :idU')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
                'idU'=>$idU
              ])
        ->getQuery()->getResult();

        $nb=count($reunion);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($reunion, null, [AbstractNormalizer::ATTRIBUTES => ['id','presence','note','reunion'=>['id','titre','date','heureDebut','heureFin','description','lien','annule','raisonAnnulation'],]]);
        return $this->json(
            ['reunion' =>  $data,'nb' =>  $nb]
        );
    }
    #[Route('/reunionsAdmin/{id}', name: 'app_reunionsAdmin')]
    public function reunionsAdmin(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $reunion = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.projet','projet')
        ->andWhere('projet.id = :id')
        ->setParameters([
                'id'=>$id,
              ])
        ->groupBy("m.reunion")
        ->getQuery()->getResult();

        $nb=count($reunion);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($reunion, null, [AbstractNormalizer::ATTRIBUTES => ['id','presence','note','reunion'=>['id','titre','date','heureDebut','heureFin','description','lien','annule','raisonAnnulation'],]]);
        return $this->json(
            ['reunion' =>  $data,'nb' =>  $nb]
        );
    }
    #[Route('/reunion/{id}/{idR}', name: 'app_reunion')]
    public function reunion(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idR=$request->attributes->get('idR');
        $reunion = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->join('m.reunion','reunion')
        ->andWhere('user.id = :id')
        ->andWhere('reunion.id = :idR')
        ->setParameters([
                'id'=>$id,
                'idR'=>$idR
              ])
        ->getQuery()->getResult();
        $reunionUser = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.reunion','reunion')
        ->andWhere('reunion.id = :idR')
        ->setParameters([
                'idR'=>$idR
              ])
        ->getQuery()->getResult();  

        $nb=count($reunionUser);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($reunion, null, [AbstractNormalizer::ATTRIBUTES => ['id','presence','note','reunion'=>['id','titre','date','heureDebut','heureFin','description','lien','annule','raisonAnnulation'],]]);
        $data1 = $serializer->normalize($reunionUser, null, [AbstractNormalizer::ATTRIBUTES => ['id','presence','note','reunion'=>['id','titre','date','heureDebut','heureFin','description','lien','annule','raisonAnnulation'],'user'=>['id','role','user' => ['sexe','username','id','roles','email','etat','photo','lastname']]]]);

        return $this->json(
            ['reunion' =>  $data,'reunionUser' =>  $data1,'nb' =>  $nb]
        );
    }

    #[Route('/reunionAdmin/{idR}', name: 'app_reunionAdmin')]
    public function reunionAdmin(EntityManagerInterface $entityManager,Request $request): Response
    {
        $idR=$request->attributes->get('idR');
      
        $reunionUser = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.reunion','reunion')
        ->andWhere('reunion.id = :idR')
        ->setParameters([
                'idR'=>$idR
              ])
        ->groupBy("m.reunion")
        ->getQuery()->getResult();  

        $nb=count($reunionUser);
        $serializer = new Serializer([new ObjectNormalizer()]);
        $data1 = $serializer->normalize($reunionUser, null, [AbstractNormalizer::ATTRIBUTES => ['id','presence','note','reunion'=>['id','titre','date','heureDebut','heureFin','description','lien','annule','raisonAnnulation'],'user'=>['id','role','user' => ['sexe','username','id','roles','email','etat','photo','lastname']]]]);

        return $this->json(
            ['reunion' =>  $data1,'nb' =>  $nb]
        );
    }
    #[Route('/ajouterReunion/{id}', name: 'app_ajouterReunion')]
    public function AjouterReunion(Request $request,EntityManagerInterface $entityManager,SendMailServiceReunion $mail): Response
    {
      $id=$request->attributes->get('id');
        $heureDebut = new DateTime($request->request->get('heureDebut')); 
        $heureFin = new DateTime($request->request->get('heureFin'));
        if (($heureDebut > $heureFin)||($heureDebut == $heureFin)){
            return $this->json([
                'danger' =>  "L'heure de fin ne peut être antérieure à l'heure de début !", ] , Response::HTTP_NOT_ACCEPTABLE);
        }
        else{
        $reunion = new Reunion();
        $content = json_decode($request->getContent());
           $reunion->setTitre(ucfirst($request->request->get('titre')));
           $reunion->setDescription($request->request->get('description'));
           $reunion->setDate($request->request->get('date'));
           $reunion->setLien($request->request->get('lien'));
           $reunion->setHeureDebut($request->request->get('heureDebut'));
           $reunion->setHeureFin($request->request->get('heureFin'));
           $reunion->setAnnule(false);
        $entityManager->persist($reunion);
        $entityManager->flush();
        $reunion->setLien($request->request->get('lien')."/".$reunion->getId()); 
        $entityManager->persist($reunion);
        $entityManager->flush();
        $c=  $entityManager
             ->getRepository(DroitAcces::class)
             ->createQueryBuilder('m')
             ->andWhere('m.role = :role')
             ->join('m.projet','projet')
             ->andWhere('projet.id = :id')
             ->setParameters([
                'role'=>'chefProjet',
                'id'=>$id,
              ])
            ->getQuery()->getResult();
              $chef=$c[0]  ;
              $participationReunion1 = new ParticipationReunion();
              $participationReunion1->setReunion($reunion);
              $participationReunion1->setUser($chef);
              $entityManager->persist($participationReunion1);
              $entityManager->flush();

        $users=$request->get('users');
        if(count((array)$users)!==0) {
            foreach($users as $users) {
             $participationReunion = new ParticipationReunion();
             $u =  $entityManager
                 ->getRepository(DroitAcces::class)
                 ->findById($users['value']);
              $user=$u[0]  ;
             $participationReunion->setReunion($reunion);
             $participationReunion->setUser($user);
             $entityManager->persist($participationReunion);
             $entityManager->flush();
          
             $mail->send(
                'ourteamcollab@gmail.com',
                $user->getUser()->getEmail(),
                $user->getUser()->getUsername().' '.$user->getUser()->getLastname(),
               "Invitation à participer à une réunion",
                ucfirst($request->request->get('titre')),
                $request->request->get('description'),
                $request->request->get('date'),
                $request->request->get('heureDebut'),
                $request->request->get('heureFin'),
                $request->request->get('lien'),
                $user->getProjet()->getNom(), );

                $email = new EmailNotifications();
                $email->setUser($user->getUser());
                $email->setStatus(0);
                $email->setObjet("Invitation à participer à une réunion");
               $email->setContenu("Cher/Chère  ".$user->getUser()->getUsername().' '.$user->getUser()->getLastname().",
          \nJ'espère que ce courrier vous trouve bien. Je tiens à vous inviter à une réunion qui se tiendra dans le cadre de notre projet ". $user->getProjet()->getNom().". Votre présence et votre contribution sont essentielles pour le succès de cette réunion et pour faire progresser le projet vers ses objectifs.
                 \nVoici les détails de la réunion: \n
             Titre:  ". ucfirst($request->request->get('titre')).".\n Date: ".  $request->request->get('date').".\n 
              Heure Début: ". $request->request->get('heureDebut').".\nHeure Fin: ". $request->request->get('heureFin').".\n
               Description:  ".$request->request->get('description').".\nLien:  ".  $request->request->get('lien').".\n
               Veuillez confirmer votre présence dans notre plateforme avant ". $request->request->get('date')." pour rejoindre la réunion.
               \n A très vite sur Our Team Collab.\nCordialement.");
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
    #[Route('/deleteRéunion/{id}', name: 'app_deleteRéunion')]
    public function deleteRéunion(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('id');
       $qb =$entityManager->getRepository(Reunion::class)
       ->createQueryBuilder('m');
       $affected = $qb->delete()
               ->where('m.id = :id')
               ->getQuery()
               ->execute(['id' => $id]);

               return $this->json(['success' =>  'success']); 
    }
    #[Route('/annuleReunion/{id}', name: 'app_annuleReunion')]
    public function annuleRéunion(EntityManagerInterface $entityManager,Request $request,SendMailServiceAnnulerReunion $mail): Response
    {
       $id=$request->attributes->get('id');
       $r = $entityManager
       ->getRepository(Reunion::class)
       ->findById($id);
      $reunion=$r[0];
      $reunion->setAnnule(true);
      $reunion->setRaisonAnnulation($request->request->get('raison'));
        $entityManager->persist($reunion);
        $entityManager->flush();
       $reunionUser = $entityManager
       ->getRepository(ParticipationReunion::class)
       ->createQueryBuilder('m')
       ->join('m.reunion','reunion')
       ->andWhere('reunion.id = :idR')
       ->setParameters([
               'idR'=>$id
             ])
       ->getQuery()->getResult();  
       foreach($reunionUser as $reunionUser) {
        if($reunionUser->getUser()->getRole()!=="chefProjet"){
          $mail->send(
           'ourteamcollab@gmail.com',
           $reunionUser->getUser()->getUser()->getEmail(),
           $reunionUser->getUser()->getUser()->getUsername().' '.$reunionUser->getUser()->getUser()->getLastname(),
          "Annulation de la réunion - Raison",
          $reunionUser->getReunion()->getTitre(),
          $reunionUser->getReunion()->getDate(),
          $reunionUser->getReunion()->getHeureDebut(),
           $reunionUser->getUser()->getProjet()->getNom(),
           $request->request->get('raison') );

           $email = new EmailNotifications();
           $email->setUser( $reunionUser->getUser()->getUser());
           $email->setStatus(0);
           $email->setObjet("Annulation de la réunion - Raison");
          $email->setContenu("Cher/Chère ".   $reunionUser->getUser()->getUser()->getUsername().' '.$reunionUser->getUser()->getUser()->getLastname().",
         \nJ'espère que ce courrier vous trouve bien. Je regrette de devoir vous informer que la réunion ".   $reunionUser->getReunion()->getTitre()." prévue pour
          ".   $reunionUser->getReunion()->getDate()." à ".   $reunionUser->getReunion()->getHeureDebut()."est annulée dans le cadre de notre projet 
          ".  $reunionUser->getUser()->getProjet()->getNom().".
           \nLa raison de cette annulation est ".   $request->request->get('raison').". 
           \nJe comprends que cela peut causer des désagréments et je m'excuse sincèrement pour tout inconvénient que cela pourrait causer
            à votre emploi du temps. Nous ferons de notre mieux pour reprogrammer la réunion dès que possible.
          \nN'hésitez pas à me contacter si vous avez des questions ou des préoccupations.
           \nA très vite sur Our Team Collab.\nCordialement.");
          $email->setDate(date("Y-m-d"));
          $email->setHeure(date("H:i"));
          $entityManager->persist($email);
          $entityManager->flush();
          }
       }
   
               return $this->json(['success' =>  'success']); 
    }
    #[Route('/updateReunion/{id}', name: 'app_updateReunion')]
    public function updateReunion(Request $request,EntityManagerInterface $entityManager,SendMailServiceReunion $mail,SendMailServiceAnnulerReunion $mail1): Response
    {
        $id=$request->attributes->get('id');
        $heureDebut = new DateTime($request->request->get('heureDebut')); 
        $heureFin = new DateTime($request->request->get('heureFin'));
        if (($heureDebut > $heureFin)||($heureDebut == $heureFin)){
            return $this->json([
                'danger' =>  "L'heure de fin ne peut être antérieure à l'heure de début !", ] , Response::HTTP_NOT_ACCEPTABLE);
        }
        else{
            $r = $entityManager
            ->getRepository(Reunion::class)
            ->findById($id);
           $reunion=$r[0];
        $content = json_decode($request->getContent());
           $reunion->setTitre(ucfirst($request->request->get('titre')));
           $reunion->setDescription($request->request->get('description'));
           $reunion->setDate($request->request->get('date'));
           $reunion->setLien($request->request->get('lien'));
           $reunion->setHeureDebut($request->request->get('heureDebut'));
           $reunion->setHeureFin($request->request->get('heureFin'));
           if($request->request->get('annule')==="true"){
            $reunion->setAnnule(true);}
            else{
                $reunion->setAnnule(false);  
            }
           $reunion->setRaisonAnnulation($request->request->get('raison'));
        $entityManager->persist($reunion);
        $entityManager->flush();
       
        $par = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('m.reunion','reunion')
        ->andWhere('users.role != :role')
        ->andWhere('reunion.id = :id')
        ->setParameters([
                'id'=>$id,
                'role'=>"chefProjet",
              ])
        ->getQuery()->getResult();
      
        foreach($par as $par) {
            $qb =$entityManager->getRepository(ParticipationReunion::class)
            ->createQueryBuilder('m');
            $affected = $qb->delete()
                    ->where('m.id = :id')
                    ->getQuery()
                    ->execute(['id' => $par->getId()]);
        }
        $users=$request->get('users');
        if($request->request->get('annule')==="false"&&count((array)$users)!==0) {
            foreach($users as $users) {
          
             $participationReunion = new ParticipationReunion();
             $u =  $entityManager
                 ->getRepository(DroitAcces::class)
                 ->findById($users['value']);
              $user=$u[0]  ;
             $participationReunion->setReunion($reunion);
             $participationReunion->setUser($user);
             $entityManager->persist($participationReunion);
             $entityManager->flush();
          
             $mail->send(
                'ourteamcollab@gmail.com',
                $user->getUser()->getEmail(),
                $user->getUser()->getUsername().' '.$user->getUser()->getLastname(),
               "Invitation à participer à une réunion",
                ucfirst($request->request->get('titre')),
                $request->request->get('description'),
                $request->request->get('date'),
                $request->request->get('heureDebut'),
                $request->request->get('heureFin'),
                $request->request->get('lien'),
                $user->getProjet()->getNom(), );

                $email = new EmailNotifications();
                $email->setUser($user->getUser());
                $email->setStatus(0);
                $email->setObjet("Invitation à participer à une réunion");
               $email->setContenu("Cher/Chère  ".$user->getUser()->getUsername().' '.$user->getUser()->getLastname().",
          \nJ'espère que ce courrier vous trouve bien. Je tiens à vous 
               inviter à une réunion qui se tiendra dans le cadre de notre projet ". $user->getProjet()->getNom().". Votre présence 
                et votre contribution sont essentielles pour le succès de cette réunion et pour
                 faire progresser le projet vers ses objectifs.
                 \nVoici les détails de la réunion: \n
             Titre:  ". ucfirst($request->request->get('titre')).".\n Date: ".  $request->request->get('date').".\n 
              Heure Début: ". $request->request->get('heureDebut').".\nHeure Fin: ". $request->request->get('heureFin').".\n
               Description:  ".$request->request->get('description').".\nLien:  ".  $request->request->get('lien').".\n
               Veuillez confirmer votre présence dans notre plateforme avant ". $request->request->get('date')." pour rejoindre la réunion.
               \n A très vite sur Our Team Collab.\nCordialement.");
               $email->setDate(date("Y-m-d"));
               $email->setHeure(date("H:i"));
               $entityManager->persist($email);
               $entityManager->flush();

            }

        }
        if($request->request->get('annule')==="true"&&count((array)$users)!==0) {
            foreach($users as $users) {
          
             $participationReunion = new ParticipationReunion();
             $u =  $entityManager
                 ->getRepository(DroitAcces::class)
                 ->findById($users['value']);
              $user=$u[0]  ;
             $participationReunion->setReunion($reunion);
             $participationReunion->setUser($user);
             $entityManager->persist($participationReunion);
             $entityManager->flush();
             $mail1->send(
                'ourteamcollab@gmail.com',
                $user->getUser()->getEmail(),
                $user->getUser()->getUsername().' '.$user->getUser()->getLastname(),
                  "Annulation de la réunion - Raison",
                  ucfirst($request->request->get('titre')),
                  $request->request->get('date'),
                  $request->request->get('heureDebut'),
                  $user->getProjet()->getNom(), 
                $request->request->get('raison') );

                $email = new EmailNotifications();
                $email->setUser($user->getUser());
                $email->setStatus(0);
                $email->setObjet("Annulation de la réunion - Raison");
               $email->setContenu("Cher/Chère ".  $user->getUser()->getUsername().' '.$user->getUser()->getLastname().",
              \nJ'espère que ce courrier vous trouve bien. 
               Je regrette de devoir vous informer que la réunion ". $request->request->get('titre')." prévue pour
               ".  $request->request->get('date')." à ".  $request->request->get('heureDebut')."est annulée dans le cadre de notre projet ".$user->getProjet()->getNom().".
                \nLa raison de cette annulation est ".   $request->request->get('raison').". 
                \nJe comprends que cela peut causer des désagréments et je m'excuse sincèrement pour tout inconvénient que cela pourrait causer
                 à votre emploi du temps. Nous ferons de notre mieux pour reprogrammer la réunion dès que possible.
               \nN'hésitez pas à me contacter si vous avez des questions ou des préoccupations.
                \nA très vite sur Our Team Collab.\n Cordialement.");
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

    #[Route('/presenceNonReunion/{id}', name: 'app_presenceNonReunion')]
    public function presenceNonReunion(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('id');
       $r = $entityManager
       ->getRepository(ParticipationReunion::class)
       ->findById($id);
      $participationReunion=$r[0];
      $participationReunion->setPresence(false);
      $entityManager->persist($participationReunion);
      $entityManager->flush();
    return $this->json(['success' =>  'success']); 
    }
    
    #[Route('/presenceOuiReunion/{id}', name: 'app_presenceOuiReunion')]
    public function presenceOuiReunion(EntityManagerInterface $entityManager,Request $request): Response
    {
       $id=$request->attributes->get('id');
       $r = $entityManager
       ->getRepository(ParticipationReunion::class)
       ->findById($id);
      $participationReunion=$r[0];
      $participationReunion->setPresence(true);
      $entityManager->persist($participationReunion);
      $entityManager->flush();
    return $this->json(['success' =>  'success']); 
    }


    #[Route('/usersReunion/{id}', name: 'app_usersReunion')]
    public function usersReunion(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
     
        $par = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('m.reunion','reunion')
        ->andWhere('reunion.id = :id')
        ->setParameters([
                'id'=>$id,
              ])
        ->getQuery()->getResult();
      
      return $this->json([
            'users' =>  $par,
              ]);
            
    }

    #[Route('/note/{id}/{idU}', name: 'app_note')]
    public function note(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $par = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->join('m.reunion','reunion')
        ->andWhere('reunion.id = :id')
        ->andWhere('user.id = :idU')
        ->setParameters([
                'id'=>$id,
                'idU'=>$idU,
              ])
        ->getQuery()->getResult();
      $jwtToken = $this->encoder->encode(['note' =>$request->request->get('note')]);
      $par[0]->setNote(  $jwtToken);
      $entityManager->persist($par[0]);
      $entityManager->flush();
      return $this->json([
            'success' => 'success',
              ]);
            
    }
    #[Route('/noteUser/{id}/{idU}', name: 'app_noteUser')]
    public function noteUser(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $par = $entityManager
        ->getRepository(ParticipationReunion::class)
        ->createQueryBuilder('m')
        ->join('m.user','users')
        ->join('users.user','user')
        ->join('m.reunion','reunion')
        ->andWhere('reunion.id = :id')
        ->andWhere('user.id = :idU')
        ->setParameters([
                'id'=>$id,
                'idU'=>$idU,
              ])
        ->getQuery()->getResult();
        $tokenParts = explode(".",  $par[0]->getNote());  
        $tokenHeader = base64_decode($tokenParts[0]);
        $tokenPayload = base64_decode($tokenParts[1]);
        $jwtHeader = json_decode($tokenHeader);
        $jwtPayload = json_decode($tokenPayload);
     
      return $this->json([
            'note' =>  $jwtPayload ->note,
              ]);
            
    }

    #[Route('/inviterReunion/{id}', name: 'app_inviterReunion')]
    public function inviterReunion(Request $request,EntityManagerInterface $entityManager,SendMailServiceReunion $mail): Response
    {
        $id=$request->attributes->get('id');
        $users=$request->get('users');
        $reunion = $entityManager
        ->getRepository(Reunion::class)
        ->findById($id);
        if(count((array)$users)!==0) {
            foreach($users as $users) {
             $participationReunion = new ParticipationReunion();
             $u =  $entityManager
                 ->getRepository(DroitAcces::class)
                 ->findById($users['value']);
              $user=$u[0]  ;
             $participationReunion->setReunion($reunion[0]);
             $participationReunion->setUser($user);
             $entityManager->persist($participationReunion);
             $entityManager->flush();
          
             $mail->send(
                'ourteamcollab@gmail.com',
                $user->getUser()->getEmail(),
                $user->getUser()->getUsername().' '.$user->getUser()->getLastname(),
               "Invitation à participer à une réunion",
               $reunion[0]->getTitre(),
               $reunion[0]->getDescription(),
               $reunion[0]->getDate(),
               $reunion[0]->getHeureDebut(),
               $reunion[0]->getHeureFin(),
               $reunion[0]->getLien(),
                $user->getProjet()->getNom(), );

                $email = new EmailNotifications();
                $email->setUser($user->getUser());
                $email->setStatus(0);
                $email->setObjet("Invitation à participer à une réunion");
               $email->setContenu("Cher/Chère  ".$user->getUser()->getUsername().' '.$user->getUser()->getLastname().",
          \nJ'espère que ce courrier vous trouve bien. Je tiens à vous 
               inviter à une réunion qui se tiendra dans le cadre de notre projet ". $user->getProjet()->getNom().". Votre présence 
                et votre contribution sont essentielles pour le succès de cette réunion et pour
                 faire progresser le projet vers ses objectifs.
                 \nVoici les détails de la réunion: \n
             Titre:  ".  $reunion[0]->getTitre().".\n Date: ".  $reunion[0]->getDate().".\n 
              Heure Début: ". $reunion[0]->getHeureDebut().".\nHeure Fin: ". $reunion[0]->getHeureFin().".\n
               Description:  ". $reunion[0]->getDescription().".\nLien:  ".  $reunion[0]->getLien().".\n
               Veuillez confirmer votre présence dans notre plateforme avant ".  $reunion[0]->getDate()." pour rejoindre la réunion.
               \n A très vite sur Our Team Collab.\nCordialement.");
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
            #[Route('/projetRoleUser/{id}/{idU}', name: 'app_projetRoleUser')]
            public function projetRoleUser(Request $request,EntityManagerInterface $entityManager): Response
            {
                $id=$request->attributes->get('id');
                $idU=$request->attributes->get('idU');
                $par = $entityManager
                ->getRepository(ParticipationReunion::class)
                ->createQueryBuilder('m')
                ->join('m.user','users')
                ->join('users.user','user')
                ->join('m.reunion','reunion')
                ->andWhere('reunion.id = :id')
                ->andWhere('user.id = :idU')
                ->setParameters([
                        'id'=>$id,
                        'idU'=>$idU,
                      ])
                ->getQuery()->getResult();
               
             
              return $this->json([
                    'projetRole' =>  $par,
                      ]);
                    
            }
}
