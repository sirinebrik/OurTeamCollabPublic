<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use JWT\Authentication\JWT;
use App\Service\SendMailService;
use Doctrine\ORM\EntityManagerInterface;


class LoginController extends AbstractController
{
    public function __construct(
     
        private JWTEncoderInterface $encoder,
        private UserRepository $userRepository,
        private SendMailService $mail
        )
    {}
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(#[CurrentUser] ?User $user, Request $request): Response
    {
      
        if (null === $user) {
            return $this->json([
                'message' => 'Email ou mot de passe invalide !',
              
            ], Response::HTTP_UNAUTHORIZED);
        }
        if( $user->isEtat()===false){
            return $this->json([
                'message' => 'Votre compte a été désactivé !',
             
            ], Response::HTTP_UNAUTHORIZED);
        }
        
        $jwtToken = $this->encoder->encode(['username' => $user->getUserIdentifier(), 'name' => $user->getUsername(),'lastname' => $user->getLastname(),'roles' => $user->getRoles(), 'id' => $user->getId(), 'org' => $user->getOrganisation()->getId()]);
        return new JsonResponse(['token' => $jwtToken], Response::HTTP_CREATED);
    
    }
    #[Route('/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
    

   #[Route('/getMe/{token}', name: 'getMe', methods: ['GET'])]
    public function getMe(Request $request) : Response
      { 
        $token=$request->attributes->get('token');
        $tokenParts = explode(".", $token);  
        $tokenHeader = base64_decode($tokenParts[0]);
        $tokenPayload = base64_decode($tokenParts[1]);
        $jwtHeader = json_decode($tokenHeader);
        $jwtPayload = json_decode($tokenPayload);
      
        $user = $this->userRepository
        ->findById($jwtPayload->id);
       
        return $this->json([
            'user' =>  $user[0],
           
        ]);
      }

      #[Route('/forgotPassword/{email}', name:'forgotPassword', methods: ['POST'])]
      public function forgotPassword(string $email,Request $request,SendMailService $mail): Response
      {
           //On va chercher l'utilisateur par son email
          
              $user = $this->userRepository->findOneByEmail($email);
            // On vérifie si on a un utilisateur
              if($user){
                $token = $this->encoder->encode([ 'id' => $user->getId()]);

                  // On génère un token de réinitialisation
                // Envoi du mail
                  $mail->send(
                      'ourteamcollabpublic@gmail.com',
                      $user,
                      'Réinitialiser le mot de passe',
                      $token
                     
                  );
  
                  return $this->json([
                    'success' =>  "success", ]);
              }
              // $user est null
             else{   return $this->json([
                'danger' =>  "danger", ] , Response::HTTP_UNAUTHORIZED);
        }
    }

    #[Route('/resetPassword/{token}/{password}/{resetpassword}', name:'resetPassword', methods: ['POST'])]
      public function resetPassword(Request $request,string $password,string $resetpassword,
      UserPasswordHasherInterface $passwordHasher,
      EntityManagerInterface $entityManager
      ): Response
      {
          $token=$request->attributes->get('token');
           $tokenParts = explode(".", $token);  
           $tokenHeader = base64_decode($tokenParts[0]);
           $tokenPayload = base64_decode($tokenParts[1]);
           $jwtHeader = json_decode($tokenHeader);
           $jwtPayload = json_decode($tokenPayload);
           $u = $this->userRepository
           ->findById($jwtPayload->id);
           $user=$u[0];
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
                'danger' =>  "Votre lien invalide", ] , Response::HTTP_UNAUTHORIZED);
        }
    
    }
}