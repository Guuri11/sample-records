<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SongRepository")
 */
class Song implements \JsonSerializable
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
     * @Assert\Regex(
     *     pattern="/^[a-zA-ZÀ-ú0-9 ]*$/",
     *     message="El nombre de la canción solo debería contener letras"
     * )
     */
    private $name;

    /**
     * @ORM\Column(type="integer")
     * @Assert\Type(
     *     type="integer",
     *     message="La duración debe de ser un número"
     * )
     * @Assert\PositiveOrZero(message="La duración debe de ser mayor de 0")
     */
    private $duration;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $video_src;

    /**
     * @ORM\Column(type="string")
     */
    private $songFileName;

    /**
     * @var File|null
     * * @Assert\File(uploadErrorMessage="Error al subir la imagen",
     *     mimeTypesMessage="Tipo de archivo no válido",
     *     mimeTypes={"image/png","image/jpeg","image/jpg"})
     */
    private $imageFile;

    /**
     * @ORM\Column(type="string")
     *
     * @var string|null
     * @Assert\NotNull(message="Inserta una imagen")
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
    private $released_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Artist", inversedBy="songs")
     * @Assert\NotBlank(message="Selecciona el artista del album")
     */
    private $artist;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Album", inversedBy="songs")
     */
    private $album;

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

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getVideoSrc(): ?string
    {
        return $this->video_src;
    }

    public function setVideoSrc(?string $video_src): self
    {
        $this->video_src = $video_src;

        return $this;
    }

    public function getReleasedAt(): ?\DateTimeInterface
    {
        return $this->released_at;
    }

    public function setReleasedAt(\DateTimeInterface $released_at): self
    {
        $this->released_at = $released_at;

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

    public function getArtist(): ?Artist
    {
        return $this->artist;
    }

    public function setArtist(?Artist $artist): self
    {
        $this->artist = $artist;

        return $this;
    }

    public function getAlbum(): ?Album
    {
        return $this->album;
    }

    public function setAlbum(?Album $album): self
    {
        $this->album = $album;

        return $this;
    }

    public function getSongFileName()
    {
        return $this->songFileName;
    }

    public function setSongFileName($songFileName)
    {
        $this->songFileName = $songFileName;

        return $this;
    }

    /**
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

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'entity'=>'song',
            'id'=>$this->getId(),
            'name'=>$this->getName(),
            'artist'=>$this->getArtist(),
            'album'=>$this->getAlbum(),
            'duration'=>$this->getDuration(),
            'video_src'=>$this->getVideoSrc(),
            'song_file'=>$this->getSongFileName(),
            'img_name'=>"/img/songs/".$this->getImageName(),
            'img_size'=>$this->getImageSize(),
            'released_at'=>$this->getReleasedAt(),
            'created_at'=>$this->getCreatedAt(),
            'updated_at'=>$this->getUpdatedAt()
        ];
    }
}
