<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass="App\Repository\EventRepository")
 * @Vich\Uploadable
 */
class Event implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Nombre del evento requerido")
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Lugar del evento requerido")
     */
    private $place;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\NotBlank(message="Ciudad del evento requerido")
     * @Assert\Regex(
     *     pattern="/^[a-zA-Z ]*$/",
     *     message="La ciudad solo debería contener letras"
     * )
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="País del evento requerido")
     * @Assert\Regex(
     *     pattern="/^[ña-zA-Z ]*$/",
     *     message="El país solo debería contener letras"
     * )
     */
    private $country;

    /**
     * @ORM\Column(type="date")
     * @Assert\NotNull(message="Fecha del evento requerido")
     * @Assert\NotBlank(message="Fecha del evento requerido")
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Nombre requerido")
     * @Assert\Regex(
     *     pattern="/^[a-zA-Z0-9]*$/",
     *     message="El prefijo de los tickets solo pueden tener letras y números"
     * )
     */
    private $prefix_serial_number;

    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="events", fileNameProperty="imageName", size="imageSize")
     *
     * @var File|null
     * @Assert\File(uploadErrorMessage="Error al subir la imagen",
     *     mimeTypesMessage="Tipo de archivo no válido",
     *     mimeTypes={"image/png","image/jpeg","image/jpg"})
     */
    private $imageFile;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotNull(message="Inserta una imagen para el evento")
     * @var string|null
     */
    private $imageName;

    /**
     * @ORM\Column(type="integer")
     *
     * @var int|null
     */
    private $imageSize;


    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="event")
     */
    private $comments;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Ticket", mappedBy="event")
     */
    private $tickets;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Artist", inversedBy="events")
     * @Assert\NotBlank(message="Selecciona el artista del album")
     */
    private $artist;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $ticket_quantity;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
        $this->tickets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPlace(): ?string
    {
        return $this->place;
    }

    public function setPlace(string $place): self
    {
        $this->place = $place;

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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getPrefixSerialNumber(): ?string
    {
        return $this->prefix_serial_number;
    }

    public function setPrefixSerialNumber(string $prefix_serial_number): self
    {
        $this->prefix_serial_number = $prefix_serial_number;

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

    /**
     * @return Collection|Comment[]
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setEvent($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getEvent() === $this) {
                $comment->setEvent(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Ticket[]
     */
    public function getTickets(): Collection
    {
        return $this->tickets;
    }

    public function addTicket(Ticket $ticket): self
    {
        if (!$this->tickets->contains($ticket)) {
            $this->tickets[] = $ticket;
            $ticket->setEvent($this);
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): self
    {
        if ($this->tickets->contains($ticket)) {
            $this->tickets->removeElement($ticket);
            // set the owning side to null (unless already changed)
            if ($ticket->getEvent() === $this) {
                $ticket->setEvent(null);
            }
        }

        return $this;
    }

    public function getArtist(): ?Artist
    {
        return $this->artist;
    }

    public function setArtist(?Artist $artist): self
    {
        $this->artist = $artist;

        return $this;
    }

    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     * @param File|UploadedFile|null $imageFile
     * @throws \Exception
     */
    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updated_at = new \DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageName(?string $imageName): void
    {
        $this->imageName = $imageName;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageSize(?int $imageSize): void
    {
        $this->imageSize = $imageSize;
    }

    public function getImageSize(): ?int
    {
        return $this->imageSize;
    }

    public function __toString()
    {
        return (string) $this->getName();
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'entity'=>get_class($this),
            'id'=>$this->getId(),
            'name'=>$this->getName(),
            'artist'=>$this->getArtist(),
            'place'=>$this->getPlace(),
            'city'=>$this->getCity(),
            'country'=>$this->getCountry(),
            'date'=>$this->getDate(),
            'prefix_serial_number'=>$this->getPrefixSerialNumber(),
            'comments'=>$this->getComments(),
            'tickets'=>$this->getTickets(),
            'ticket_quantity'=>$this->getTicketQuantity(),
            'img_name'=>"/img/events/".$this->getImageName(),
            'img_size'=>$this->getImageSize(),
            'created_at'=>$this->getCreatedAt(),
            'updated_at'=>$this->getUpdatedAt()

        ];
    }

    public function getTicketQuantity(): ?int
    {
        return $this->ticket_quantity;
    }

    public function setTicketQuantity(?int $ticket_quantity): self
    {
        $this->ticket_quantity = $ticket_quantity;

        return $this;
    }
}
