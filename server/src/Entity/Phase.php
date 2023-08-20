<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PhaseRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PhaseRepository::class)]
#[ApiResource]
class Phase
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\ManyToOne(targetEntity:"App\Entity\Projet", cascade:["remove"])]
    #[ORM\JoinColumn(nullable: false,name:"projet_id", referencedColumnName:"id", onDelete:"CASCADE")]
    private ?Projet $projet = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): self
    {
        $this->titre = $titre;

        return $this;
    }

    public function getProjet(): ?Projet
    {
        return $this->projet;
    }

    public function setProjet(?Projet $projet): self
    {
        $this->projet = $projet;

        return $this;
    }
}
