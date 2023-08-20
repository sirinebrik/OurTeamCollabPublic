<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailService
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function send(
        $from ,
        $to,
        $object,
        $token
    ) : void
    {
       $name=$to->getUsername().' '.$to->getLastname();
        // On crée le mail
        $email = (new Email())
          
            ->from($from)
            ->to($to->getEmail())
            ->subject($object)
            ->html("Bonjour <span style='font-weight:bold'>".$name."</span>,<br> <br>Bienvenue chez  <span style='font-weight:bold'> 
            Our Team Collab </span>!<br> Nous avons cru comprendre que vous vouliez réinitialiser votre mot de passe. 
           <br> Cliquez sur le lien ci-dessous et vous serez redirigé vers un site sécurisé où vous pourrez définir un nouveau
             mot de passe<br><br>   <a  href='http://localhost:3000/resetPassword/".$token."' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Réinitialiser le mot de passe</a>");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}