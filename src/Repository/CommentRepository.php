<?php

namespace App\Repository;

use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Comment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Comment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Comment[]    findAll()
 * @method Comment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    /**
     * @param $params
     * @return \Doctrine\ORM\QueryBuilder
     * API request result
     */
    public function getRequestResult($params)
    {
        $result = $this->createQueryBuilder('c');
        if (key_exists("search",$params)) {
            $result->where('c.comment LIKE :search')
                ->setParameter('search', '%'.$params['search'].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('c.id >= :id_comment')
                ->setParameter('id_comment',$params['first']);
        }
        if (key_exists("post",$params)) {
            $result->andWhere('c.post = :id_post')
                ->setParameter('id_post',$params['post']);
        }
        if (key_exists("product",$params)) {
            $result->andWhere('c.product = :id_product')
                ->setParameter('id_product',$params['product']);
        }
        if (key_exists("purchase",$params)) {
            $result->andWhere('c.purchase = :id_purchase')
                ->setParameter('id_purchase',$params['purchase']);
        }
        if (key_exists("event",$params)) {
            $result->andWhere('c.event = :id_event')
                ->setParameter('id_event',$params['event']);
        }
        if (key_exists("last",$params)) {
            $result->setMaxResults($params['last']);
        }
        if (key_exists("ord",$params)) {
            $result->orderBy('c.id', $params['ord']);
        }
        if (count($result->getQuery()->getResult()) > 0 )
            return $result->getQuery()->getResult();
        else
            throw new \Exception("No se ha encontrado ningún resultado");
    }
}
