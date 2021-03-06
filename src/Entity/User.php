<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity(fields={"email"}, message="Ya existe un usuario con ese email")
 */
class User implements UserInterface, \Serializable, \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Assert\Email(message="Este email no es válido")
     * @Assert\NotBlank(message="Email requerido")

     */
    private $email;

    /**
     * @ORM\Column(type="json")
     *
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="Contraseña requerida")
     * @Assert\Length(min="6",minMessage="La contraseña debe tener al menos 6 carácteres")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank(message="Nombre requerido")
     * @Assert\Regex(
     *     pattern="/^[a-zA-Z ]*$/",
     *     message="El nombre solo debería contener letras"
     * )
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=75, nullable=true)
     */
    private $surname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $address;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $postal_code;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $town;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $credit_card;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @var File|null
     * @Assert\File(uploadErrorMessage="Error al subir la imagen",
     *     mimeTypesMessage="Tipo de archivo no válido",
     *     mimeTypes={"image/png","image/jpeg","image/jpg"})
     */
    private $profileFile;

    /**
     * @ORM\Column(type="string", nullable=true)
     *
     * @var string|null
     */
    private $profileImage;

    /**
     * @ORM\Column(type="integer", nullable=true)
     *
     *
     * @var int|null
     */
    private $profileSize;

    /**
     * @var File|null
     * @Assert\File(uploadErrorMessage="Error al subir la imagen",
     *     mimeTypesMessage="Tipo de archivo no válido",
     *     mimeTypes={"image/png","image/jpeg","image/jpg"})
     */
    private $headerFile;

    /**
     * @ORM\Column(type="string", nullable=true)
     *
     * @var string|null
     */
    private $headerImage;

    /**
     * @ORM\Column(type="integer", nullable=true)
     *
     * @var int|null
     */
    private $headerSize;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="user")
     */
    private $comments;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Purchase", mappedBy="user")
     */
    private $purchases;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
        $this->purchases = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
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

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(string $surname): self
    {
        $this->surname = $surname;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getPostalCode(): ?int
    {
        return $this->postal_code;
    }

    public function setPostalCode(?int $postal_code): self
    {
        $this->postal_code = $postal_code;

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

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getCreditCard(): ?string
    {
        return $this->credit_card;
    }

    public function setCreditCard(?string $credit_card): self
    {
        $this->credit_card = $credit_card;

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
            $comment->setUser($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getUser() === $this) {
                $comment->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Purchase[]
     */
    public function getPurchases(): Collection
    {
        return $this->purchases;
    }

    public function addPurchase(Purchase $purchase): self
    {
        if (!$this->purchases->contains($purchase)) {
            $this->purchases[] = $purchase;
            $purchase->setUser($this);
        }

        return $this;
    }

    public function removePurchase(Purchase $purchase): self
    {
        if ($this->purchases->contains($purchase)) {
            $this->purchases->removeElement($purchase);
            // set the owning side to null (unless already changed)
            if ($purchase->getUser() === $this) {
                $purchase->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @param File|UploadedFile|null $profileFile
     * @throws \Exception
     */
    public function setProfileFile(?File $profileFile = null): void
    {
        $this->profileFile = $profileFile;

        if (null !== $profileFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updated_at = new \DateTimeImmutable();
        }
    }

    public function getProfileFile(): ?File
    {
        return $this->profileFile;
    }

    public function setProfileImage(?string $profileImage): void
    {
        $this->profileImage = $profileImage;
    }

    public function getProfileImage(): ?string
    {
        return $this->profileImage;
    }

    public function setProfileSize(?int $profileSize): void
    {
        $this->profileSize = $profileSize;
    }

    public function getProfileSize(): ?int
    {
        return $this->profileSize;
    }

    /**
     * @param File|UploadedFile|null $headerFile
     * @throws \Exception
     */
    public function setHeaderFile(?File $headerFile = null): void
    {
        $this->headerFile = $headerFile;

        if (null !== $headerFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updated_at = new \DateTimeImmutable();
        }
    }

    public function getHeaderFile(): ?File
    {
        return $this->headerFile;
    }

    public function setHeaderImage(?string $headerImage): void
    {
        $this->headerImage = $headerImage;
    }

    public function getHeaderImage(): ?string
    {
        return $this->headerImage;
    }

    public function setHeaderSize(?int $headerSize): void
    {
        $this->headerSize = $headerSize;
    }

    public function getHeaderSize(): ?int
    {
        return $this->headerSize;
    }

    /**
     * @inheritDoc
     */
    public function serialize()
    {
        // add $this->salt too if you don't use Bcrypt or Argon2i
        return serialize([$this->id, $this->email, $this->password, $this->roles]);
    }

    /**
     * @inheritDoc
     */
    public function unserialize($serialized)
    {
        // add $this->salt too if you don't use Bcrypt or Argon2i
        [$this->id, $this->email, $this->password, $this->roles] = unserialize($serialized, ['allowed_classes' => false]);
    }

    public function __toString()
    {
        return (string) $this->getEmail();
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'entity'=>'user',
            'id'=>$this->getId(),
            'name'=>$this->getName(),
            'surname'=>$this->getSurname(),
            'email'=>$this->getEmail(),
            'password'=>$this->getPassword(),
            'role'=>$this->getRoles(),
            'address'=>$this->getAddress(),
            'postal_code'=>$this->getPostalCode(),
            'town'=>$this->getTown(),
            'city'=>$this->getCity(),
            'phone'=>$this->getPhone(),
            'credit_card'=>$this->getCreditCard(),
            'profile_image'=>"/img/users/profile/".$this->getProfileImage(),
            'header_image'=>"/img/users/header/".$this->getHeaderImage(),
            'comments'=>$this->getComments(),
            'purchases'=>$this->getPurchases(),
            'created_at'=>$this->getCreatedAt(),
            'updated_at'=>$this->getUpdatedAt()
        ];
    }
}
