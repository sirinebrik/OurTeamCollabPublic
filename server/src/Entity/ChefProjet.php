<?php

namespace App\Entity;

use App\Repository\ChefProjetRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiRessource;
#[ApiRessource]
#[ORM\Entity(repositoryClass: ChefProjetRepository::class)]
class ChefProjet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;


    #[ORM\ManyToOne(inversedBy: 'chefProjets')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Secteur $secteur = null;

    #[ORM\OneToOne(inversedBy: 'chefProjet', cascade: ['persist', 'remove'])]
    private ?User $utilisateur = null;

    public function getId(): ?int
    {
        return $this->id;
    }
  public function getSecteur(): ?Secteur
    {
        return $this->secteur;
    }

    public function setSecteur(?Secteur $secteur): self
    {
        $this->secteur = $secteur;

        return $this;
    }

    public function getUtilisateur(): ?User
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?User $utilisateur): self
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }
}
