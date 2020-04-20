<?php

namespace App\Repository;

use App\Entity\Event;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Event|null find($id, $lockMode = null, $lockVersion = null)
 * @method Event|null findOneBy(array $criteria, array $orderBy = null)
 * @method Event[]    findAll()
 * @method Event[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }

    /**
     * @param $params
     * @return \Doctrine\ORM\QueryBuilder
     * API request result
     */
    public function getRequestResult($params)
    {
        $result = $this->createQueryBuilder('e');
        if (key_exists("search",$params)) {
            $result->where('e.name LIKE :search')
                ->setParameter('search', '%'.$params['search'].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('e.id >= :id_event')
                ->setParameter('id_event',$params['first']);
        }
        if (key_exists("artist",$params)) {
            $result->andWhere('e.artist = :id_artist')
                ->setParameter('id_artist',$params['artist']);
        }
        if (key_exists("until",$params)) {
            $result->andWhere('e.date >= :date')
                ->setParameter('date',$params['until']);
        }
        if (key_exists("last",$params)) {
            $result->setMaxResults($params['last']);
        }
        if (key_exists("ord",$params)) {
            $result->orderBy('e.id', $params['ord']);
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
        $result = $this->createQueryBuilder('e');
        if ($search) {
            $result->where('e.name LIKE :search')
                ->setParameter('search', '%'.$search.'%');
        }
        if ($result->getQuery()->getResult())
            return $result->getQuery()->getResult();
        else
            return null;
    }

}
