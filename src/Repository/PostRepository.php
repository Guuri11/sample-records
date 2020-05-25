<?php

namespace App\Repository;

use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    /**
     * @param $params
     * @return \Doctrine\ORM\QueryBuilder
     * API request result
     */
    public function getRequestResult($params)
    {
        $result = $this->createQueryBuilder('p')->leftJoin('p.tag','t');
        if (key_exists("search",$params)) {
            $result->where('p.title LIKE :search')
                ->setParameter('search', '%'.$params['search'].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('p.id >= :id_post')
                ->setParameter('id_post',$params['first']);
        }
        if (key_exists("artist",$params)) {
            $result->andWhere('p.artist = :id_artist')
                ->setParameter('id_artist',$params['artist']);
        }
        if (key_exists("tag",$params)) {
            $result->andWhere('t.id = :id_tag')
                ->setParameter('id_tag',$params['tag']);
        }
        if (key_exists("last",$params)) {
            $result->setMaxResults($params['last']);
        }
        if (key_exists("ord",$params)) {
            $result->orderBy('p.id', $params['ord']);
        }
        if (count($result->getQuery()->getResult()) > 0 )
            return $result->getQuery()->getResult();
        else
            throw new \Exception("No se ha encontrado ningún resultado");
    }

    /**
     * @param $search
     * @throws \Exception
     */
    public function getSearchRequest($search)
    {
        $result = $this->createQueryBuilder('p');
        if ($search) {
            $result->where('p.title LIKE :search')
                ->setParameter('search', '%'.$search.'%');
        }
        if ($result->getQuery()->getResult())
            return $result->getQuery()->getResult();
        else
            return null;
    }
}
