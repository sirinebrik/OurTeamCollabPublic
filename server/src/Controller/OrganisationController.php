<?php

namespace App\Controller;
use App\Entity\User;
use App\Entity\Membre;
use App\Entity\ChefProjet;
use App\Entity\Client;
use App\Entity\Secteur;
use App\Entity\Organisation;
use App\Repository\SecteurRepository;
use App\Entity\EmailNotifications;
use App\Repository\EmailNotificationsRepository;
use App\Repository\UserRepository;
use App\Repository\OrganisationRepository;
use App\Repository\MembreRepository;
use App\Repository\ChefProjetRepository;
use App\Repository\ClientRepository;
use App\Service\FileUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\SendMailAuth;
use App\Service\SendMailValidInscriptionA;
use App\Service\SendMailValidInscription;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\HttpFoundation\Request;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class OrganisationController extends AbstractController
{
    #[Route('/organisation', name: 'app_organisation')]
    public function index(Request $request,EntityManagerInterface $entityManager,
    SendMailValidInscriptionA $mailA,SendMailValidInscription $mail,
       UserPasswordHasherInterface $passwordHasher,FileUploader $fileUploader): Response
   
          { $user = new User();
              $membre = new Membre();
              $chefProjet = new ChefProjet();
              $client = new Client();
              $content = json_decode($request->getContent());
             
             
              $password=$request->request->get('password');
              $resetpassword=$request->request->get('resetpassword');

              if($password===$resetpassword){
                  $user->setPassword(
                      $passwordHasher->hashPassword(
                          $user,
                          $password ));
                 $user->setUsername(ucfirst($request->request->get('username')));
                 $user->setLastname(ucfirst($request->request->get('lastname')));
                 $user->setSexe($request->request->get('sexe'));
                 $user->setEmail($request->request->get('email'));
                 $date=new \DateTime('now');
                 $user->setDateAjout($date);
                 $image=$request->files->get('photo');
                 
                 if($image){
                  $file = new UploadedFile($image,"demandeFile");
                  $fileName = $fileUploader->upload($file);
                  $user->setPhoto($fileName);
                 
              } 
              $user->setEtat(true);
              if($request->request->get('role')==="membre") {
                           $user->setRoles(['ROLE_MEMBRE']);
                           $entityManager->persist($user);
                           $entityManager->flush();
                            $membre->setDepartement($request->request->get('departement'));
                            $membre->setUtilisateur($user);
                            $entityManager->persist($membre);
                            $entityManager->flush();
                       }
              if($request->request->get('role')==="chef de projet") {
               $secteur =  $entityManager
               ->getRepository(Secteur::class)
               ->find($request->request->get('secteur'));
              $user->setRoles(['ROLE_CHEFPROJET']);
              $entityManager->persist($user);
              $entityManager->flush();
              $chefProjet->setSecteur($secteur);
              $chefProjet->setUtilisateur($user);
                            $entityManager->persist($chefProjet);
                            $entityManager->flush();
              }
              if($request->request->get('role')==="client") {
               $secteurC = $entityManager
               ->getRepository(Secteur::class)
               ->find($request->request->get('secteurC'));
               $user->setRoles(['ROLE_CLIENT']);
               $entityManager->persist($user);
               $entityManager->flush();
               $client->setNomEntreprise($request->request->get('nomEntreprise'));
               $client->setSecteur($secteurC);
               $client->setUtilisateur($user);
                            $entityManager->persist($client);
                            $entityManager->flush();
   
               }
               $admin=$entityManager
               ->getRepository(User::class)
               ->createQueryBuilder('u')
               ->andWhere('u.roles = :role')
               ->setParameters([ 'role' => '["ROLE_ADMIN"]'])
               ->getQuery()->getResult();

               $mailA->send(
                   'ourteamcollab@gmail.com',
                   $admin[0]->getEmail(),
                   ucfirst($request->request->get('username')).' '.ucfirst($request->request->get('lastname')),
                  
                   ucfirst($request->request->get('username')).' '.ucfirst($request->request->get('lastname')).' '." vient de s'inscrire sur la plateforme Acollab",
                  
                  
               );
               $email = new EmailNotifications();
               $email->setUser($admin[0]);
               $email->setStatus(0);
               $email->setObjet(ucfirst($request->request->get('username')).' '.ucfirst($request->request->get('lastname')).' '." vient de s'inscrire sur la plateforme Acollab"
              );
              $email->setContenu("Bonjour, \n".ucfirst($request->request->get('username')).' '.ucfirst($request->request->get('lastname'))
              ." vient de s'inscrire sur la plateforme Our Team Collab.");
              $email->setDate(date("Y-m-d"));
              $email->setHeure(date("H:i"));
              $entityManager->persist($email);
              $entityManager->flush();

               $mail->send(
                   'ourteamcollab@gmail.com',
                   $request->request->get('email'),
                   ucfirst($request->request->get('username')).' '.ucfirst($request->request->get('lastname')),
                  
                   "Création de votre compte",);
                   
               return $this->json([
                       'success' =>  'success',
                         ]);
           }
               
               else{
                   return $this->json([
                       'danger' =>  "Les deux mots de passe ne sont pas identiques. Veuillez les ressaisir.", ] , Response::HTTP_NOT_ACCEPTABLE);
               } 
       }
    
}
