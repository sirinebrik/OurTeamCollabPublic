<?php

namespace App\Entity;

use App\Repository\SecteurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SecteurRepository::class)]
class Secteur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\OneToMany(mappedBy: 'secteur', targetEntity: ChefProjet::class, orphanRemoval: true)]
    private Collection $chefProjets;

    #[ORM\OneToMany(mappedBy: 'secteur', targetEntity: Client::class, orphanRemoval: true)]
    private Collection $clients;

    public function __construct()
    {
        $this->chefProjets = new ArrayCollection();
        $this->clients = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, ChefProjet>
     */
    public function getChefProjets(): Collection
    {
        return $this->chefProjets;
    }

    public function addChefProjet(ChefProjet $chefProjet): self
    {
        if (!$this->chefProjets->contains($chefProjet)) {
            $this->chefProjets->add($chefProjet);
            $chefProjet->setSecteur($this);
        }

        return $this;
    }

    public function removeChefProjet(ChefProjet $chefProjet): self
    {
        if ($this->chefProjets->removeElement($chefProjet)) {
            // set the owning side to null (unless already changed)
            if ($chefProjet->getSecteur() === $this) {
                $chefProjet->setSecteur(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Client>
     */
    public function getClients(): Collection
    {
        return $this->clients;
    }

    public function addClient(Client $client): self
    {
        if (!$this->clients->contains($client)) {
            $this->clients->add($client);
            $client->setSecteur($this);
        }

        return $this;
    }

    public function removeClient(Client $client): self
    {
        if ($this->clients->removeElement($client)) {
            // set the owning side to null (unless already changed)
            if ($client->getSecteur() === $this) {
                $client->setSecteur(null);
            }
        }

        return $this;
    }
}
