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
    #[Route('/org', name: 'app_org')]
    public function index(): Response
    {
        return $this->render('organisation/index.html.twig', [
            'controller_name' => 'OrganisationController',
        ]);
    }
    #[Route('/organisation', name: 'app_organisation')]
    public function org(Request $request,EntityManagerInterface $entityManager,
       UserPasswordHasherInterface $passwordHasher,FileUploader $fileUploader): Response
   
       
        
               { $user = new User();
                   $organisation = new Organisation();
                   $content = json_decode($request->getContent());
                  
                  
                   $password=$request->request->get('password');
                   $resetpassword=$request->request->get('resetpassword');
     
                   if($password===$resetpassword){
                     $secteurC = $entityManager
                     ->getRepository(Secteur::class)
                     ->find($request->request->get('secteurC'));
                     $organisation->setNom($request->request->get('nomOrganisation'));
                     $organisation->setSecteur($secteurC);
                                  $entityManager->persist($organisation);
                                  $entityManager->flush();
     
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
                    $user->setRoles(['ROLE_ADMIN']);
                    $user->setOrganisation($organisation);
     
                    $entityManager->persist($user);
                    $entityManager->flush();
                      
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
