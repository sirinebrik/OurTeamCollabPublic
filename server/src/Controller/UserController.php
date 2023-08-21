<?php

namespace App\Controller;
use App\Entity\User;
use App\Entity\Membre;
use App\Entity\ChefProjet;
use App\Entity\Client;
use App\Entity\Secteur;
use App\Entity\Organisation;
use App\Repository\OrganisationRepository;
use App\Repository\SecteurRepository;

use App\Repository\UserRepository;
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

class UserController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private MembreRepository $membreRepository,
        private ChefProjetRepository $chefProjetRepository,
        private ClientRepository $clientRepository,
        private SecteurRepository $secteurRepository,
        private JWTEncoderInterface $encoder,
        )
    {}  

    #[Route('/inviter', name: 'app_user', methods: ['POST'])]
    public function inviter(Request $request,EntityManagerInterface $entityManager,SendMailAuth $mail): Response
    {
       
       $content = json_decode($request->getContent());
       $user = $this->userRepository
       ->findByEmail($content->email); 
       if(!$user){
        $secteur =  $entityManager
        ->getRepository(Secteur::class)
        ->findById($content->secteur);
      

         $secteurC = $entityManager
        ->getRepository(Secteur::class)
        ->findById($content->secteurC);
       
        $jwtToken = $this->encoder->encode(['role' => $content->role,'secteur' => $content->secteur,'secteurC' => $content->secteurC,'sexe' => $content->sexe,
         'username' => $content->username,'lastname'=>$content->lastname,'email'=>$content->email,"departement"=>$content->departement,"nomEntreprise"=>$content->nomEntreprise,"org"=>$content->org]);
        $mail->send(
            'ourteamcollabpublic@gmail.com',
            $content->email,
            ucfirst($content->username).' '.ucfirst($content->lastname),
           
            'Rejoindre la plateforme Our Team Collab',
            $jwtToken
           
        );
                return $this->json([
                    'success' =>  'success',
                      ]);
                }
                else{
                    return $this->json([
                        'danger' =>  "Email existe déja !", ] , Response::HTTP_NOT_ACCEPTABLE);
                   }
                }

    #[Route('/inscrire', name: 'app_inscrire', methods: ['POST'])]
          public function inscrire(Request $request,EntityManagerInterface $entityManager,
          SendMailValidInscriptionA $mailA,SendMailValidInscription $mail,
             UserPasswordHasherInterface $passwordHasher,FileUploader $fileUploader): Response
            { $user = new User();
                $membre = new Membre();
                $chefProjet = new ChefProjet();
                $client = new Client();
                $organisation = $entityManager
                ->getRepository(Organisation::class)
                ->find($request->request->get('org'));
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
                   $user->setOrganisation($organisation);
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
                 ->join('u.organisation','organisation')
                 ->andWhere('organisation.id = :org')
                 ->setParameters([ 'role' => '["ROLE_ADMIN"]','org' => $request->request->get('org')])
                 ->getQuery()->getResult();

                 $mailA->send(
                     'ourteamcollabpublic@gmail.com',
                     $admin[0]->getEmail(),
                     ucfirst($request->request->get('username')).' '.ucfirst($request->request->get('lastname')),
                    
                     ucfirst($request->request->get('username')).' '.ucfirst($request->request->get('lastname')).' '." vient de s'inscrire sur la plateforme Acollab",
                    
                    
                 );
               

                 $mail->send(
                     'ourteamcollabpublic@gmail.com',
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
                

    #[Route('/validerUser/{email}', name: 'app_valiserUser', methods: ['GET'])]
         public function validerUser(Request $request,EntityManagerInterface $entityManager): Response
          {       $user = new User();
                  $email=$request->attributes->get('email');
                  $user =  $entityManager
                    ->getRepository(User::class)
                    ->findByEmail($email);
                  $valide="true";
                  if($user){
                    $valide="false"; 
                  }
             return $this->json(['valide' =>  $valide]);
}

#[Route('/indexUser/{org}', name: 'app_indexUser', methods: ['GET'])]
public function index(EntityManagerInterface $entityManager,Request $request,): Response
    {
        $org=$request->attributes->get('org');

            $user = $entityManager
            ->getRepository(User::class)
            ->createQueryBuilder('u')
            ->andWhere('u.roles != :role')
            ->andWhere('u.etat = :etat')
            ->join('u.organisation','organisation')
            ->andWhere('organisation.id = :org')
            ->setParameters([ 'role' => '["ROLE_ADMIN"]','etat'=>true,'org' => $org])
            ->getQuery()->getResult();
    
            $nb=count($user);
      
            return $this->json(['user' =>  $user,'nb' =>  $nb]);
            
    }

#[Route('/indexUserDésac/{org}', name: 'app_indexUserDésac', methods: ['GET'])]
    public function indexDésac(EntityManagerInterface $entityManager,Request $request,): Response
        {
            $org=$request->attributes->get('org');

                $user = $entityManager
                ->getRepository(User::class)
                ->createQueryBuilder('u')
                ->andWhere('u.roles != :role')
                ->andWhere('u.etat = :etat')
                ->join('u.organisation','organisation')
                ->andWhere('organisation.id = :org')
                ->setParameters([ 'role' => '["ROLE_ADMIN"]','etat'=>false,'org' => $org])
                ->getQuery()->getResult();
        
                $nb=count($user);
          
                return $this->json(['user' =>  $user,'nb' =>  $nb]);
                
        }

#[Route('/activeUser/{id}', name: 'app_activeUser', methods: ['POST'])]
    public function Active(EntityManagerInterface $entityManager,Request $request,int $id): Response
        {
            $u = $entityManager
            ->getRepository(User::class)
            ->findById($id);
            $user=$u[0];
            $user->setEtat(true);
            $entityManager->persist($user);
            $entityManager->flush();
          
                return $this->json(['success' =>  'success']);
                
        }
#[Route('/désactiveUser/{id}', name: 'app_désactiveUser', methods: ['POST'])]
    public function Désactive(EntityManagerInterface $entityManager,Request $request,int $id): Response
            {
                $u = $entityManager
                ->getRepository(User::class)
                ->findById($id);
                $user=$u[0];
                $user->setEtat(false);
                $entityManager->persist($user);
                $entityManager->flush();
              
                    return $this->json(['success' =>  'success']);
                    
            }

#[Route('/detailAdmin/{id}', name: 'app_detailMembre', methods: ['GET'])]
    public function detailAdmin(EntityManagerInterface $entityManager,Request $request): Response
     {
                   $user = $entityManager
                    ->getRepository(User::class)
                    ->createQueryBuilder('m')
                   ->andWhere('m.id = :id')
                    ->setParameters([
                            'id' => $request->attributes->get('id')
                          ])
                    ->getQuery()->getResult();
            
                  
                    $serializer = new Serializer([new ObjectNormalizer()]);
        
                    $data = $serializer->normalize($user, null, [AbstractNormalizer::ATTRIBUTES =>  ['sexe','username','id','roles','email','etat','photo','lastname','password', 'organisation' => ['id','nom','secteur' => ['id','titre']] ]]);
                    return $this->json(
                        ['admin' =>  $data]
                    );
                        
                }  

#[Route('/changePhoto/{id}', name:'changePhoto', methods: ['POST','GET'])]
        public function changePhoto(Request $request,EntityManagerInterface $entityManager,FileUploader $fileUploader
                ): Response
                {
                   $id=$request->attributes->get('id');
                    
                     $u = $this->userRepository
                     ->findById($id);
                     $user=$u[0];
                       // On vérifie si on a un utilisateur
                      if($user){
                        $image=$request->files->get('photo');
                         if($image){
                         $file = new UploadedFile($image,"demandeFile");
                         $fileName = $fileUploader->upload($file);
                         $user->setPhoto($fileName); 
                         $entityManager->persist($user);
                         $entityManager->flush();
                        } 
                         
                         return $this->json([
                              'success' =>  "success" ]);
                          }
                      
              
              }

#[Route('/updateA/{id}', name: 'app_updateA', methods: ['POST'])]
    public function updateA(Request $request,EntityManagerInterface $entityManager,
              SendMailValidInscriptionA $mailA,SendMailValidInscription $mail,
                 UserPasswordHasherInterface $passwordHasher,FileUploader $fileUploader): Response
                {  
                    $id=$request->attributes->get('id');
                    $u = $this->userRepository
                    ->findById($id);
                    $user=$u[0];

                    $e = $this->userRepository
                    ->findByEmail($request->request->get('email')); 
                    if($e){
                        $email=$e[0];
                        if($e[0]->getId()!=$id){
                        return $this->json([
                            'danger' =>  "Email existe déja !", ] , Response::HTTP_NOT_ACCEPTABLE);
                        }
                    }
                       $user->setUsername(ucfirst($request->request->get('username')));
                       $user->setLastname(ucfirst($request->request->get('lastname')));
                       $user->setSexe($request->request->get('sexe'));
                       $user->setEmail($request->request->get('email'));
                       $entityManager->persist($user);
                        $entityManager->flush();
                        $secteurC = $entityManager
                        ->getRepository(Secteur::class)
                        ->find($request->request->get('secteurC'));
                        $org= $user->getOrganisation();
                        $org->setNom($request->request->get('nomEntreprise'));
                        $org->setSecteur($secteurC);
                        $entityManager->persist($org);
                        $entityManager->flush();
                        return $this->json([
                            'success' =>  'success',
                              ]);
                    }


#[Route('/updatePassword/{id}', name:'updatePassword', methods: ['POST'])]
      public function updatePassword(Request $request,
                    UserPasswordHasherInterface $passwordHasher,
                    EntityManagerInterface $entityManager
                    ): Response
                    { 
                        $id=$request->attributes->get('id');
                        $u = $this->userRepository
                        ->findById($id);
                        $user=$u[0];
                        $password=$request->request->get('password');
                        $resetpassword=$request->request->get('resetpassword');
                           // On vérifie si on a un utilisateur
                          if($user){
                              if($password===$resetpassword){
                              $user->setPassword(
                                  $passwordHasher->hashPassword(
                                      $user,
                                      $password ));
                              $entityManager->persist($user);
                              $entityManager->flush();
                              
                              return $this->json([
                                  'success' =>  "success" ]);
                              }
                             else{
                              return $this->json([
                                   'danger' =>  "Les deux mots de passe ne sont pas identiques. Veuillez les ressaisir.", ] , Response::HTTP_NOT_ACCEPTABLE);
                              }
                         
                            // $user est null
                          } else{   return $this->json([
                              'danger' =>  "utilisateur invalide", ] , Response::HTTP_UNAUTHORIZED);
                      }
                  
                  }
                  
            
                  #[Route('/infoUser/{id}', name: 'app_infoUser', methods: ['GET'])]
                  public function infoUser(EntityManagerInterface $entityManager,Request $request,): Response
                      {
                        $id=$request->attributes->get('id');
                              $user = $entityManager
                              ->getRepository(User::class)
                              ->createQueryBuilder('u')
                              ->andWhere('u.id = :id')
                              ->setParameters([ 'id' => $id])
                              ->getQuery()->getResult();
                             return $this->json(['user' =>  $user]);
                              
                      }

}

