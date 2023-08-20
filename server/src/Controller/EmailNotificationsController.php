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

class EmailNotificationsController extends AbstractController
{
    #[Route('/email/notifications', name: 'app_email_notifications')]
    public function index(): Response
    {
        return $this->render('email_notifications/index.html.twig', [
            'controller_name' => 'EmailNotificationsController',
        ]);
    }
    #[Route('/emailNotif/{id}', name: 'app_emailNotif')]
    public function emailNotif(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $email = $entityManager
        ->getRepository(EmailNotifications::class)
        ->createQueryBuilder('m')
        ->join('m.user','user')
        ->andWhere('user.id = :id')
        ->setParameters([
                'id'=>$id,
              ])
        ->orderBy("m.id","DESC")
        ->getQuery()->getResult();
        $emailNotRead = $entityManager
        ->getRepository(EmailNotifications::class)
        ->createQueryBuilder('m')
        ->join('m.user','user')
        ->andWhere('user.id = :id')
        ->andWhere('m.status = :status')
        ->setParameters([
                'id'=>$id,
                'status'=>false
              ])
       
        ->getQuery()->getResult();
        $nb=count($emailNotRead);
        $serializer = new Serializer([new ObjectNormalizer()]);

        $data = $serializer->normalize($email, null, [AbstractNormalizer::ATTRIBUTES => ['id','status','date','heure','contenu','objet']]);
        return $this->json(
            ['email' =>  $data,'nb' =>  $nb]
        );
    }

    #[Route('/marquerLu/{id}', name: 'app_marquerLu')]
    public function marquerLu(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $email = $entityManager
        ->getRepository(EmailNotifications::class)
        ->createQueryBuilder('m')
        ->join('m.user','user')
        ->andWhere('user.id = :id')
        ->andWhere('m.status = :status')
        ->setParameters([
                'id'=>$id,
                'status'=>false
              ])
        ->getQuery()->getResult();
        foreach($email as $email){
        $email->setStatus(true);
        $entityManager->persist($email);
        $entityManager->flush();}
        return $this->json(
            ['success' =>  'success']
        );
    }

    #[Route('/deleteEmail', name: 'app_deleteEmail')]
    public function deleteEmail(EntityManagerInterface $entityManager,Request $request): Response
    {
        $par=$request->get('id');

        foreach($par as $par) {
            $qb =$entityManager->getRepository(EmailNotifications::class)
            ->createQueryBuilder('m');
            $affected = $qb->delete()
                    ->where('m.id = :id')
                    ->getQuery()
                    ->execute(['id' => $par]);
        }
        return $this->json(
            ['success' =>  'success']
        );
    }
    
    #[Route('/deleteEmailDetail/{id}', name: 'app_deleteEmailDetail')]
    public function deleteEmailDetail(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $qb =$entityManager->getRepository(EmailNotifications::class)
            ->createQueryBuilder('m');
            $affected = $qb->delete()
                    ->where('m.id = :id')
                    ->getQuery()
                    ->execute(['id' => $id]);
        
        return $this->json(
            ['success' =>  'success']
        );
    }

    #[Route('/marquerLuEmail/{id}', name: 'app_marquerLuEmail')]
    public function marquerLuEmail(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $email = $entityManager
        ->getRepository(EmailNotifications::class)
        ->createQueryBuilder('m')
        ->andWhere('m.id = :id')
        ->setParameters([
                'id'=>$id,
              ])
        ->getQuery()->getResult();
       
        $email[0]->setStatus(true);
        $entityManager->persist( $email[0]);
        $entityManager->flush();
        return $this->json(
            ['success' =>  'success']
        );
    }
    #[Route('/detailEmail/{id}', name: 'app_detailEmail')]
    public function detailEmail(EntityManagerInterface $entityManager,Request $request): Response
    {
        $id=$request->attributes->get('id');
        $email = $entityManager
        ->getRepository(EmailNotifications::class)
        ->createQueryBuilder('m')
        ->andWhere('m.id = :id')
        ->setParameters([
                'id'=>$id,
              ])
        ->getQuery()->getResult();
       
       
        return $this->json(
            ['email' =>  $email]
        );
    }
}
