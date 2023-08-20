<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ParticipationReunionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ParticipationReunionRepository::class)]
#[ApiResource]
class ParticipationReunion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 1255, nullable: true)]
    private ?string $note = null;

    #[ORM\Column(nullable: true)]
    private ?bool $presence = null;

    #[ORM\ManyToOne(targetEntity:"App\Entity\Reunion", cascade:["remove"])]
    #[ORM\JoinColumn(nullable: false,name:"reunion_id", referencedColumnName:"id", onDelete:"CASCADE")]
    private ?Reunion $reunion = null;

    #[ORM\ManyToOne(targetEntity:"App\Entity\DroitAcces", cascade:["remove"])]
    #[ORM\JoinColumn(nullable: false,name:"user_id", referencedColumnName:"id", onDelete:"CASCADE")]
    private ?DroitAcces $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(?string $note): self
    {
        $this->note = $note;

        return $this;
    }

    public function isPresence(): ?bool
    {
        return $this->presence;
    }

    public function setPresence(?bool $presence): self
    {
        $this->presence = $presence;

        return $this;
    }

    public function getReunion(): ?Reunion
    {
        return $this->reunion;
    }

    public function setReunion(?Reunion $reunion): self
    {
        $this->reunion = $reunion;

        return $this;
    }

    public function getUser(): ?DroitAcces
    {
        return $this->user;
    }

    public function setUser(?DroitAcces $user): self
    {
        $this->user = $user;

        return $this;
    }
}
