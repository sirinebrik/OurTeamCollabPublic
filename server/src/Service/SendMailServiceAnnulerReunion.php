<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailServiceAnnulerReunion
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function send(
        $from ,
        $to,
       $nom,
       $object,
       $titre,
       $date,
       $heureDebut,
       $nomProjet,
   $raison
    ) : void
    {
      
        // On crée le mail
        $email = (new Email())
        
            ->from($from)
            ->to($to)
            ->subject($object)
            ->html("Cher/Chère <span style='font-weight:bold'> ".$nom."</span>,
            <br> <br>J'espère que ce courrier vous trouve bien. 
            Je regrette de devoir vous informer que la réunion <span style='font-weight:bold'>". $titre."</span> prévue pour
             <span style='font-weight:bold'>". $date."</span> à <span style='font-weight:bold'>". $heureDebut."</span> est annulée dans le cadre de notre projet
             <span style='font-weight:bold'>". $nomProjet."</span>.
             <br>La raison de cette annulation est  <span style='font-weight:bold'>". $raison."</span>. 
             <br> Je comprends que cela peut causer des désagréments et je m'excuse sincèrement pour tout inconvénient que cela pourrait causer
              à votre emploi du temps. Nous ferons de notre mieux pour reprogrammer la réunion dès que possible.
             <br>N'hésitez pas à me contacter si vous avez des questions ou des préoccupations.
             <br><br> A très vite sur Our Team Collab.<br>   <a  href='http://localhost:3000' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Accéder à votre compte</a><br><br>Cordialement.");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}