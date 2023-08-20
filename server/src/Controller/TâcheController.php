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
use App\Entity\EmailNotifications;
use App\Repository\EmailNotificationsRepository;
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
use App\Service\SendMailServiceAffectationTask;
use App\Service\SendMailServiceRefusTask;
use App\Service\SendMailServiceBlocageTask;
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
class TâcheController extends AbstractController
{
   #[Route('/task/{idE}', name: 'app_task')]
        public function indexTask(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('idE');
            $task = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->join('m.etat','etat')
            ->andWhere('etat.id = :id')
            ->setParameters([
                    'id'=>$id
                  ])
            ->orderBy('m.rang', 'DESC')
            ->getQuery()->getResult();
    
            $nb=count($task);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
            return $this->json(
                ['task' =>  $data,'nb' =>  $nb]
            );
        }

        #[Route('/taskNonAffec/{idE}', name: 'app_taskNonAffec')]
        public function indexTaskNonAffec(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('idE');
            $task = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->andWhere('m.user is NULL')
            ->join('m.etat','etat')
            ->andWhere('etat.id = :id')
            ->setParameters([
                    'id'=>$id
                  ])
            ->orderBy('m.rang', 'DESC')
            ->getQuery()->getResult();
    
            $nb=count($task);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
            return $this->json(
                ['task' =>  $data,'nb' =>  $nb]
            );
        }
        #[Route('/taskPhase/{idPh}', name: 'app_taskPhase')]
        public function indexTaskPhase(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('idPh');
            $task = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->join('m.etat','etat')
            ->join('etat.phase','phase')
            ->andWhere('phase.id = :id')
            ->setParameters([
                    'id'=>$id
                  ])
            ->orderBy('m.rang', 'DESC')
            ->getQuery()->getResult();
    
            $nb=count($task);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
            return $this->json(
                ['task' =>  $data,'nb' =>  $nb]
            );
        }

        #[Route('/taskPhaseUser/{idPh}/{idU}', name: 'app_taskPhaseUser')]
        public function indexTaskPhaseUser(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('idPh');
            $idU=$request->attributes->get('idU');
            $task = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->join('m.user','droitAcces')
           ->join('droitAcces.user','users')
           ->andWhere('users.id = :idU')
            ->join('m.etat','etat')
            ->join('etat.phase','phase')
            ->andWhere('phase.id = :id')
            ->setParameters([
                    'id'=>$id,
                    'idU'=>$idU
                  ])
            ->orderBy('m.rang', 'DESC')
            ->getQuery()->getResult();
    
            $nb=count($task);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
            return $this->json(
                ['task' =>  $data,'nb' =>  $nb]
            );
        }

        #[Route('/taskPhaseNonAffec/{idPh}', name: 'app_taskPhaseNonAffec')]
        public function indexTaskPhaseNonAffec(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('idPh');
            $task = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->andWhere('m.user is NULL')
            ->join('m.etat','etat')
            ->join('etat.phase','phase')
            ->andWhere('phase.id = :id')
            ->setParameters([
                    'id'=>$id
                  
                  ])
            ->orderBy('m.rang', 'DESC')
            ->getQuery()->getResult();
    
            $nb=count($task);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
            return $this->json(
                ['task' =>  $data,'nb' =>  $nb]
            );
        }
        #[Route('/detailtask/{id}', name: 'app_detailtask')]
        public function detailTask(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
            $task = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->join('m.etat','etat')
            ->andWhere('m.id = :id')
            ->setParameters([
                    'id'=>$id
                  ])
            ->getQuery()->getResult();
    
            $nb=count($task);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
            return $this->json(
                ['task' =>  $data,'nb' =>  $nb]
            );
        }
        #[Route('/taskUser/{idE}/{idU}', name: 'app_taskUser')]
        public function indexTaskUser(EntityManagerInterface $entityManager,Request $request): Response
        {
            $idE=$request->attributes->get('idE');
            $idU=$request->attributes->get('idU');
            $task = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->join('m.etat','etat')
            ->join('m.user','user')
            ->join('user.user','u')
            ->andWhere('u.id = :idU')
            ->andWhere('etat.id = :idE')
            ->setParameters([
                    'idE'=>$idE,
                    'idU'=>$idU
                  ])
            ->getQuery()->getResult();
    
            $nb=count($task);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
            return $this->json(
                ['task' =>  $data,'nb' =>  $nb]
            );
        }
        #[Route('/taskUserPhase/{idPh}/{idU}', name: 'app_taskUserPhase')]
        public function indexTaskUserPhase(EntityManagerInterface $entityManager,Request $request): Response
        {
            $idPh=$request->attributes->get('idPh');
            $idU=$request->attributes->get('idU');
            $task = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->join('m.etat','etat')
            ->join('etat.phase','phase')
            ->join('m.user','user')
            ->join('user.user','u')
            ->andWhere('u.id = :idU')
            ->andWhere('phase.id = :idPh')
            ->setParameters([
                    'idPh'=>$idPh,
                    'idU'=>$idU
                  ])
            ->getQuery()->getResult();
    
            $nb=count($task);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
            return $this->json(
                ['task' =>  $data,'nb' =>  $nb]
            );
        }
        #[Route('/updateRaison/{id}', name: 'updateRaison')]
        public function updateRaison(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
                 $t = $entityManager
                     ->getRepository(Task::class)
                    ->findById($id);
                    $task=$t[0];
                    $task->setRaisonRefus(ucfirst($request->request->get('raisonRefus')));
                    $entityManager->persist($task);
                    $entityManager->flush();
                  
                        return $this->json(['success' =>  'success']); }
    #[Route('/updateBlocage/{id}', name: 'updateBlocage')]
        public function updateBlocage(EntityManagerInterface $entityManager,Request $request): Response
          {
              $id=$request->attributes->get('id');
              $t = $entityManager
                   ->getRepository(Task::class)
                   ->findById($id);
              $task=$t[0];
              $task->setProblemeBlocage(ucfirst($request->request->get('blocage')));
              $entityManager->persist($task);
              $entityManager->flush();
           return $this->json(['success' =>  'success']); 
        } 
        #[Route('/updateTaux/{id}', name: 'updateTaux')]
        public function updateTaux(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
                 $t = $entityManager
                     ->getRepository(Task::class)
                    ->findById($id);
                    $task=$t[0];
                    $task->setTauxAvancement($request->request->get('taux'));
                    $entityManager->persist($task);
                    $entityManager->flush();
                  
                        return $this->json(['success' =>  'success']); 
        } 
        #[Route('/updatePriorité/{id}', name: 'updatePriorité')]
        public function updatePriorité(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
                 $t = $entityManager
                     ->getRepository(Task::class)
                    ->findById($id);
                    $task=$t[0];
                    $task->setPriorite($request->request->get('priorité'));
                    if($request->request->get('priorité')==="Aucune"){ $task->setRang(0);};
                    if($request->request->get('priorité')==="Basse"){ $task->setRang(1);};
                    if($request->request->get('priorité')==="Moyenne"){ $task->setRang(2);};
                    if($request->request->get('priorité')==="Haute"){ $task->setRang(3);};
                    $entityManager->persist($task);
                    $entityManager->flush();
                  
                        return $this->json(['success' =>  'success']); 
        } 
        #[Route('/validéTask/{id}', name: 'validéTask')]
        public function validéTask(EntityManagerInterface $entityManager,Request $request, SendMailServiceRefusTask $mail): Response
        {
            $id=$request->attributes->get('id');
                 $t = $entityManager
                     ->getRepository(Task::class)
                    ->findById($id);
                    $task=$t[0];
                    if($request->request->get('validé')==="true"){
                        $task->setValide(true);}
                    else{
                           $task->setValide(false); 
                           if($task->getUser()!==null){
                           $mail->send(
                            'ourteamcollab@gmail.com',
                            $task->getUser()->getUser()->getEmail(),
                            $task->getUser()->getUser()->getUsername().' '. $task->getUser()->getUser()->getLastname(),
                           "Refus de la tâche-".$task->getTitre(),
                           $task->getTitre(),
                           $task->getDescription(),
                           $task->getDateDebut(),
                           $task->getDateFin(),
                           $task->getPriorite(),
                           $task->getUser()->getProjet()->getNom(),
                           $task->getEtat()->getPhase()->getTitre()
                           
                        ); 
                        $email = new EmailNotifications();
            $email->setUser( $task->getUser()->getUser());
            $email->setStatus(0);
            $email->setObjet(   "Refus de la tâche-".$task->getTitre());
           $email->setContenu("Cher/Chère  ".  $task->getUser()->getUser()->getUsername().' '. $task->getUser()->getUser()->getLastname().",
           \nJ'espère que vous allez bien. Je tiens à vous remercier pour votre implication 
           et pour avoir accompli la tâche".  $task->getTitre()."
            que vous avez réalisée. Cependant, après avoir examiné attentivement les résultats 
            et considéré les objectifs fixés, je regrette de devoir refuser la validation de cette tâche.
          \nVeuillez prendre en compte les détails suivants : \n
          Nom de projet: ".  $task->getUser()->getProjet()->getNom().".\nNom de phase: ". $task->getEtat()->getPhase()->getTitre().".\nDescription de la tâche: ". $task->getDescription().".\n
          Date début:".$task->getDateDebut().".\n Date fin:  ".$task->getDateFin().".\nPriorité: ".$task->getPriorite().".\n
           A très vite sur Our Team Collab.\nCordialement.");
           $email->setDate(date("Y-m-d"));
           $email->setHeure(date("H:i"));
           $entityManager->persist($email);
           $entityManager->flush();
                        }}
                  
                    $entityManager->persist($task);
                    $entityManager->flush();
                  
                        return $this->json(['success' =>  'success']); 
        } 
        #[Route('/recommencerTask/{id}', name: 'recommencerTask')]
        public function recommencerTask(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
                 $t = $entityManager
                     ->getRepository(Task::class)
                    ->findById($id);
                    $task=$t[0];
                    $e = $entityManager
                    ->getRepository(Etat::class)
                    ->createQueryBuilder('m')
                    ->join('m.phase','phase')
                    ->andWhere('phase.id = :id')
                    ->andWhere('m.titre = :titre')
                    ->setParameters([
                            'id'=>$task->getEtat()->getPhase()->getId(),
                            'titre'=>"En cours"
                          ])
                    ->getQuery()->getResult();
                $etat=$e[0];
                $task->setEtat($etat);
                $task->setValide(null);
                $task->setRaisonRefus("");
                $entityManager->persist($task);
                $entityManager->flush();
            return $this->json(['success' =>  'success']); 
        } 

        #[Route('/updateTaskEtat/{id}/{idE}', name: 'updateTaskEtat')]
        public function updateTaskEtat(EntityManagerInterface $entityManager,Request $request, SendMailServiceBlocageTask $mail): Response
        {
            $id=$request->attributes->get('id');
            $idE=$request->attributes->get('idE');
                 $t = $entityManager
                     ->getRepository(Task::class)
                    ->findById($id);
                    $task=$t[0];
                    $e = $entityManager
                    ->getRepository(Etat::class)
                   ->findById($idE);
                   $etat=$e[0];
                   if($etat->getTitre()==="Terminé"){
                    $task->setTauxAvancement("100");
                   }
                   if($etat->getTitre()==="Bloqué"){
                   if($task->getUser()!==null){
                    $chef = $entityManager
                    ->getRepository(DroitAcces::class)
                    ->createQueryBuilder('m')
                    ->join('m.projet','projet')
                    ->andWhere('projet.id = :id')
                    ->andWhere('m.role = :role')
                    ->setParameters([
                        'id'=>$task->getUser()->getProjet()->getId(),                           
                         'role'=>"chefProjet"
                          ])
                    ->getQuery()->getResult();
                $chefP=$chef[0];
                     $mail->send(
                        'ourteamcollab@gmail.com',
                        $chefP->getUser()->getEmail(),
                        $task->getUser()->getUser()->getUsername().' '. $task->getUser()->getUser()->getLastname(),
                       "Blocage de la tâche-".$task->getTitre(),
                       $task->getTitre(),
                       $task->getDescription(),
                       $task->getDateDebut(),
                       $task->getDateFin(),
                       $task->getPriorite(),
                       $task->getUser()->getProjet()->getNom(),
                       $etat->getPhase()->getTitre(),
                       $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname()); 

                       $email = new EmailNotifications();
                       $email->setUser( $chefP->getUser());
                       $email->setStatus(0);
                       $email->setObjet(  "Blocage de la tâche-".$task->getTitre());
                      $email->setContenu("Cher/Chère ". $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname().",
                      \nJ'espère que vous allez bien. Je vous écris pour vous informer qu'il y a
                       un blocage dans la réalisation de la tâche  ". $task->getTitre().". 
                       Malheureusement, le membre  ".$task->getUser()->getUser()->getUsername().' '. $task->getUser()->getUser()->getLastname()." rencontre des difficultés majeures qu'il empêche de progresser comme prévu.
                      \nVeuillez prendre en compte les détails suivants : 
                      \n Nom de projet:  ".$task->getUser()->getProjet()->getNom().".\nNom de phase: ". $etat->getPhase()->getTitre().".\n
                       Description de la tâche:  ".$task->getDescription().".\n Date début: ". $task->getDateDebut().".\n
                        Date fin:  ". $task->getDateFin().".\nPriorité: ". $task->getPriorite().".\n
                      A très vite sur Our Team Collab.\nCordialement.");
                      $email->setDate(date("Y-m-d"));
                      $email->setHeure(date("H:i"));
                      $entityManager->persist($email);
                      $entityManager->flush();
                       
                   }}
                   else{
                    $task->setProblemeBlocage("");
                   }
                    $task->setEtat($etat);
                    $entityManager->persist($task);
                    $entityManager->flush();
                  
                    $serializer = new Serializer([new ObjectNormalizer()]);
    
                    $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
                    return $this->json(
                        ['task' =>  $data]
                    ); 
        } 

        #[Route('/usersProjet/{id}', name: 'usersProjet')]
        public function usersProjet(EntityManagerInterface $entityManager,Request $request): Response
        {
            $id=$request->attributes->get('id');
            $user = $entityManager
            ->getRepository(DroitAcces::class)
            ->createQueryBuilder('m')
            ->join('m.projet','projet')
            ->join('m.user','user')
            ->andWhere('projet.id = :id')
            ->andWhere('m.role != :role')
            ->andWhere('user.etat = :etat')
            ->setParameters([
                    'id'=>$id,
                    'role'=>"client",
                    'etat'=>true
                  ])
           ->getQuery()->getResult();
    
            $nb=count($user);
            $serializer = new Serializer([new ObjectNormalizer()]);
    
            $data = $serializer->normalize($user, null, [AbstractNormalizer::ATTRIBUTES => ['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']]]);
            return $this->json(
                ['user' =>  $data,'nb' =>  $nb]
            );
        }

        #[Route('/ajouterTask', name: 'app_ajouterTask')]
        public function ajouterTask(Request $request,EntityManagerInterface $entityManager, SendMailServiceAffectationTask $mail, SendMailServiceBlocageTask $mail1): Response
        { 
            $e =  $entityManager
            ->getRepository(Etat::class)
            ->findById($request->request->get('etat'));
             $etat=$e[0]  ;
            $test = $entityManager
            ->getRepository(Task::class)
            ->createQueryBuilder('m')
            ->join('m.etat','etat')
            ->join('etat.phase','phase')
            ->andWhere('phase.id = :id')
            ->andWhere('m.titre = :titre')
            ->setParameters([
                    'id'=>$etat->getPhase()->getId(),
                    'titre'=>ucfirst($request->request->get('titre'))
                  ])
            ->getQuery()->getResult();
            if(count($test)!==0){
                return $this->json([
                    'danger' =>  "Tâche existe déjà !", ] , Response::HTTP_NOT_ACCEPTABLE);
              
            }
            else{
                $datetime1 = new DateTime($request->request->get('dateDebut')); 
                $datetime2 = new DateTime($request->request->get('dateFin'));
                if (($datetime1 > $datetime2)||($datetime1 == $datetime2)){
                    return $this->json([
                        'danger' =>  "La date de fin ne peut être antérieure à la date de début !", ] , Response::HTTP_NOT_ACCEPTABLE);
                }
                else{
            $task = new Task();
            $task->setTitre(ucfirst($request->request->get('titre')));
            $task->setDescription($request->request->get('description'));
            $task->setDateDebut($request->request->get('dateDebut'));
            $task->setDateFin($request->request->get('dateFin'));
            $task->setPriorite($request->request->get('priorité'));
               if($request->request->get('priorité')==="Aucune"){ $task->setRang(0);};
               if($request->request->get('priorité')==="Basse"){ $task->setRang(1);};
               if($request->request->get('priorité')==="Moyenne"){ $task->setRang(2);};
               if($request->request->get('priorité')==="Haute"){ $task->setRang(3);};
               if($etat->getTitre()==="Terminé"){  $task->setTauxAvancement("100");}
               if($etat->getTitre()!=="Terminé"){  $task->setTauxAvancement("0");}
               if($etat->getTitre()==="Bloqué"&&$request->request->get('user')){
                $chef = $entityManager
                ->getRepository(DroitAcces::class)
                ->createQueryBuilder('m')
                ->join('m.projet','projet')
                ->andWhere('projet.id = :id')
                ->andWhere('m.role = :role')
                ->setParameters([
                    'id'=>$etat->getPhase()->getProjet()->getId(),                           
                     'role'=>"chefProjet"
                      ])
                ->getQuery()->getResult();
            $chefP=$chef[0];
            $d =  $entityManager
            ->getRepository(DroitAcces::class)
            ->findById($request->request->get('user'));
            $droitAcces=$d[0]  ;
                 $mail1->send(
                    'ourteamcollab@gmail.com',
                    $chefP->getUser()->getEmail(),
                    $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                   "Blocage de la tâche-".$task->getTitre(),
                   ucfirst($request->request->get('titre')),
                   $request->request->get('description'),
                   $request->request->get('dateDebut'),
                   $request->request->get('dateFin'),
                   $request->request->get('priorité'),
                   $droitAcces->getProjet()->getNom(),
                   $etat->getPhase()->getTitre(),
                   $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname());

                   $email = new EmailNotifications();
                   $email->setUser( $chefP->getUser());
                   $email->setStatus(0);
                   $email->setObjet(  "Blocage de la tâche-".$task->getTitre());
                  $email->setContenu("Cher/Chère ". $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname().",
                  \nJ'espère que vous allez bien. Je vous écris pour vous informer qu'il y a
                   un blocage dans la réalisation de la tâche  ".  ucfirst($request->request->get('titre')).". 
                   Malheureusement, le membre  ". $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname()." rencontre des difficultés majeures qu'il empêche de progresser comme prévu.
                  \nVeuillez prendre en compte les détails suivants : 
                  \n Nom de projet:  ". $droitAcces->getProjet()->getNom().".\nNom de phase: ".  $etat->getPhase()->getTitre().".\n
                   Description de la tâche:  ". $request->request->get('description').".\n Date début: ".  $request->request->get('dateDebut').".\n
                    Date fin:  ".  $request->request->get('dateFin').".\nPriorité: ".  $request->request->get('priorité').".\n
                  A très vite sur Our Team Collab.\nCordialement.");
                  $email->setDate(date("Y-m-d"));
                  $email->setHeure(date("H:i"));
                  $entityManager->persist($email);
                  $entityManager->flush();
               }
            if($request->request->get('user')){
            $d =  $entityManager
                ->getRepository(DroitAcces::class)
                ->findById($request->request->get('user'));
            $droitAcces=$d[0]  ;
            $task->setUser($droitAcces); }
            $task->setEtat($etat);
            $entityManager->persist($task);
            $entityManager->flush();    
            if($request->request->get('user')){
   
                $mail->send(
                    'ourteamcollab@gmail.com',
                    $droitAcces->getUser()->getEmail(),
                    $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                   " Affectation d'une nouvelle tâche",
                   ucfirst($request->request->get('titre')),
                   $request->request->get('description'),
                   $request->request->get('dateDebut'),
                   $request->request->get('dateFin'),
                   $request->request->get('priorité'),
                   $droitAcces->getProjet()->getNom(),
                   $etat->getPhase()->getTitre());

                   $email = new EmailNotifications();
                   $email->setUser( $droitAcces->getUser());
                   $email->setStatus(0);
                   $email->setObjet("Affectation d'une nouvelle tâche");
                  $email->setContenu("Cher/Chère ".$droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname().",
                 \nJe vous écris pour vous informer de l'affectation d'une nouvelle tâche importante.
                   À partir d'aujourd'hui, vous êtes chargé(e) de la réalisation de la tâche suivante : 
                  ".  ucfirst($request->request->get('titre')).".
                 \nVeuillez prendre en compte les détails suivants :\n
                  Nom de projet:  ".  $droitAcces->getProjet()->getNom().".\n Nom de phase: ". $etat->getPhase()->getTitre().".\n
                   Description de la tâche:  ".$request->request->get('description')."\n Date début: ". $request->request->get('dateDebut').".\n
                    Date fin:  ". $request->request->get('dateFin').".\n Priorité:  ". $request->request->get('priorité').".\n
                  A très vite sur Our Team Collab.\nCordialement.");
                  $email->setDate(date("Y-m-d"));
                  $email->setHeure(date("H:i"));
                  $entityManager->persist($email);
                  $entityManager->flush();
                   
            }
            return $this->json([
                     'success' =>  'success',
                       ]);}}
         }
         #[Route('/updateTask/{id}', name: 'app_updateTask')]
         public function updateTask(Request $request,EntityManagerInterface $entityManager, SendMailServiceBlocageTask $mail2, SendMailServiceAffectationTask $mail, SendMailServiceRefusTask $mail1): Response
         { 
             $e =  $entityManager
             ->getRepository(Etat::class)
             ->findById($request->request->get('etat'));
              $etat=$e[0]  ;
             $test = $entityManager
             ->getRepository(Task::class)
             ->createQueryBuilder('m')
             ->join('m.etat','etat')
             ->join('etat.phase','phase')
             ->andWhere('phase.id = :id')
             ->andWhere('m.titre = :titre')
             ->andWhere('m.id != :idT')
             ->setParameters([
                     'id'=>$etat->getPhase()->getId(),
                     'idT'=> $id=$request->attributes->get('id'),
                     'titre'=>ucfirst($request->request->get('titre'))
                   ])
             ->getQuery()->getResult();
             if(count($test)!==0){
                 return $this->json([
                     'danger' =>  "Tâche existe déjà !", ] , Response::HTTP_NOT_ACCEPTABLE);
               
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
                    $t = $entityManager
                    ->getRepository(Task::class)
                    ->findById($id);
               $task=$t[0];
             $task->setTitre(ucfirst($request->request->get('titre')));
             $task->setDescription(ucfirst($request->request->get('description')));
             $task->setDateDebut($request->request->get('dateDebut'));
             $task->setDateFin($request->request->get('dateFin'));
             $task->setPriorite($request->request->get('priorité'));
                if($request->request->get('priorité')==="Aucune"){ $task->setRang(0);};
                if($request->request->get('priorité')==="Basse"){ $task->setRang(1);};
                if($request->request->get('priorité')==="Moyenne"){ $task->setRang(2);};
                if($request->request->get('priorité')==="Haute"){ $task->setRang(3);};
                if($etat->getTitre()==="Bloqué"){
                    $task->setProblemeBlocage(ucfirst($request->request->get('blocage')));
                if($request->request->get('user')){
                  
                    $chef = $entityManager
                    ->getRepository(DroitAcces::class)
                    ->createQueryBuilder('m')
                    ->join('m.projet','projet')
                    ->andWhere('projet.id = :id')
                    ->andWhere('m.role = :role')
                    ->setParameters([
                        'id'=>$etat->getPhase()->getProjet()->getId(),                           
                         'role'=>"chefProjet"
                          ])
                    ->getQuery()->getResult();
                $chefP=$chef[0];
                $d =  $entityManager
                ->getRepository(DroitAcces::class)
                ->findById($request->request->get('user'));
                $droitAcces=$d[0]  ;
                     $mail2->send(
                        'ourteamcollab@gmail.com',
                        $chefP->getUser()->getEmail(),
                        $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                       "Blocage de la tâche-".  ucfirst($request->request->get('titre')),
                       ucfirst($request->request->get('titre')),
                       $request->request->get('description'),
                       $request->request->get('dateDebut'),
                       $request->request->get('dateFin'),
                       $request->request->get('priorité'),
                       $droitAcces->getProjet()->getNom(),
                       $etat->getPhase()->getTitre(),
                       $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname()); 

                       $email = new EmailNotifications();
                       $email->setUser( $chefP->getUser());
                       $email->setStatus(0);
                       $email->setObjet(  "Blocage de la tâche-".  ucfirst($request->request->get('titre')));
                      $email->setContenu("Cher/Chère ". $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname().",
                      \nJ'espère que vous allez bien. Je vous écris pour vous informer qu'il y a
                       un blocage dans la réalisation de la tâche  ".  ucfirst($request->request->get('titre')).". 
                       Malheureusement, le membre  ". $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname()." rencontre des difficultés majeures qu'il empêche de progresser comme prévu.
                      \nVeuillez prendre en compte les détails suivants : 
                      \n Nom de projet:  ". $droitAcces->getProjet()->getNom().".\nNom de phase: ".  $etat->getPhase()->getTitre().".\n
                       Description de la tâche:  ". $request->request->get('description').".\n Date début: ".  $request->request->get('dateDebut').".\n
                        Date fin:  ".  $request->request->get('dateFin').".\nPriorité: ".  $request->request->get('priorité').".\n
                      A très vite sur Our Team Collab.\nCordialement.");
                      $email->setDate(date("Y-m-d"));
                      $email->setHeure(date("H:i"));
                      $entityManager->persist($email);
                      $entityManager->flush();
                   }}
                   else{
                    $task->setProblemeBlocage(null);

                   }
             if($etat->getTitre()==="Terminé"){
                $task->setTauxAvancement("100");
                 $task->setRaisonRefus(ucfirst($request->request->get('raison')));
               if($request->request->get('validé')==="true"){
                   $task->setValide(true);}
                if($request->request->get('validé')==="false"){
                   $task->setValide(false);  
                   if($request->request->get('user')){
                    $d =  $entityManager
                    ->getRepository(DroitAcces::class)
                    ->findById($request->request->get('user'));
                    $droitAcces=$d[0]  ;
                    $mail1->send(
                     'ourteamcollab@gmail.com',
                     $droitAcces->getUser()->getEmail(),
                     $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                    "Refus de la tâche-".  ucfirst($request->request->get('titre')),
                    ucfirst($request->request->get('titre')),
                    $request->request->get('description'),
                    $request->request->get('dateDebut'),
                    $request->request->get('dateFin'),
                    $request->request->get('priorité'),
                    $droitAcces->getProjet()->getNom(),
                    $etat->getPhase()->getTitre());
                     
                    $email = new EmailNotifications();
                    $email->setUser(   $droitAcces->getUser());
                    $email->setStatus(0);
                    $email->setObjet( "Refus de la tâche-".  ucfirst($request->request->get('titre')));
                   $email->setContenu("Cher/Chère  ".   $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname().",
                   \nJ'espère que vous allez bien. Je tiens à vous remercier pour votre implication 
                   et pour avoir accompli la tâche".  ucfirst($request->request->get('titre'))."
                    que vous avez réalisée. Cependant, après avoir examiné attentivement les résultats 
                    et considéré les objectifs fixés, je regrette de devoir refuser la validation de cette tâche.
                  \nVeuillez prendre en compte les détails suivants : \n
                  Nom de projet: ".  $droitAcces->getProjet()->getNom().".\nNom de phase: ". $etat->getPhase()->getTitre().".\nDescription de la tâche: ".  $request->request->get('description').".\n
                  Date début:".  $request->request->get('dateDebut').".\n Date fin:  ".$request->request->get('dateFin').".\nPriorité: ". $request->request->get('priorité').".\n
                   A très vite sur Our Team Collab.\nCordialement.");
                   $email->setDate(date("Y-m-d"));
                   $email->setHeure(date("H:i"));
                   $entityManager->persist($email);
                   $entityManager->flush(); 
                   }
                }
                }
                else{
                    $task->setTauxAvancement($request->request->get('taux'));
                    $task->setValide(null);
                    $task->setRaisonRefus("");
                }
             if(!$request->request->get('user')){
                $task->setUser(null); 
             }
            if($task->getUser()!==null&&$request->request->get('user')&&(strcmp($request->request->get('user'),$task->getUser()->getId())!==0)){
                $d =  $entityManager
                ->getRepository(DroitAcces::class)
                ->findById($request->request->get('user'));
                $droitAcces=$d[0]  ;
               $task->setUser($droitAcces); 
         
                $mail->send(
                    'ourteamcollab@gmail.com',
                    $droitAcces->getUser()->getEmail(),
                    $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                   " Affectation d'une nouvelle tâche",
                   ucfirst($request->request->get('titre')),
                   $request->request->get('description'),
                   $request->request->get('dateDebut'),
                   $request->request->get('dateFin'),
                   $request->request->get('priorité'),
                   $droitAcces->getProjet()->getNom(),
                   $etat->getPhase()->getTitre());

                   $email = new EmailNotifications();
                   $email->setUser( $droitAcces->getUser());
                   $email->setStatus(0);
                   $email->setObjet("Affectation d'une nouvelle tâche");
                  $email->setContenu("Cher/Chère ".$droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname().",
                 \nJe vous écris pour vous informer de l'affectation d'une nouvelle tâche importante.
                   À partir d'aujourd'hui, vous êtes chargé(e) de la réalisation de la tâche suivante : 
                  ".  ucfirst($request->request->get('titre')).".
                 \nVeuillez prendre en compte les détails suivants :\n
                  Nom de projet:  ".  $droitAcces->getProjet()->getNom().".\n Nom de phase: ". $etat->getPhase()->getTitre().".\n
                   Description de la tâche:  ".$request->request->get('description').".\n Date début: ". $request->request->get('dateDebut').".\n
                    Date fin:  ". $request->request->get('dateFin').".\n Priorité:  ". $request->request->get('priorité').".\n
                  A très vite sur Our Team Collab.\nCordialement.");
                  $email->setDate(date("Y-m-d"));
                  $email->setHeure(date("H:i"));
                  $entityManager->persist($email);
                  $entityManager->flush();
            }
            if($request->request->get('user')&&($task->getUser()===null)){
                $d =  $entityManager
                ->getRepository(DroitAcces::class)
                ->findById($request->request->get('user'));
                $droitAcces=$d[0]  ;
               $task->setUser($droitAcces); 
         
                $mail->send(
                    'ourteamcollab@gmail.com',
                    $droitAcces->getUser()->getEmail(),
                    $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                   " Affectation d'une nouvelle tâche",
                   ucfirst($request->request->get('titre')),
                   $request->request->get('description'),
                   $request->request->get('dateDebut'),
                   $request->request->get('dateFin'),
                   $request->request->get('priorité'),
                   $droitAcces->getProjet()->getNom(),
                   $etat->getPhase()->getTitre()
                );
                $email = new EmailNotifications();
                $email->setUser( $droitAcces->getUser());
                $email->setStatus(0);
                $email->setObjet("Affectation d'une nouvelle tâche");
               $email->setContenu("Cher/Chère ".$droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname().",
              \nJe vous écris pour vous informer de l'affectation d'une nouvelle tâche importante.
                À partir d'aujourd'hui, vous êtes chargé(e) de la réalisation de la tâche suivante : 
               ".  ucfirst($request->request->get('titre')).".
              \nVeuillez prendre en compte les détails suivants :\n
               Nom de projet:  ".  $droitAcces->getProjet()->getNom().".\n Nom de phase: ". $etat->getPhase()->getTitre().".\n
                Description de la tâche:  ".$request->request->get('description').".\n Date début: ". $request->request->get('dateDebut').".\n
                 Date fin:  ". $request->request->get('dateFin').".\n Priorité:  ". $request->request->get('priorité').".\n
               A très vite sur Our Team Collab.\nCordialement.");
               $email->setDate(date("Y-m-d"));
               $email->setHeure(date("H:i"));
               $entityManager->persist($email);
               $entityManager->flush();
            }
            $task->setEtat($etat);
             $entityManager->persist($task);
             $entityManager->flush();    
        
             return $this->json([
                      'success' =>  'success',
                        ]);}}
          }

          #[Route('/deleteTask/{id}', name: 'app_deleteTask')]
          public function deleteTask(EntityManagerInterface $entityManager,Request $request): Response
          {
             $id=$request->attributes->get('id');
             $qb =$entityManager->getRepository(Task::class)
             ->createQueryBuilder('m');
             $affected = $qb->delete()
                     ->where('m.id = :id')
                     ->getQuery()
                     ->execute(['id' => $id]);
     
                     return $this->json(['success' =>  'success']); 
          }

          #[Route('/updateTaskMembre/{id}', name: 'app_updateTaskMembre')]
          public function updateTaskMembre(Request $request,EntityManagerInterface $entityManager, SendMailServiceBlocageTask $mail2): Response
          { 
              $e =  $entityManager
              ->getRepository(Etat::class)
              ->findById($request->request->get('etat'));
               $etat=$e[0]  ;
               $id=$request->attributes->get('id');
              $t = $entityManager
                    ->getRepository(Task::class)
                    ->findById($id);
               $task=$t[0];
               if($etat->getTitre()==="Bloqué"){
                     $task->setProblemeBlocage(ucfirst($request->request->get('blocage')));
                  
                     $chef = $entityManager
                     ->getRepository(DroitAcces::class)
                     ->createQueryBuilder('m')
                     ->join('m.projet','projet')
                     ->andWhere('projet.id = :id')
                     ->andWhere('m.role = :role')
                     ->setParameters([
                         'id'=>$etat->getPhase()->getProjet()->getId(),                           
                          'role'=>"chefProjet"
                           ])
                     ->getQuery()->getResult();
                 $chefP=$chef[0];
                 $d =  $entityManager
                 ->getRepository(DroitAcces::class)
                 ->findById($request->request->get('user'));
                 $droitAcces=$d[0]  ;
                      $mail2->send(
                         'ourteamcollab@gmail.com',
                         $chefP->getUser()->getEmail(),
                         $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                        "Blocage de la tâche-".$task->getTitre(),
                        $task->getTitre(),
                        $task->getDescription(),
                        $task->getDateDebut(),
                        $task->getDateFin(),
                        $task->getPriorite(),
                        $droitAcces->getProjet()->getNom(),
                        $etat->getPhase()->getTitre(),
                        $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname() ); 

                        $email = new EmailNotifications();
                        $email->setUser( $chefP->getUser());
                        $email->setStatus(0);
                        $email->setObjet(    "Blocage de la tâche-".$task->getTitre());
                       $email->setContenu("Cher/Chère ". $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname().",
                       \nJ'espère que vous allez bien. Je vous écris pour vous informer qu'il y a
                        un blocage dans la réalisation de la tâche  ".   $task->getTitre().". 
                        Malheureusement, le membre  ". $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname()." rencontre des difficultés majeures qu'il empêche de progresser comme prévu.
                       \nVeuillez prendre en compte les détails suivants : 
                       \n Nom de projet:  ". $droitAcces->getProjet()->getNom().".\nNom de phase: ".  $etat->getPhase()->getTitre().".\n
                        Description de la tâche:  ".  $task->getDescription().".\n Date début: ".  $task->getDateDebut().".\n
                         Date fin:  ".  $task->getDateFin().".\nPriorité: ".   $task->getPriorite().".\n
                       A très vite sur Our Team Collab.\nCordialement.");
                       $email->setDate(date("Y-m-d"));
                       $email->setHeure(date("H:i"));
                       $entityManager->persist($email);
                       $entityManager->flush();
                    }
                    else{ $task->setProblemeBlocage(null);}
                 if($etat->getTitre()==="Terminé"){
                     $task->setTauxAvancement("100"); }
                 else{
                     $task->setTauxAvancement($request->request->get('taux'));
                     $task->setValide(null);
                     $task->setRaisonRefus("");
                 }
              $task->setEtat($etat);
              $entityManager->persist($task);
              $entityManager->flush();    
         
              return $this->json([
                       'success' =>  'success',
                         ]);
           }
           #[Route('/taskPhaseTermine/{idPh}', name: 'app_taskPhaseTermine')]
           public function indexTaskPhaseTermine(EntityManagerInterface $entityManager,Request $request): Response
           {
               $id=$request->attributes->get('idPh');
               $task = $entityManager
               ->getRepository(Task::class)
               ->createQueryBuilder('m')
               ->join('m.etat','etat')
               ->join('etat.phase','phase')
               ->andWhere('phase.id = :id')
               ->andWhere('etat.titre = :titre')
               ->andWhere('m.valide = :valide')
               ->setParameters([
                       'id'=>$id,
                       'titre'=>"Terminé",
                       'valide'=>true
                     ])
               ->orderBy('m.rang', 'DESC')
               ->getQuery()->getResult();

               $taskPhase = $entityManager
               ->getRepository(Task::class)
               ->createQueryBuilder('m')
               ->join('m.etat','etat')
               ->join('etat.phase','phase')
               ->andWhere('phase.id = :id')
               ->setParameters([
                       'id'=>$id,
                     ])
               ->getQuery()->getResult();
       
               $nb=count($task);
               $nbTous=count($taskPhase);
               if($nbTous!==0){
                $nbTaskRéalisé=($nb/$nbTous)*100;}
                if($nbTous===0){
                   $nbTaskRéalisé=0;}
               $serializer = new Serializer([new ObjectNormalizer()]);
       
               $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
               return $this->json(
                   ['task' =>  $data,'nb' =>  $nb,'nbTaskRéalisé' =>$nbTaskRéalisé]
               );
           }
           #[Route('/taskPhaseTermineTous/{idP}', name: 'app_taskPhaseTermineTous')]
           public function indexTaskPhaseTermineTous(EntityManagerInterface $entityManager,Request $request): Response
           {
               $id=$request->attributes->get('idP');
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
                       'id'=>$id,
                       'titre'=>"Terminé",
                       'valide'=>true
                     ])
               ->orderBy('m.rang', 'DESC')
               ->getQuery()->getResult();

               $taskProjet = $entityManager
               ->getRepository(Task::class)
               ->createQueryBuilder('m')
               ->join('m.etat','etat')
               ->join('etat.phase','phase')
               ->join('phase.projet','projet')
               ->andWhere('projet.id = :id')
               ->setParameters([
                       'id'=>$id,
                     ])
               ->getQuery()->getResult();
       
               $nb=count($task);
               $nbTous=count($taskProjet);
               if($nbTous!==0){
                $nbTaskRéalisé=($nb/$nbTous)*100;}
                if($nbTous===0){
                   $nbTaskRéalisé=0;}
               $serializer = new Serializer([new ObjectNormalizer()]);
       
               $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
               return $this->json(
                   ['task' =>  $data,'nb' =>  $nb,'nbTaskRéalisé' =>$nbTaskRéalisé]
               );}

           #[Route('/dupliquerTask/{id}', name: 'app_dupliquerTask')]
           public function dupliquerTask(Request $request,EntityManagerInterface $entityManager, SendMailServiceBlocageTask $mail2, SendMailServiceAffectationTask $mail, SendMailServiceRefusTask $mail1): Response
           { 
               $e =  $entityManager
               ->getRepository(Etat::class)
               ->findById($request->request->get('etat'));
                $etat=$e[0]  ;
               $test = $entityManager
               ->getRepository(Task::class)
               ->createQueryBuilder('m')
               ->join('m.etat','etat')
               ->join('etat.phase','phase')
               ->andWhere('phase.id = :id')
               ->andWhere('m.titre = :titre')
               ->setParameters([
                       'id'=>$etat->getPhase()->getId(),
                       'titre'=>ucfirst($request->request->get('titre'))
                     ])
               ->getQuery()->getResult();
               $test1 = $entityManager
               ->getRepository(Task::class)
               ->createQueryBuilder('m')
               ->join('m.etat','etat')
               ->join('etat.phase','phase')
               ->andWhere('phase.id = :id')
               ->andWhere('m.titre LIKE :titre')
               ->setParameters([
                       'id'=>$etat->getPhase()->getId(),
                       'titre'=>'%'.ucfirst($request->request->get('titre').".").'%'
                     ])
               ->getQuery()->getResult();
               $task = new Task();
               if(count($test)!==0&&count($test1)===0){
                $task->setTitre(ucfirst($request->request->get('titre').".".count($test1)+1));
               }
               if(count($test)!==0&&count($test1)!==0){
                $task->setTitre(ucfirst($request->request->get('titre').".".count($test1)+1));
               }
               if(count($test)===0){
                $task->setTitre(ucfirst($request->request->get('titre')));
                 
               }
              
                   $datetime1 = new DateTime($request->request->get('dateDebut')); 
                   $datetime2 = new DateTime($request->request->get('dateFin'));
                   if (($datetime1 > $datetime2)||($datetime1 == $datetime2)){
                       return $this->json([
                           'danger' =>  "La date de fin ne peut être antérieure à la date de début !", ] , Response::HTTP_NOT_ACCEPTABLE);
                   }
                   else{
               $task->setDescription(ucfirst($request->request->get('description')));
               $task->setDateDebut($request->request->get('dateDebut'));
               $task->setDateFin($request->request->get('dateFin'));
               $task->setPriorite($request->request->get('priorité'));
                  if($request->request->get('priorité')==="Aucune"){ $task->setRang(0);};
                  if($request->request->get('priorité')==="Basse"){ $task->setRang(1);};
                  if($request->request->get('priorité')==="Moyenne"){ $task->setRang(2);};
                  if($request->request->get('priorité')==="Haute"){ $task->setRang(3);};
                  if($etat->getTitre()==="Bloqué"){
                      $task->setProblemeBlocage(ucfirst($request->request->get('blocage')));
                  if($request->request->get('user')){
                    
                      $chef = $entityManager
                      ->getRepository(DroitAcces::class)
                      ->createQueryBuilder('m')
                      ->join('m.projet','projet')
                      ->andWhere('projet.id = :id')
                      ->andWhere('m.role = :role')
                      ->setParameters([
                          'id'=>$etat->getPhase()->getProjet()->getId(),                           
                           'role'=>"chefProjet"
                            ])
                      ->getQuery()->getResult();
                  $chefP=$chef[0];
                  $d =  $entityManager
                  ->getRepository(DroitAcces::class)
                  ->findById($request->request->get('user'));
                  $droitAcces=$d[0]  ;
                       $mail2->send(
                          'ourteamcollab@gmail.com',
                          $chefP->getUser()->getEmail(),
                          $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                         "Blocage de la tâche-".  $task->getTitre(),
                         $task->getTitre(),
                         $request->request->get('description'),
                         $request->request->get('dateDebut'),
                         $request->request->get('dateFin'),
                         $request->request->get('priorité'),
                         $droitAcces->getProjet()->getNom(),
                         $etat->getPhase()->getTitre(),
                         $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname());

                        $email = new EmailNotifications();
                       $email->setUser( $chefP->getUser());
                       $email->setStatus(0);
                       $email->setObjet(  "Blocage de la tâche-".  $task->getTitre());
                      $email->setContenu("Cher/Chère ". $chefP->getUser()->getUsername().' '. $chefP->getUser()->getLastname().",
                      \nJ'espère que vous allez bien. Je vous écris pour vous informer qu'il y a
                       un blocage dans la réalisation de la tâche  ".  ucfirst($request->request->get('titre')).". 
                       Malheureusement, le membre  ". $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname()." rencontre des difficultés majeures qu'il empêche de progresser comme prévu.
                      \nVeuillez prendre en compte les détails suivants : 
                      \n Nom de projet:  ". $droitAcces->getProjet()->getNom().".\nNom de phase: ".  $etat->getPhase()->getTitre().".\n
                       Description de la tâche:  ". $request->request->get('description').".\n Date début: ".  $request->request->get('dateDebut').".\n
                        Date fin:  ".  $request->request->get('dateFin').".\nPriorité: ".  $request->request->get('priorité').".\n
                      A très vite sur Our Team Collab.\nCordialement.");
                      $email->setDate(date("Y-m-d"));
                      $email->setHeure(date("H:i"));
                      $entityManager->persist($email);
                      $entityManager->flush();
                          
                     }}
                     else{
                      $task->setProblemeBlocage(null);
  
                     }
               if($etat->getTitre()==="Terminé"){
                  $task->setTauxAvancement("100");
                   $task->setRaisonRefus(ucfirst($request->request->get('raison')));
                 if($request->request->get('validé')==="true"){
                     $task->setValide(true);}
                  if($request->request->get('validé')==="false"){
                     $task->setValide(false);  
                     if($request->request->get('user')){
                      $d =  $entityManager
                      ->getRepository(DroitAcces::class)
                      ->findById($request->request->get('user'));
                      $droitAcces=$d[0]  ;
                      $mail1->send(
                       'ourteamcollab@gmail.com',
                       $droitAcces->getUser()->getEmail(),
                       $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                      "Refus de la tâche-".   $task->getTitre(),
                      $task->getTitre(),
                      $request->request->get('description'),
                      $request->request->get('dateDebut'),
                      $request->request->get('dateFin'),
                      $request->request->get('priorité'),
                      $droitAcces->getProjet()->getNom(),
                      $etat->getPhase()->getTitre() ); 

                      $email = new EmailNotifications();
                      $email->setUser(   $droitAcces->getUser());
                      $email->setStatus(0);
                      $email->setObjet(  "Refus de la tâche-".   $task->getTitre());
                     $email->setContenu("Cher/Chère  ".   $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname().",
                     \nJ'espère que vous allez bien. Je tiens à vous remercier pour votre implication 
                     et pour avoir accompli la tâche".    $task->getTitre()."
                      que vous avez réalisée. Cependant, après avoir examiné attentivement les résultats 
                      et considéré les objectifs fixés, je regrette de devoir refuser la validation de cette tâche.
                    \nVeuillez prendre en compte les détails suivants : \n
                    Nom de projet: ".  $droitAcces->getProjet()->getNom().".\nNom de phase: ". $etat->getPhase()->getTitre().".\nDescription de la tâche: ".  $request->request->get('description').".\n
                    Date début:".  $request->request->get('dateDebut').".\n Date fin:  ".$request->request->get('dateFin').".\nPriorité: ". $request->request->get('priorité').".\n
                     A très vite sur Our Team Collab.\nCordialement.");
                     $email->setDate(date("Y-m-d"));
                     $email->setHeure(date("H:i"));
                     $entityManager->persist($email);
                     $entityManager->flush(); 
                     }
                  }
                  }
                  else{
                      $task->setTauxAvancement($request->request->get('taux'));
                      $task->setValide(null);
                      $task->setRaisonRefus("");
                  }
               if(!$request->request->get('user')){
                  $task->setUser(null); 
               }
             else{
                  $d =  $entityManager
                  ->getRepository(DroitAcces::class)
                  ->findById($request->request->get('user'));
                  $droitAcces=$d[0]  ;
                 $task->setUser($droitAcces); 
           
                  $mail->send(
                      'ourteamcollab@gmail.com',
                      $droitAcces->getUser()->getEmail(),
                      $droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname(),
                     " Affectation d'une nouvelle tâche",
                     $task->getTitre(),
                     $request->request->get('description'),
                     $request->request->get('dateDebut'),
                     $request->request->get('dateFin'),
                     $request->request->get('priorité'),
                     $droitAcces->getProjet()->getNom(),
                     $etat->getPhase()->getTitre()
                  );
                  $email = new EmailNotifications();
                  $email->setUser( $droitAcces->getUser());
                  $email->setStatus(0);
                  $email->setObjet("Affectation d'une nouvelle tâche");
                 $email->setContenu("Cher/Chère ".$droitAcces->getUser()->getUsername().' '. $droitAcces->getUser()->getLastname().",
                \nJe vous écris pour vous informer de l'affectation d'une nouvelle tâche importante.
                  À partir d'aujourd'hui, vous êtes chargé(e) de la réalisation de la tâche suivante : 
                 ".  ucfirst($request->request->get('titre')).".
                \nVeuillez prendre en compte les détails suivants :\n
                 Nom de projet:  ".  $droitAcces->getProjet()->getNom().".\n Nom de phase: ". $etat->getPhase()->getTitre().".\n
                  Description de la tâche:  ".$request->request->get('description').".\n Date début: ". $request->request->get('dateDebut').".\n
                   Date fin:  ". $request->request->get('dateFin').".\n Priorité:  ". $request->request->get('priorité').".\n
                 A très vite sur Our Team Collab.\nCordialement.");
                 $email->setDate(date("Y-m-d"));
                 $email->setHeure(date("H:i"));
                 $entityManager->persist($email);
                 $entityManager->flush();
              }
            
              $task->setEtat($etat);
               $entityManager->persist($task);
               $entityManager->flush();    
          
               return $this->json([
                        'success' =>  'success',
                          ]);}
            }


            #[Route('/copierDeplacerTask/{id}/{idPh}/{idE}', name: 'app_copierDeplacerTask')]
            public function copierDeplacerTask(Request $request,EntityManagerInterface $entityManager, SendMailServiceBlocageTask $mail2, SendMailServiceAffectationTask $mail, SendMailServiceRefusTask $mail1): Response
            { 
                $idT=$request->attributes->get('id');
                $idPh=$request->attributes->get('idPh');
                $idE=$request->attributes->get('idE');
                $type=$request->request->get('type');
                $t = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->andWhere('m.id = :id')
                ->setParameters([
                        'id'=>$idT
                      ])
                ->getQuery()->getResult();
                $task=$t[0]  ; 
                $e =  $entityManager
                ->getRepository(Etat::class)
                ->findById($idE);
                 $etat=$e[0]  ;  
                if($type==="Déplacer"&& ($idE==$task->getEtat()->getId())) {
                    return $this->json([
                        'danger' =>  "Cette tâche existe déjà dans cet état !", ] , Response::HTTP_NOT_ACCEPTABLE);
                }

           else{
            if($task->getEtat()->getTitre()!=="Terminé"&&$etat->getTitre()==="Terminé"){
               $task->setTauxAvancement("100");
               $task->setValide(null);
               $task->setProblemeBlocage("");
            }
            if($task->getEtat()->getTitre()==="Terminé"&&$etat->getTitre()!=="Terminé"){
                $task->setValide(null);
                $task->setProblemeBlocage("");
                $task->setRaisonRefus("");
             }
            if($task->getEtat()->getTitre()!=="Bloqué"&&$etat->getTitre()==="Bloqué"){
                $task->setRaisonRefus("");
                $task->setValide(null);
             }
             if($task->getEtat()->getTitre()==="Bloqué"&&$etat->getTitre()!=="Bloqué"){
                $task->setRaisonRefus("");
                $task->setProblemeBlocage("");
                $task->setValide(null);
             }
            if($type==="Déplacer"){
             
                if($task->getEtat()->getPhase()->getId()!=$idPh){
                    $task->setEtat($etat);
                $test = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->andWhere('phase.id = :id')
                ->andWhere('m.titre = :titre')
                ->setParameters([
                        'id'=>$idPh,
                        'titre'=>$task->getTitre()
                      ])
                ->getQuery()->getResult();
                $test1 = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->andWhere('phase.id = :id')
                ->andWhere('m.titre LIKE :titre')
                ->setParameters([
                        'id'=>$idPh,
                        'titre'=>'%'.$task->getTitre().".".'%'
                      ])
                ->getQuery()->getResult();
                if(count($test)!==0&&count($test1)===0){
                 $task->setTitre($task->getTitre().".".count($test1)+1);
                }
                if(count($test)!==0&&count($test1)!==0){
                 $task->setTitre($task->getTitre().".".count($test1)+1);
                }}
                if($task->getEtat()->getPhase()->getId()==$idPh){
                    $task->setEtat($etat); 
                }
                $entityManager->persist($task);
                $entityManager->flush(); 
            }
            if($type==="Copier"){
                $taskCopie = new Task();
                $taskCopie->setDescription( $task->getDescription());
                $taskCopie->setDateDebut( $task->getDateDebut());
                $taskCopie->setDateFin( $task->getDateFin());
                $taskCopie->setUser( $task->getUser());
                $taskCopie->setPriorite( $task->getPriorite());
                $taskCopie->setValide( $task->isValide());
                $taskCopie->setRaisonRefus( $task->getRaisonRefus());
                $taskCopie->setTauxAvancement( $task->getTauxAvancement());
                $taskCopie->setRang( $task->getRang());
                $taskCopie->setProblemeBlocage( $task->getProblemeBlocage());
                $taskCopie->setEtat($etat);
                $test = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->andWhere('phase.id = :id')
                ->andWhere('m.titre = :titre')
                ->setParameters([
                        'id'=>$idPh,
                        'titre'=>$task->getTitre()
                      ])
                ->getQuery()->getResult();
                $test1 = $entityManager
                ->getRepository(Task::class)
                ->createQueryBuilder('m')
                ->join('m.etat','etat')
                ->join('etat.phase','phase')
                ->andWhere('phase.id = :id')
                ->andWhere('m.titre LIKE :titre')
                ->setParameters([
                        'id'=>$idPh,
                        'titre'=>'%'.$task->getTitre()."-"."copie".'%'
                      ])
                ->getQuery()->getResult();
                if(count($test)!==0&&count($test1)===0){
                 $taskCopie->setTitre($task->getTitre()."-"."copie".count($test1)+1);
                }
                if(count($test)!==0&&count($test1)!==0){
                 $taskCopie->setTitre($task->getTitre()."-"."copie".count($test1)+1);
                }
                if(count($test)===0){
                    $taskCopie->setTitre($task->getTitre());}
                $entityManager->persist($taskCopie);
                $entityManager->flush();    
            }
          
                return $this->json([
                         'success' =>  'success',
                           ]);}
             }


             #[Route('/taskTermineClient/{idP}', name: 'app_taskTermineClient')]
             public function taskTermineClient(EntityManagerInterface $entityManager,Request $request): Response
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
                                    ->join('m.etat','etat')
                                    ->andWhere('etat.titre = :titre')
                                    ->andWhere('m.valide = :valide')
                                    ->setParameters([
                                            'idP'=>$id,
                                            'titre'=>"Terminé",
                                            'valide'=>true
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
                                     ->andWhere('etat.titre = :titre')
                                     ->andWhere('m.valide = :valide')
                                     ->setParameters([
                                             'idP'=>$id,
                                             'titre'=>"Terminé",
                                             'valide'=>true
                                           ])
                                      ->getQuery()->getResult();
                                    return $this->json(
                                        ['tasksUser' =>  $tasksUser,'tasksUserNull' =>  $tasksUserNull]
                                    );
                  }
                  
             #[Route('/taskTermineClientPhase/{idP}/{idPh}', name: 'app_taskTermineClientPhase')]
             public function taskTermineClientPhase(EntityManagerInterface $entityManager,Request $request): Response
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
                                     ->andWhere('projet.id = :idP')
                                    ->join('m.etat','etat')
                                    ->join('etat.phase','phase')
                                    ->andWhere('phase.id = :idPh')
                                    ->andWhere('etat.titre = :titre')
                                    ->andWhere('m.valide = :valide')
                                    ->setParameters([
                                            'idP'=>$id,
                                            'idPh'=>$idPh,
                                            'titre'=>"Terminé",
                                            'valide'=>true
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
                                     ->andWhere('etat.titre = :titre')
                                    ->andWhere('m.valide = :valide')
                                    ->setParameters([
                                            'idP'=>$id,
                                            'idPh'=>$idPh,
                                            'titre'=>"Terminé",
                                            'valide'=>true
                                          ])
                                      ->getQuery()->getResult();
                                    return $this->json(
                                        ['tasksUser' =>  $tasksUser,'tasksUserNull' =>  $tasksUserNull]
                                    );
                  }



                  #[Route('/taskTermineUserPhase/{idPh}/{idU}', name: 'app_taskTermineUserPhase')]
                  public function taskTermineUserPhase(EntityManagerInterface $entityManager,Request $request): Response
                                     {
                                    
                                         $idU=$request->attributes->get('idU');
                                         $id=$request->attributes->get('idPh');
                                         $task = $entityManager
                                         ->getRepository(Task::class)
                                         ->createQueryBuilder('m')
                                         ->join('m.user','droitAcces')
                                        ->join('droitAcces.user','users')
                                        ->andWhere('users.id = :idU')
                                         ->join('m.etat','etat')
                                         ->join('etat.phase','phase')
                                         ->andWhere('phase.id = :id')
                                         ->andWhere('etat.titre = :titre')
                                         ->andWhere('m.valide = :valide')
                                         ->setParameters([
                                                 'id'=>$id,
                                                 'idU'=>$idU,
                                                 'titre'=>"Terminé",
                                                 'valide'=>true
                                               ])
                                         ->getQuery()->getResult();
                          
                                         $taskPhase = $entityManager
                                         ->getRepository(Task::class)
                                         ->createQueryBuilder('m')
                                         ->join('m.user','droitAcces')
                                         ->join('droitAcces.user','users')
                                         ->andWhere('users.id = :idU')
                                         ->join('m.etat','etat')
                                         ->join('etat.phase','phase')
                                         ->andWhere('phase.id = :id')
                                         ->setParameters([
                                                 'id'=>$id,
                                                 'idU'=>$idU,
                                               ])
                                         ->getQuery()->getResult();
                                 
                                         $nb=count($task);
                                         $nbTous=count($taskPhase);
                                         if($nbTous!==0){
                                         $nbTaskRéalisé=($nb/$nbTous)*100;}
                                         if($nbTous===0){
                                            $nbTaskRéalisé=0;}
                                         $serializer = new Serializer([new ObjectNormalizer()]);
                                 
                                         $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
                                         return $this->json(
                                             ['task' =>  $data,'nb' =>  $nb,'nbTaskRéalisé' =>$nbTaskRéalisé]
                                         );
                       }

                       #[Route('/taskTermineUser/{idP}/{idU}', name: 'app_taskTermineUser')]
                       public function taskTermineUser(EntityManagerInterface $entityManager,Request $request): Response
                                          {$idU=$request->attributes->get('idU');
                                              $id=$request->attributes->get('idP');
                                              $task = $entityManager
                                              ->getRepository(Task::class)
                                              ->createQueryBuilder('m')
                                              ->join('m.etat','etat')
                                              ->join('m.user','droitAcces')
                                              ->join('droitAcces.user','users')
                                              ->andWhere('users.id = :idU')
                                              ->join('etat.phase','phase')
                                              ->join('phase.projet','projet')
                                              ->andWhere('projet.id = :id')
                                              ->andWhere('etat.titre = :titre')
                                              ->andWhere('m.valide = :valide')
                                              ->setParameters([
                                                      'id'=>$id,
                                                      'idU'=>$idU,
                                                      'titre'=>"Terminé",
                                                      'valide'=>true
                                                    ])
                                              ->getQuery()->getResult();
                               
                                              $taskProjet = $entityManager
                                              ->getRepository(Task::class)
                                              ->createQueryBuilder('m')
                                              ->join('m.user','droitAcces')
                                              ->join('droitAcces.user','users')
                                              ->andWhere('users.id = :idU')
                                              ->join('m.etat','etat')
                                              ->join('etat.phase','phase')
                                              ->join('phase.projet','projet')
                                              ->andWhere('projet.id = :id')
                                              ->setParameters([
                                                      'id'=>$id,
                                                      'idU'=>$idU,
                                                    ])
                                              ->getQuery()->getResult();
                                      
                                              $nb=count($task);
                                              $nbTous=count($taskProjet);
                                              if($nbTous!==0){
                                                $nbTaskRéalisé=($nb/$nbTous)*100;}
                                                if($nbTous===0){
                                                   $nbTaskRéalisé=0;}
                                              $serializer = new Serializer([new ObjectNormalizer()]);
                                      
                                              $data = $serializer->normalize($task, null, [AbstractNormalizer::ATTRIBUTES => ['id','titre','etat'=>['id','titre'],'user'=>['id','role', 'user' => ['sexe','username','id','roles','email','etat','photo','lastname']],'description','valide','tauxAvancement','priorite','dateDebut','dateFin','raisonRefus','problemeBlocage']]);
                                              return $this->json(
                                                  ['task' =>  $data,'nb' =>  $nb,'nbTaskRéalisé' =>$nbTaskRéalisé]);
                            }


    #[Route('/tasksUserProjet/{idP}/{idU}', name: 'app_tasksUserProjet')]
        public function tasksUserProjet(EntityManagerInterface $entityManager,Request $request): Response
                            {
                               $id=$request->attributes->get('idP');
                               $idU=$request->attributes->get('idU');
                               
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
                                       ->orderBy('m.rang', 'DESC')
                                ->getQuery()->getResult();
                               
                            return $this->json(['task' =>  $task, ]); 
                            }

   #[Route('/tasksNonAffectéProjet/{idP}', name: 'app_tasksNonAffectéProjet')]
        public function tasksNonAffectéProjet(EntityManagerInterface $entityManager,Request $request): Response
                                                {
                                                   $id=$request->attributes->get('idP');
                                                 $task = $entityManager
                                                   ->getRepository(Task::class)
                                                   ->createQueryBuilder('m')
                                                   ->andWhere('m.user is NULL')
                                                   ->join('m.etat','etat')
                                                   ->join('etat.phase','phase')
                                                   ->join('phase.projet','projet')
                                                   ->andWhere('projet.id = :idP')
                                                   ->setParameters([
                                                  
                                                           'idP'=>$id,])
                                                           ->orderBy('m.rang', 'DESC')
                                                    ->getQuery()->getResult();
                                                   
                                                return $this->json(['task' =>  $task, ]); 
                                                }

     #[Route('/tasksTousProjet/{idP}', name: 'app_tasksTousProjet')]
        public function tasksTousProjet(EntityManagerInterface $entityManager,Request $request): Response
                                                {
                                                   $id=$request->attributes->get('idP');
                                                  $task = $entityManager
                                                   ->getRepository(Task::class)
                                                   ->createQueryBuilder('m')
                                                   ->join('m.etat','etat')
                                                   ->join('etat.phase','phase')
                                                   ->join('phase.projet','projet')
                                                   ->andWhere('projet.id = :idP')
                                                   ->setParameters([
                                                           'idP'=>$id,])
                                                           ->orderBy('m.rang', 'DESC')
                                                    ->getQuery()->getResult();
                                                   
                                                return $this->json(['task' =>  $task, ]); 
                                                }


 #[Route('/tasksTousRéaliséProjet/{idP}', name: 'app_tasksTousRéaliséProjet')]
     public function tasksTousRéaliséProjet(EntityManagerInterface $entityManager,Request $request): Response
{
            $id=$request->attributes->get('idP');
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
                    'id'=>$id,
                    'titre'=>"Terminé",
                    'valide'=>true
                  ])
                  ->orderBy('m.rang', 'DESC')
            ->getQuery()->getResult();
                                                                                           
    return $this->json(['task' =>  $task, ]); }

 
    }
    

