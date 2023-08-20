<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailServiceReunion
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
       $description,
       $date,
       $heureDebut,
       $heureFin,
       $lien,
       $nomProjet,
   
    ) : void
    {
      
        // On crée le mail
        $email = (new Email())
        
            ->from($from)
            ->to($to)
            ->subject($object)
            ->html("Cher/Chère <span style='font-weight:bold'> ".$nom."</span>,
            <br> <br>J'espère que ce courrier vous trouve bien. Je tiens à vous 
            inviter à une réunion qui se tiendra dans le cadre de notre projet
             <span style='font-weight:bold'>". $nomProjet."</span>. Votre présence 
             et votre contribution sont essentielles pour le succès de cette réunion et pour
              faire progresser le projet vers ses objectifs.
            <br>Voici les détails de la réunion: <br>
            <ul>
            <li><span style='font-weight:bold'> Titre: </span> ".$titre."</li>
            <li><span style='font-weight:bold'> Date: </span> ".$date."</li>
            <li><span style='font-weight:bold'> Heure Début: </span> ".$heureDebut."</li>
            <li><span style='font-weight:bold'> Heure Fin: </span> ".$heureFin."</li>
            <li><span style='font-weight:bold'> Description: </span> ".$description."</li>
            <li><span style='font-weight:bold'> Lien: </span> ".$lien."</li>
            </ul><br>
            Veuillez confirmer votre présence dans notre plateforme avant ".$date." pour rejoindre la réunion.
            <br> A très vite sur Our Team Collab.<br>   <a  href='http://localhost:3000' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Accéder à votre compte</a><br><br>Cordialement.");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}