<?php
namespace App\Service;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SendMailServiceChangeChef
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
       $nomCh,
       $sexe,
       $nomAncien
    ) : void
    {
      
        // On crée le mail
        $email = (new Email())
        
            ->from($from)
            ->to($to)
            ->subject($object)
            ->html("Chers membres de l'équipe de projet <span style='font-weight:bold'> ".$nom."</span>,
            <br> <br>J'espère que ce message vous trouve bien.
            <br> Je tiens à vous informer d'un changement important au sein de notre équipe dans notre projet.  
            <br>Nous aurons un nouveau chef de projet qui prendra les rênes de notre projet.
            <br>Après une durée de service dévoué et d'excellent leadership de la part de 
             <span style='font-weight:bold'>". $nomAncien."</span>, nous lui exprimons nos sincères remerciements pour ses contributions précieuses et son dévouement.
            <br>Je suis ravi de vous annoncer que  <span style='font-weight:bold'> ".$nomCh."</span> assumera le rôle de chef de projet. 
            <br>Nous sommes confiants qu'".$sexe." dirigera notre équipe/projet avec succès.
            <br>
            A très vite sur Our Team Collab.<br><br>   <a  href='http://localhost:3000' class='btn ' style={{backgroundColor:'#06868D' , color:'white' ,
                fontSize:'14px'}}>Accéder à votre compte</a><br><br>Cordialement.");
          
          
        // On envoie le mail
        $this->mailer->send($email);
    }
}