<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailServiceProjet
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
       $nom,
       $role
    ) : void
    {
       $name=$username;
        // On crée le mail
        $email = (new Email())
        
            ->from($from)
            ->to($to)
            ->subject($object)
            ->html("Bonjour <span style='font-weight:bold'>".$name."</span>,<br> <br>Bienvenue chez  <span style='font-weight:bold'> 
            Our Team Collab </span>!<br>Vous avez été ajouté à cet espace de projet: <span style='font-weight:bold'>".$nom." </span><br>
            Votre droit d'accès: <span style='font-weight:bold'>".$role." </span><br>
          A très vite sur Our Team Collab.<br><br>   <a  href='http://localhost:3000' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Accéder à votre compte</a>");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}