<?php

namespace App\Repository;

use App\Entity\Tag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Tag|null find($id, $lockMode = null, $lockVersion = null)
 * @method Tag|null findOneBy(array $criteria, array $orderBy = null)
 * @method Tag[]    findAll()
 * @method Tag[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tag::class);
    }

    /**
     * @param $params
     * @return QueryBuilder
     * API request result
     */
    public function getRequestResult($params)
    {
        $result = $this->createQueryBuilder('t');
        if (key_exists("search",$params)) {
            $result->where('t.tag LIKE :search')
                ->setParameter('search', '%'.$params['search'].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('t.id >= :id')
                ->setParameter('id',$params['first']);
        }
        if (key_exists("last",$params)) {
            $result->setMaxResults($params['last']);
        }
        if (key_exists("ord",$params)) {
            $result->orderBy('t.id', $params['ord']);
        }
        if (count($result->getQuery()->getResult()) > 0 )
            return $result->getQuery()->getResult();
        else
            throw new \Exception("No se ha encontrado ningún resultado");
    }

}
