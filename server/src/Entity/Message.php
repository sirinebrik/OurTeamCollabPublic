<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
#[ApiResource]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 1000)]
    private ?string $contenu = null;

    #[ORM\Column(length: 255)]
    private ?string $dateEnvoi = null;

    #[ORM\Column(length: 255)]
    private ?string $heureEnvoi = null;

    #[ORM\Column]
    private ?bool $messageLu = null;

    #[ORM\ManyToOne(targetEntity:"App\Entity\User", cascade:["remove"])]
    #[ORM\JoinColumn(nullable: false,name:"fromUser_id", referencedColumnName:"id", onDelete:"CASCADE")]
    private ?User $fromUser = null;

    #[ORM\ManyToOne(targetEntity:"App\Entity\User", cascade:["remove"])]
    #[ORM\JoinColumn(nullable: false,name:"toUser_id", referencedColumnName:"id", onDelete:"CASCADE")]
    private ?User $toUser = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): static
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function getDateEnvoi(): ?string
    {
        return $this->dateEnvoi;
    }

    public function setDateEnvoi(string $dateEnvoi): static
    {
        $this->dateEnvoi = $dateEnvoi;

        return $this;
    }

    public function getHeureEnvoi(): ?string
    {
        return $this->heureEnvoi;
    }

    public function setHeureEnvoi(string $heureEnvoi): static
    {
        $this->heureEnvoi = $heureEnvoi;

        return $this;
    }

    public function isMessageLu(): ?bool
    {
        return $this->messageLu;
    }

    public function setMessageLu(bool $messageLu): static
    {
        $this->messageLu = $messageLu;

        return $this;
    }

    public function getFromUser(): ?User
    {
        return $this->fromUser;
    }

    public function setFromUser(?User $fromUser): static
    {
        $this->fromUser = $fromUser;

        return $this;
    }

    public function getToUser(): ?User
    {
        return $this->toUser;
    }

    public function setToUser(?User $toUser): static
    {
        $this->toUser = $toUser;

        return $this;
    }
}
