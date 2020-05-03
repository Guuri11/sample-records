<?php

namespace App\Repository;

use App\Entity\Artist;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Artist|null find($id, $lockMode = null, $lockVersion = null)
 * @method Artist|null findOneBy(array $criteria, array $orderBy = null)
 * @method Artist[]    findAll()
 * @method Artist[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArtistRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Artist::class);
    }

    /**
     * @param $params
     * @return \Doctrine\ORM\QueryBuilder
     * API request result
     */
    public function getRequestResult($params)
    {
        $result = $this->createQueryBuilder('a');
        if (key_exists("search",$params)) {
            $result->where('a.name LIKE :search')
                ->orWhere('a.alias LIKE :search')
                ->orWhere('a.surname LIKE :search')
                ->setParameter('search', '%'.$params['search'].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('a.id >= :id')
                ->setParameter('id',$params['first']);
        }
        if (key_exists("last",$params)) {
            $result->setMaxResults($params['last']);
        }
        if (key_exists("ord",$params)) {
            $result->orderBy('a.id', $params['ord']);
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
        $result = $this->createQueryBuilder('a');
        if ($search) {
            $result->where('a.name LIKE :search')
                ->orWhere('a.alias LIKE :search')
                ->orWhere('a.surname LIKE :search')
                ->setParameter('search', '%'.$search.'%');
        }
        if ($result->getQuery()->getResult())
            return $result->getQuery()->getResult();
        else
            return null;
    }
}
