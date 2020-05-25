<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CommentRepository")
 */
class Comment implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=500)
     * @Assert\NotBlank(message="Comentario requerido")
     */
    private $comment;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    private $updated_at;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="comments")
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Event", inversedBy="comments")
     */
    private $event;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Product", inversedBy="comments")
     */
    private $product;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Post", inversedBy="comments")
     */
    private $post;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Purchase", inversedBy="comments")
     */
    private $purchase;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(string $comment): self
    {
        $this->comment = $comment;

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

    public function getEvent(): ?Event
    {
        return $this->event;
    }

    public function setEvent(?Event $event): self
    {
        $this->event = $event;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getPost(): ?Post
    {
        return $this->post;
    }

    public function setPost(?Post $post): self
    {
        $this->post = $post;

        return $this;
    }

    public function getPurchase(): ?Purchase
    {
        return $this->purchase;
    }

    public function setPurchase(?Purchase $purchase): self
    {
        $this->purchase = $purchase;

        return $this;
    }

    public function __toString()
    {
        return $this->getComment();
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        // Maybe the comment is from an anonymous user who buy something
        if ($this->user !== null)
            return [
            'entity'=>'Comment',
            'id'=>$this->getId(),
            'comment'=>$this->getComment(),
            'user'=>[
                "id"=>$this->getUser()->getId(),
                "name"=>$this->getUser()->getName(),
                "surname"=>$this->getUser()->getSurname(),
                "img_profile"=>$this->getUser()->getProfileImage()
            ],
            'event'=>$this->getEvent(),
            'post'=>$this->getPost(),
            'product'=>$this->getProduct(),
                'purchase'=>$this->getPurchase(),
            'created_at'=>$this->getCreatedAt(),
            'updated_at'=>$this->getUpdatedAt()
        ];
        else
            return [
                'entity'=>'comment',
                'id'=>$this->getId(),
                'comment'=>$this->getComment(),
                'event'=>$this->getEvent(),
                'post'=>$this->getPost(),
                'purchase'=>$this->getPurchase(),
                'product'=>$this->getProduct(),
                'created_at'=>$this->getCreatedAt(),
                'updated_at'=>$this->getUpdatedAt()
            ];

    }
}