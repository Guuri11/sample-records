<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * @param $params
     * @return \Doctrine\ORM\QueryBuilder
     * API request result
     */
    public function getRequestResult($params)
    {
        $result = $this->createQueryBuilder('p');
        if (key_exists("search",$params)) {
            $result->where('p.name LIKE :search')
                ->setParameter('search', '%'.$params['search'].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('p.id >= :id_product')
                ->setParameter('id_product',$params['first']);
        }
        if (key_exists("artist",$params)) {
            $result->andWhere('p.artist = :id_artist')
                ->setParameter('id_artist',$params['artist']);
        }
        if (key_exists("category",$params)) {
            $result->andWhere('p.category = :id_category')
                ->setParameter('id_category',$params['artist']);
        }
        if (key_exists("available",$params)) {
            $result->andWhere('p.avaiable = :available')
                ->setParameter('available',$params['available']);
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
     * @param $data
     * @return int|mixed|string|null
     */
    public function getSearchRequest($data)
    {
        $result = $this->createQueryBuilder('p');
        if ($data['search']) {
            $result->where('p.name LIKE :search')
                ->setParameter('search', '%'.$data['search'].'%');
        }
        if ($data['available'] !== null) {
            $result->andWhere('p.avaiable = :available')
                ->setParameter('available',$data['available']);
        }
        if ($result->getQuery()->getResult())
            return $result->getQuery()->getResult();
        else
            return null;
    }
}
