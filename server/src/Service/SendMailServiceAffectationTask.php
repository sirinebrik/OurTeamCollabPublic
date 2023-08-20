<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailServiceAffectationTask
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
       $dateDebut,
       $dateFin,
       $priorité,
       $nomProjet,
       $nomPhase
   
    ) : void
    {
      
        // On crée le mail
        $email = (new Email())
        
            ->from($from)
            ->to($to)
            ->subject($object)
            ->html("Cher/Chère <span style='font-weight:bold'> ".$nom."</span>,
            <br> <br>Je vous écris pour vous informer de l'affectation d'une nouvelle tâche importante.
             À partir d'aujourd'hui, vous êtes chargé(e) de la réalisation de la tâche suivante : 
             <span style='font-weight:bold'>". $titre."</span>.
            <br>Veuillez prendre en compte les détails suivants : <br>
            <ul>
            <li><span style='font-weight:bold'> Nom de projet: </span> ".$nomProjet."</li>
            <li><span style='font-weight:bold'> Nom de phase: </span> ".$nomPhase."</li>
            <li><span style='font-weight:bold'> Description de la tâche: </span> ".$description."</li>
            <li><span style='font-weight:bold'> Date début: </span> ".$dateDebut."</li>
            <li><span style='font-weight:bold'> Date fin: </span> ".$dateFin."</li>
            <li><span style='font-weight:bold'> Priorité: </span> ".$priorité."</li>
            </ul><br>
            A très vite sur Our Team Collab.<br>   <a  href='http://localhost:3000' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Accéder à votre compte</a><br><br>Cordialement.");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}