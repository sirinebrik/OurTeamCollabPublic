<?php

namespace App\DataFixtures;
use Symfony\Component\Validator\Constraints\DateTime;
use App\Entity\Secteur;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $title_secteur=["Architecture","Agriculture, agroalimentaire","Défense, Aéronautique, Nucléaire, Activités sensibles, ...",
        "Audit, Conseil, Expertise","Automobile, Mécanique","Banques, Assurances, Finance",
        "Industrie de la construction, Immobilier","Administration","Commerce, distribution, e-commerce",
        "Comptabilité","Construction aéronautique, ferroviaire et navale",
        "Culture, Audiovisuel, Spectacles, Cinéma","Edition, Journalisme","Électronique, Génie électrique",
        "Énergie","Environnement","Formation, Éducation","Hôtellerie, Restauration, Tourisme",
        "Informatique, Numérique et Réseaux","Ingénierie, Bureaux d'études",
        "Juridique","Logistique, Transport","Luxe, Mode, Habillement, Cosmétique",
        "Entretien","Marketing, Publicité, Communication","Matériaux, transformations",
        "Santé, Pharmaceutique, Chimie, Biotechnologie","Sports, Loisirs",
        "Service social et personnel","Autre"];
        for ($i = 0; $i < count($title_secteur); $i++) {
            $secteur = new Secteur();
            $secteur->setTitre($title_secteur[$i]);
          
            $manager->persist($secteur);
        }
       

        $manager->flush();

       
    }
}
