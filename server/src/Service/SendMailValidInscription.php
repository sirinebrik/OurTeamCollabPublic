<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailValidInscription
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function send(
        $from ,
        $to,
        $username,
        $object,
       
    ) : void
    {
       $name=$username;
        // On crée le mail
        $email = (new Email())
        
            ->from($from)
            ->to($to)
            ->subject($object)
            ->html("Bonjour <span style='font-weight:bold'>".$name."</span>,<br> <br>Voici les informations pour accéder à votre compte :<br> 
            <span style='font-weight:bold'>Email : </span>".$to."<br> <span style='font-weight:bold'>Mot de passe : </span>Celui que vous avez choisi<br>
            Retenez bien cette URL qui vous permettra de vous connecter à votre plateforme ultérieurement.<br>
          A très vite sur Our Team Collab.<br><br>   <a  href='http://localhost:3000' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Je me connecte</a>");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}