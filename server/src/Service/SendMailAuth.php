<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailAuth
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
        $token
    ) : void
    {
       $name=$username;
        // On crée le mail
        $email = (new Email())
        
            ->from($from)
            ->to($to)
            ->subject($object)
            ->html("Bonjour <span style='font-weight:bold'>".$name."</span>,<br> <br> Vous invite à rejoindre la plateforme <span style='font-weight:bold'> 
            Our Team Collab</span>.<br> Pour finaliser votre inscription, cliquez sur le lien ci-dessous. 
           <br> A très vite sur Our Team Collab.<br><br>   <a  href='http://localhost:3000/inscrire/".$token."' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Je m'inscris</a>");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}