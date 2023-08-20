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

class ChefProjetController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private ChefProjetRepository $chefProjetRepository,
       
        )
    {}  
    #[Route('/indexChefProjet', name: 'app_indexChefProjet', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager,Request $request,): Response
        {
            
            $user = $entityManager
            ->getRepository(ChefProjet::class)
            ->createQueryBuilder('c')
            ->join('c.utilisateur','user')
            ->andWhere('user.etat = :etat')
            ->setParameters([
                    'etat' => true
                  ])
            ->getQuery()->getResult();
    
            $nb=count($user);
          
            $serializer = new Serializer([new ObjectNormalizer()]);

            $data = $serializer->normalize($user, null, [AbstractNormalizer::ATTRIBUTES => ['id', 'utilisateur' => ['sexe','username','id','roles','email','etat','photo','lastname'], 'secteur' => ['id','titre']]]);
            return $this->json(
                ['user' =>  $data,'nb' =>  $nb]
            );
                
        }

#[Route('/detailChefProjet/{id}', name: 'app_detailChefProjet', methods: ['GET'])]
        public function detailChefProjet(EntityManagerInterface $entityManager,Request $request): Response
            {
               $user = $entityManager
                ->getRepository(ChefProjet::class)
                ->createQueryBuilder('m')
                ->join('m.utilisateur','user')
                ->andWhere('user.id = :id')
                ->setParameters([
                        'id' => $request->attributes->get('id')
                      ])
                ->getQuery()->getResult();
        
              
                $serializer = new Serializer([new ObjectNormalizer()]);
    
                $data = $serializer->normalize($user, null, [AbstractNormalizer::ATTRIBUTES => ['id', 'utilisateur' => ['sexe','username','id','roles','email','etat','photo','lastname','password'], 'secteur' => ['id','titre']]]);
                return $this->json(
                    ['chefProjet' =>  $data]
                );
                    
            }

#[Route('/secteurChefProjet/{secteur}', name: 'app_secteurChefProjet', methods: ['GET'])]
        public function secteurChefProjet(EntityManagerInterface $entityManager,Request $request): Response
                {
                   $user = $entityManager
                    ->getRepository(ChefProjet::class)
                    ->createQueryBuilder('m')
                    ->join('m.secteur','secteur')
                    ->join('m.utilisateur','user')
                    ->andWhere('user.etat = :etat')
                    ->andWhere('secteur.id = :id')
                    ->setParameters([
                            'id' => $request->attributes->get('secteur'),
                            'etat' => true
                          ])
                    ->getQuery()->getResult();
            
                  
                    $serializer = new Serializer([new ObjectNormalizer()]);
        
                    $data = $serializer->normalize($user, null, [AbstractNormalizer::ATTRIBUTES => ['id', 'utilisateur' => ['sexe','username','id','roles','email','etat','photo','lastname'], 'secteur' => ['id','titre']]]);
                    return $this->json(
                        ['user' =>  $data]
                    );
                        
                }

#[Route('/updateCh/{id}', name: 'app_updateCh', methods: ['POST'])]
    public function updateCh(Request $request,EntityManagerInterface $entityManager,
                          ): Response
                         { 
                           $membre = new Membre();
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
                                $qb =$entityManager->getRepository(ChefProjet::class)
                                ->createQueryBuilder('m');
                                $affected = $qb->delete()
                                        ->where('m.utilisateur = :user')
                                        ->getQuery()
                                        ->execute(['user' => $user]);
                                        $user->setRoles(['ROLE_MEMBRE']);
                                          $entityManager->persist($user);
                                          $entityManager->flush();
                                           $membre->setDepartement($request->request->get('departement'));
                                           $membre->setUtilisateur($user);
                                           $entityManager->persist($membre);
                                           $entityManager->flush();
                                      }
                             if($request->request->get('role')==='ROLE_CHEFPROJET') {
                                $m = $this->chefProjetRepository
                                ->findByUtilisateur($user);
                               $chefProjet=$m[0];
                              
                              $secteur =  $entityManager
                              ->getRepository(Secteur::class)
                              ->find($request->request->get('secteur'));
                            
                             $entityManager->persist($user);
                             $entityManager->flush();
                             $chefProjet->setSecteur($secteur);
                             $chefProjet->setUtilisateur($user);
                                           $entityManager->persist($chefProjet);
                                           $entityManager->flush();
       
                                        
                             }
                             if($request->request->get('role')==='ROLE_CLIENT') {
                                $qb =$entityManager->getRepository(ChefProjet::class)
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
