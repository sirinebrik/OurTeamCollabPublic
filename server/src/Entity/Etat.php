<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EtatRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EtatRepository::class)]
#[ApiResource]
class Etat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\ManyToOne(targetEntity:"App\Entity\Phase", cascade:["remove"])]
    #[ORM\JoinColumn(nullable: false,name:"phase_id", referencedColumnName:"id", onDelete:"CASCADE")]
    private ?Phase $phase = null;

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

    public function getPhase(): ?Phase
    {
        return $this->phase;
    }

    public function setPhase(?Phase $phase): self
    {
        $this->phase = $phase;

        return $this;
    }
}
