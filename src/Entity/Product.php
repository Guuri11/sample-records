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
 * @ORM\Entity(repositoryClass="App\Repository\ProductRepository")
 * @Vich\Uploadable
 */
class Product implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Nombre requerido")
     */
    private $name;

    /**
     * @ORM\Column(type="float")
     * @Assert\NotBlank(message="Precio requerido")
     * @Assert\Type(
     *     type="float",
     *     message="El precio debe de ser un número"
     * )
     * @Assert\PositiveOrZero(message="El precio debe de ser mayor de 0")
     */
    private $price;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Assert\Type(
     *     type="float",
     *     message="El precio debe de ser un número"
     * )
     * @Assert\PositiveOrZero(message="El descuento no puede ser negativo")
     */
    private $discount;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $size;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message="Nombre requerido")
     * @Assert\Regex(
     *     pattern="/^[0-9 ]*$/",
     *     message="El stock debe de ser un número"
     * )
     * @Assert\PositiveOrZero(message="El stock debe ser mayor/igual de 0")
     */
    private $stock;

    /**
     * @ORM\Column(type="boolean")
     */
    private $avaiable;

    /**
     * @ORM\Column(type="string", length=800)
     * @Assert\NotBlank(message="Descripción requerida")
     * @Assert\Length(min="0",minMessage="La descripción no puede estar vacia",
     *     max="800", maxMessage="El límite de carácteres es 800")
     */
    private $description;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Category", inversedBy="products")
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Artist", inversedBy="products")
     *
     */
    private $artist;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="product")
     */
    private $comments;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Purchase", mappedBy="product")
     */
    private $purchases;

    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="products", fileNameProperty="imageName", size="imageSize")
     *
     * @var File|null
     * @Assert\File(uploadErrorMessage="Error al subir la imagen",
     *     mimeTypesMessage="Tipo de archivo no válido",
     *     mimeTypes={"image/png","image/jpeg","image/jpg"})
     */
    private $imageFile;

    /**
     * @ORM\Column(type="string")
     *
     * @var string|null
     */
    private $imageName;

    /**
     * @ORM\Column(type="integer")
     *
     * @var int|null
     */
    private $imageSize;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
        $this->purchases = new ArrayCollection();
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

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getDiscount(): ?float
    {
        return $this->discount;
    }

    public function setDiscount(?float $discount): self
    {
        $this->discount = $discount;

        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(?string $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): self
    {
        $this->stock = $stock;

        return $this;
    }

    public function getAvaiable(): ?bool
    {
        return $this->avaiable;
    }

    public function setAvaiable(bool $avaiable): self
    {
        $this->avaiable = $avaiable;

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

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

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
            $comment->setProduct($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getProduct() === $this) {
                $comment->setProduct(null);
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
            $purchase->addProduct($this);
        }

        return $this;
    }

    public function removePurchase(Purchase $purchase): self
    {
        if ($this->purchases->contains($purchase)) {
            $this->purchases->removeElement($purchase);
            $purchase->removeProduct($this);
        }

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
            'category'=>$this->getCategory(),
            'artist'=>$this->getArtist(),
            'price'=>$this->getPrice(),
            'discount'=>$this->getDiscount(),
            'size'=>$this->getSize(),
            'stock'=>$this->getStock(),
            'avaiable'=>$this->getAvaiable(),
            'description'=>$this->getDescription(),
            'comment'=>$this->getComments(),
            'purchases'=>$this->getPurchases(),
            'img_name'=>"/img/products/".$this->getImageName(),
            'img_size'=>$this->getImageSize(),
            'created_at'=>$this->getCreatedAt(),
            'updated_at'=>$this->getUpdatedAt()
        ];
    }
}
