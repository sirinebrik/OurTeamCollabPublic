<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailValidInscriptionA
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
            ->html("Bonjour, <br><span style='font-weight:bold'>".$name."</span> vient de s'inscrire sur la plateforme <span style='font-weight:bold'> 
            Our Team Collab</span>.");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}