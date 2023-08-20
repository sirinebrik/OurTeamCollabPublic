<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Entity\Membre;
use App\Entity\ChefProjet;
use App\Entity\Client;
use App\Entity\Secteur;
use App\Repository\SecteurRepository;
use App\Repository\UserRepository;
use App\Repository\MembreRepository;
use App\Repository\ChefProjetRepository;
use App\Repository\ClientRepository;
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
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class MembreController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private MembreRepository $membreRepository,
       
        )
    {}  
    #[Route('/indexMembre', name: 'app_indexMembre', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager,Request $request,): Response
        {
          
        
            $user = $entityManager
            ->getRepository(Membre::class)
            ->createQueryBuilder('m')
            ->join('m.utilisateur','user')
            ->andWhere('user.etat = :etat')
            ->setParameters([
                    'etat' => true
                  ])
            ->getQuery()->getResult();
    
            $nb=count($user);
            $serializer = new Serializer([new ObjectNormalizer()]);

            $data = $serializer->normalize($user, null, [AbstractNormalizer::ATTRIBUTES => ['id','departement', 'utilisateur' => ['sexe','username','id','roles','email','etat','photo','lastname']]]);
            return $this->json(
                ['user' =>  $data,'nb' =>  $nb]
            );
                
        }
    #[Route('/detailMembre/{id}', name: 'app_detailMembre', methods: ['GET'])]
        public function detailMembre(EntityManagerInterface $entityManager,Request $request): Response
            {
               $user = $entityManager
                ->getRepository(Membre::class)
                ->createQueryBuilder('m')
                ->join('m.utilisateur','user')
                ->andWhere('user.id = :id')
                ->setParameters([
                        'id' => $request->attributes->get('id')
                      ])
                ->getQuery()->getResult();
        
              
                $serializer = new Serializer([new ObjectNormalizer()]);
    
                $data = $serializer->normalize($user, null, [AbstractNormalizer::ATTRIBUTES => ['id','departement', 'utilisateur' => ['sexe','username','id','roles','email','etat','photo','lastname','password']]]);
                return $this->json(
                    ['membre' =>  $data]
                );
                    
            }


#[Route('/departementMembre/{departement}', name: 'app_departementMembre', methods: ['GET'])]
    public function departementMembre(EntityManagerInterface $entityManager,Request $request): Response
                {
                   $user = $entityManager
                    ->getRepository(Membre::class)
                    ->createQueryBuilder('m')
                    ->andWhere('m.departement = :departement')
                    ->join('m.utilisateur','user')
                    ->andWhere('user.etat = :etat')
                    ->setParameters([
                            'departement' => $request->attributes->get('departement'),
                            'etat'=>true
                          ])
                    ->getQuery()->getResult();
            
                  
                    $serializer = new Serializer([new ObjectNormalizer()]);
        
                    $data = $serializer->normalize($user, null, [AbstractNormalizer::ATTRIBUTES => ['id','departement', 'utilisateur' => ['sexe','username','id','roles','email','etat','photo','lastname']]]);
                    return $this->json(
                        ['user' =>  $data]
                    );
                        
                }

#[Route('/updateM/{id}', name: 'app_updateM', methods: ['POST'])]
         public function updateM(Request $request,EntityManagerInterface $entityManager,
                   ): Response
                  { 
                    $chefProjet = new ChefProjet();
                    $client = new Client();
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
                         if($request->request->get('etat')==="true"){
                         $user->setEtat(true);}
                         else{
                            $user->setEtat(false);  
                         }
                         
                      if($request->request->get('role')==='ROLE_MEMBRE') {
                                  $m = $this->membreRepository
                                      ->findByUtilisateur($user);
                                   $membre=$m[0];
                                   $entityManager->persist($user);
                                   $entityManager->flush();
                                    $membre->setDepartement($request->request->get('departement'));
                                    $membre->setUtilisateur($user);
                                    $entityManager->persist($membre);
                                    $entityManager->flush();
                               }
                      if($request->request->get('role')==='ROLE_CHEFPROJET') {
                       
                        $qb =$entityManager->getRepository(Membre::class)
                        ->createQueryBuilder('m');
                        $affected = $qb->delete()
                                ->where('m.utilisateur = :user')
                                ->getQuery()
                                ->execute(['user' => $user]);
                       
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
                      if($request->request->get('role')==='ROLE_CLIENT') {
                        $qb =$entityManager->getRepository(Membre::class)
                        ->createQueryBuilder('m');
                        $affected = $qb->delete()
                                ->where('m.utilisateur = :user')
                                ->getQuery()
                                ->execute(['user' => $user]);
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
                      
      
                    
                       return $this->json([
                               'success' =>  'success',
                                 ]);
                }
                
               
            
     
}
