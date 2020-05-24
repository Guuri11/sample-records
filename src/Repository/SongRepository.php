<?php

namespace App\Repository;

use App\Entity\Song;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Song|null find($id, $lockMode = null, $lockVersion = null)
 * @method Song|null findOneBy(array $criteria, array $orderBy = null)
 * @method Song[]    findAll()
 * @method Song[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SongRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Song::class);
    }

    /**
     * @param $params
     * @return \Doctrine\ORM\QueryBuilder
     * API request result
     */
    public function getRequestResult($params)
    {
        $result = $this->createQueryBuilder('s');
        if (key_exists("search",$params)) {
            $result->where('s.name LIKE :search')
                ->setParameter('search', '%'.$params["search"].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('s.id >= :id_song')
                ->setParameter('id_song',$params["first"]);
        }

        if (key_exists("artist",$params)) {
            $result->andWhere('s.artist = :id_artist')
                ->setParameter('id_artist',$params["artist"]);
        }
        if (key_exists("album",$params)) {
            $result->andWhere('s.album = :id_album')
                ->setParameter('id_album',$params["album"]);
        }
        if (key_exists("last",$params)) {
            $result->setMaxResults($params["last"]);
        }
        if (key_exists("ord",$params)) {
            $result->orderBy('s.released_at', $params["ord"]);
        }
        if (count($result->getQuery()->getResult()) > 0 )
            return $result->getQuery()->getResult();
        else
            throw new \Exception("No se ha encontrado ningún resultado");
    }
}
