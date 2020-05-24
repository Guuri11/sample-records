<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass="App\Repository\PurchaseRepository")
 */
class Purchase implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Assert\NotBlank(message="Nombre requerido")
     * @Assert\Regex(
     *     pattern="/^[a-zA-Z0-9_-]*$/",
     *     message="El numero de serie solo pueden tener letras y números"
     * )
     */
    private $serial_number;

    /**
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @ORM\Column(type="dateinterval", nullable=true)
     */
    private $time;

    /**
     * @ORM\Column(type="boolean")
     */
    private $received;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Dirección del pedido requerido")
     * @Assert\Length(min="0",max="255",minMessage="Dirección del pedido requerido", maxMessage="Máxim 255 carácteres")
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(max="255", maxMessage="Máxim 255 carácteres")
     */
    private $town;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(max="255", maxMessage="Máxim 255 carácteres")
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Dirección del pedido requerido")
     * @Assert\Length(max="255", maxMessage="Máxim 255 carácteres")
     */
    private $country;

    /**
     * @ORM\Column(type="float")
     * @Assert\NotBlank(message="Precio requerido")
     * @Assert\Type(
     *     type="float",
     *     message="El precio debe de ser un número"
     * )
     * @Assert\PositiveOrZero(message="El precio debe de ser mayor/igual de 0")
     */
    private $final_price;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="purchases")
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Ticket", inversedBy="purchases")
     */
    private $ticket;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Product", inversedBy="purchases")
     */
    private $product;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Comment", inversedBy="purchase", cascade={"persist", "remove"})
     * @ORM\Column(nullable=true)
     */
    private $comment;

    public function __construct()
    {
        $this->ticket = new ArrayCollection();
        $this->product = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSerialNumber(): ?string
    {
        return $this->serial_number;
    }

    public function setSerialNumber(string $serial_number): self
    {
        $this->serial_number = $serial_number;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getTime(): ?\DateInterval
    {
        return $this->time;
    }

    public function setTime(?\DateInterval $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getReceived(): ?bool
    {
        return $this->received;
    }

    public function setReceived(bool $received): self
    {
        $this->received = $received;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getTown(): ?string
    {
        return $this->town;
    }

    public function setTown(?string $town): self
    {
        $this->town = $town;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getFinalPrice(): ?float
    {
        return $this->final_price;
    }

    public function setFinalPrice(float $final_price): self
    {
        $this->final_price = $final_price;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeInterface $updated_at): self
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection|Ticket[]
     */
    public function getTicket(): Collection
    {
        return $this->ticket;
    }

    public function addTicket(Ticket $ticket): self
    {
        if (!$this->ticket->contains($ticket)) {
            $this->ticket[] = $ticket;
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): self
    {
        if ($this->ticket->contains($ticket)) {
            $this->ticket->removeElement($ticket);
        }

        return $this;
    }

    /**
     * @return Collection|Product[]
     */
    public function getProduct(): Collection
    {
        return $this->product;
    }

    public function addProduct(Product $product): self
    {
        if (!$this->product->contains($product)) {
            $this->product[] = $product;
        }

        return $this;
    }

    public function removeProduct(Product $product): self
    {
        if ($this->product->contains($product)) {
            $this->product->removeElement($product);
        }

        return $this;
    }

    public function jsonSerialize()
    {
        return [
            'entity'=>'purchase',
            'id'=>$this->getId(),
            'serial_number'=>$this->getSerialNumber(),
            'date'=>$this->getDate(),
            'time'=>$this->getTime(),
            'received'=>$this->getReceived(),
            'address'=>$this->getAddress(),
            'town'=>$this->getTown(),
            'city'=>$this->getCity(),
            'country'=>$this->getCountry(),
            'comment'=>$this->getComment(),
            'final_price'=>$this->getFinalPrice(),
            'user'=>[
                "id"=> $this->getUser() !== null ? $this->getUser()->getId():'',
                "name"=>$this->getUser() !== null ? $this->getUser()->getName():'Anónimo',
                "email"=>$this->getUser() !== null ? $this->getUser()->getEmail():'',
            ],
            'ticket'=>$this->getTicket()->first(),
            'product'=>$this->getProduct()->first(),
            'created_at'=>$this->getCreatedAt(),
            'updated_at'=>$this->getUpdatedAt()
        ];
    }

    public function getComment(): ?string 
    {
        return $this->comment;
    }

    public function setComment(?Comment $comment): self
    {
        $this->comment = $comment;

        return $this;
    }
}