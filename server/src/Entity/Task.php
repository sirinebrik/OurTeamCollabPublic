<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TaskRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
#[ApiResource]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

   
    #[ORM\Column(length: 255)]
    private ?string $tauxAvancement = null;
    #[ORM\Column(length: 255)]
    private ?string $dateDebut = null;

    #[ORM\Column(length: 255)]
    private ?string $dateFin = null;

    #[ORM\ManyToOne(targetEntity:"App\Entity\Etat", cascade:["remove"])]
    #[ORM\JoinColumn(nullable: false,name:"etat_id", referencedColumnName:"id", onDelete:"CASCADE")]
    private ?Etat $etat = null;

    #[ORM\ManyToOne(targetEntity:"App\Entity\DroitAcces", cascade:["remove"])]
    #[ORM\JoinColumn(nullable: true,name:"user_id", referencedColumnName:"id", onDelete:"CASCADE")]
    private ?DroitAcces $user = null;

    #[ORM\Column]
    private ?int $rang = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $raisonRefus = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $problemeBlocage = null;

    #[ORM\Column(nullable: true)]
    private ?bool $valide = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $priorite = null;

   

  

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

  

    public function getTauxAvancement(): ?string
    {
        return $this->tauxAvancement;
    }

    public function setTauxAvancement(string $tauxAvancement): self
    {
        $this->tauxAvancement = $tauxAvancement;

        return $this;
    }


    public function getDateDebut(): ?string
    {
        return $this->dateDebut;
    }

    public function setDateDebut(string $dateDebut): self
    {
        $this->dateDebut = $dateDebut;

        return $this;
    }

    public function getDateFin(): ?string
    {
        return $this->dateFin;
    }

    public function setDateFin(string $dateFin): self
    {
        $this->dateFin = $dateFin;

        return $this;
    }

    
    public function getEtat(): ?Etat
    {
        return $this->etat;
    }

    public function setEtat(?Etat $etat): self
    {
        $this->etat = $etat;

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

    public function getRang(): ?int
    {
        return $this->rang;
    }

    public function setRang(int $rang): self
    {
        $this->rang = $rang;

        return $this;
    }

    public function getRaisonRefus(): ?string
    {
        return $this->raisonRefus;
    }

    public function setRaisonRefus(?string $raisonRefus): self
    {
        $this->raisonRefus = $raisonRefus;

        return $this;
    }

    public function getProblemeBlocage(): ?string
    {
        return $this->problemeBlocage;
    }

    public function setProblemeBlocage(?string $problemeBlocage): self
    {
        $this->problemeBlocage = $problemeBlocage;

        return $this;
    }

    public function isValide(): ?bool
    {
        return $this->valide;
    }

    public function setValide(?bool $valide): self
    {
        $this->valide = $valide;

        return $this;
    }

    public function getPriorite(): ?string
    {
        return $this->priorite;
    }

    public function setPriorite(?string $priorite): self
    {
        $this->priorite = $priorite;

        return $this;
    }

    
   
}
