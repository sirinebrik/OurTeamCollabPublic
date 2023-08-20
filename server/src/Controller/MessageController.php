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
use App\Entity\Message;
use App\Entity\MessageRepository;
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
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

class MessageController extends AbstractController
{
  public function __construct(
     
    private JWTEncoderInterface $encoder,
    
    )
{}
    #[Route('/message/{id}', name: 'app_message')]
    public function message(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $message = $entityManager
        ->getRepository(Message::class)
        ->createQueryBuilder('m')
        ->join('m.fromUser','user')
        ->join('m.toUser','userU')
        ->andWhere('user.id = :id')
        ->OrWhere('userU.id = :id')
        ->setParameters([
                'id'=>$id,
                
              ])
             

        ->orderBy('m.id','DESC')
        ->getQuery()->getResult();
$data=[];
$i=0;
$to=0;
$from=0;
foreach($message as $message) {
   $j=0;
   $to=$message->getToUser()->getId();
   $from=$message->getFromUser()->getId();
   
   for($d=0;$d<count($data);$d++) {
    if(($data[$d]->getToUser()->getId()===$to&&$data[$d]->getFromUser()->getId()===$from)||($data[$d]->getToUser() ->getId()===$from&&$data[$d]->getFromUser()->getId()===$to))
     {$j=$j+1;}
    
   }
   if($j===0){
    $data[$i]=$message;
    $i=$i+1;
   }
}
$nonLu = $entityManager
->getRepository(Message::class)
->createQueryBuilder('m')
->join('m.toUser','userU')
->andWhere('userU.id = :id')
->andWhere('m.messageLu = :lu')
->setParameters([
        'id'=>$id,
        'lu'=>false,
      ])
->groupBy('m.fromUser')
->getQuery()->getResult();
  return $this->json(
            ['message' =>  $data,'nbM' =>  count($nonLu)]
        );
    }


    #[Route('/contact/{id}/{role}', name: 'app_contact')]
    public function contact(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $role=$request->attributes->get('role');
        $data=[];
        $i=0;
        if($role!=="ROLE_CLIENT"){
        $user= $entityManager
        ->getRepository(User::class)
        ->createQueryBuilder('m')
        ->andWhere('m.id != :id')
        ->setParameters([
                'id'=>$id,
                
              ])
        ->getQuery()->getResult();
        
   foreach($user as $user) {
    $message = $entityManager
    ->getRepository(Message::class)
    ->createQueryBuilder('m')
    ->join('m.fromUser','user')
    ->join('m.toUser','userU')
    ->where('user.id = :id AND  userU.id = :idU')
    ->orWhere('user.id = :idU AND  userU.id = :id')
    ->setParameters([
            'id'=>$id,
            'idU'=>$user->getId(),
          ])
      ->getQuery()->getResult();
    if(count($message)===0){
       $data[$i]=$user;
      $i=$i+1;
   };
};
        }
        else{
            $droit= $entityManager
            ->getRepository(DroitAcces::class)
            ->createQueryBuilder('m')
            ->join('m.user','user')
            ->andWhere('user.id = :id')
            ->setParameters([
                    'id'=>$id,
                    
                  ])
            ->getQuery()->getResult();
            $user = $entityManager
            ->getRepository(User::class)
            ->createQueryBuilder('u')
            ->andWhere('u.roles = :role')
            ->setParameters([ 'role' => '["ROLE_ADMIN"]'])
            ->getQuery()->getResult();
            $message = $entityManager
            ->getRepository(Message::class)
            ->createQueryBuilder('m')
            ->join('m.fromUser','user')
            ->join('m.toUser','userU')
            ->where('user.id = :id AND  userU.id = :idU')
            ->orWhere('user.id = :idU AND  userU.id = :id')
            ->setParameters([
                    'id'=>$id,
                    'idU'=>$user[0]->getId(),
                  ])
              ->getQuery()->getResult();
              if(count($message)===0){
            $data[$i]=$user[0];
            $i=$i+1;}
            foreach($droit as $droit) {
                $user1= $entityManager
                ->getRepository(DroitAcces::class)
                ->createQueryBuilder('m')
                ->join('m.projet','projet')
                ->andWhere('projet.id != :id')
                ->andWhere('m.role = :role')
                ->setParameters([
                        'id'=>$droit->getProjet()->getId(),
                        'role'=>'chefProjet',
                      ])
                ->getQuery()->getResult();
                $message = $entityManager
                ->getRepository(Message::class)
                ->createQueryBuilder('m')
                ->join('m.fromUser','user')
                ->join('m.toUser','userU')
                ->where('user.id = :id AND  userU.id = :idU')
                ->orWhere('user.id = :idU AND  userU.id = :id')
                ->setParameters([
                        'id'=>$id,
                        'idU'=>$user1[0]->getUser()->getId(),
                      ])
                  ->getQuery()->getResult();
                if(count($message)===0){
                   $data[$i]=$user1[0]->getUser();
                  $i=$i+1;}
                }    

        }


  return $this->json(
            ['users' =>  $data]
        );
    }

    #[Route('/messageUser/{id}/{idU}', name: 'app_messageUser')]
    public function messageUser(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
        $message = $entityManager
        ->getRepository(Message::class)
        ->createQueryBuilder('m')
        ->join('m.fromUser','user')
        ->join('m.toUser','userU')
        ->where('user.id = :id AND  userU.id = :idU')
        ->orWhere('user.id = :idU AND  userU.id = :id')
        ->setParameters([
                'id'=>$id,
                'idU'=>$idU

              ])
       ->orderBy("m.id","DESC")
        ->getQuery()->getResult();

      
        return $this->json(
            ['message' =>  $message]
        );
    }

    #[Route('/ajouterMessage/{id}/{idU}', name: 'app_ajouterMessage')]
    public function AjouterMessage(Request $request,EntityManagerInterface $entityManager): Response
    {
        $id=$request->attributes->get('id');
        $idU=$request->attributes->get('idU');
       
        $message = new Message();
        $date=new \DateTime('now');
        $jwtToken = $this->encoder->encode(['contenu' =>$request->request->get('contenu')]);
        $message->setContenu($jwtToken);
        $message->setDateEnvoi($date->format('Y/m/d'));
        $message->setHeureEnvoi($date->format('G:i'));
        $message->setMessageLu(false);
        $fr =  $entityManager
        ->getRepository(User::class)
        ->findById($id);
        $t=  $entityManager
        ->getRepository(User::class)
        ->findById($idU);
        $from=$fr[0]  ;
        $to=$t[0]  ;
        $message->setFromUser($from);
        $message->setToUser($to);
        $entityManager->persist($message);
        $entityManager->flush();

        return $this->json([
            'success' =>  $message->getId(),
            'to' =>  $to,
            'from' =>  $from,
              ]);
    }


    #[Route('/marquerLuMessages/{id}', name: 'app_marquerLuMessages')]
    public function marquerLuMessages(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $nonLu = $entityManager
        ->getRepository(Message::class)
        ->createQueryBuilder('m')
        ->join('m.toUser','userU')
        ->andWhere('userU.id = :id')
        ->andWhere('m.messageLu = :lu')
        ->setParameters([
                'id'=>$id,
                'lu'=>false,
              ])
        ->getQuery()->getResult();
        foreach($nonLu as $nonLu){
            $nonLu->setMessageLu(true);
            $entityManager->persist($nonLu);
            $entityManager->flush();}
        return $this->json(
            ['success' =>  'success']
        );
    }
    #[Route('/marquerLuMessage/{id}/{u}/{F}', name: 'app_marquerLuMessage')]
    public function marquerLuMessage(EntityManagerInterface $entityManager,Request $request): Response
    {
        $idT=$request->attributes->get('u');
        $idF=$request->attributes->get('F');
        $id=$request->attributes->get('id');

        $nonLu = $entityManager
        ->getRepository(Message::class)
        ->createQueryBuilder('m')
        ->join('m.toUser','userU')
        ->join('m.fromUser','user')
        ->andWhere('userU.id = :idF')
        ->andWhere('user.id = :idT')
        ->andWhere('m.id = :id')
        ->setParameters([
             'idT'=>$idT,
                'idF'=>$idF,
                'id'=>$id,
              ])
        ->getQuery()->getResult();
       
        $nonLu[0]->setMessageLu(true);
        $entityManager->persist(  $nonLu[0]);
        $entityManager->flush();

        $nonLu = $entityManager
        ->getRepository(Message::class)
        ->createQueryBuilder('m')
        ->join('m.toUser','userU')
        ->join('m.fromUser','user')
        ->andWhere('userU.id = :idF')
        ->andWhere('user.id = :idT')
        ->andWhere('m.messageLu = :lu')
        ->setParameters([
                'idT'=>$idT,
                'idF'=>$idF,
                'lu'=>false,
              ])
        ->getQuery()->getResult();
        foreach($nonLu as $nonLu){
            $nonLu->setMessageLu(true);
            $entityManager->persist($nonLu);
            $entityManager->flush();}
        return $this->json(
            ['success' =>  'success']
        );
    }
}
