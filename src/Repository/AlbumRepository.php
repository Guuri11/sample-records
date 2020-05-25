<?php

namespace App\Repository;

use App\Entity\Album;
use App\Service\ApiSampleRecordsException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Album|null find($id, $lockMode = null, $lockVersion = null)
 * @method Album|null findOneBy(array $criteria, array $orderBy = null)
 * @method Album[]    findAll()
 * @method Album[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AlbumRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Album::class);
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
                ->setParameter('search', '%'.$params['search'].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('a.id >= :id')
                ->setParameter('id',$params['first']);
        }
        if (key_exists("artist",$params)) {
            $result->andWhere('a.artist = :id_artist')
                ->setParameter('id_artist',$params['artist']);
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


}
