<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailServiceChangeClient
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
       $nom,
       $nomC,
       $sexe
    ) : void
    {
      
        // On crée le mail
        $email = (new Email())
        
            ->from($from)
            ->to($to)
            ->subject($object)
            ->html("Chers membres de l'équipe de projet <span style='font-weight:bold'> ".$nom."</span>, <br> <br>
            J'espère que vous allez bien.<br> Je tenais à vous informer d'un changement important concernant notre projet.
            <br>Nous aurons un nouveau client qui prendra la responsabilité du projet actuel.
            <br>Nous sommes heureux de vous annoncer que <span style='font-weight:bold'> ".$nomC."</span> assumera la responsabilité du projet. 
            <br>Nous sommes convaincus qu'".$sexe." apportera une nouvelle dynamique et de nouvelles opportunités à notre collaboration.
            <br>
          A très vite sur Our Team Collab.<br><br>   <a  href='http://localhost:3000' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Accéder à votre compte</a><br><br>Cordialement.");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}