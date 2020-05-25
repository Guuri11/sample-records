<?php

namespace App\Repository;

use App\Entity\Purchase;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Exception;

/**
 * @method Purchase|null find($id, $lockMode = null, $lockVersion = null)
 * @method Purchase|null findOneBy(array $criteria, array $orderBy = null)
 * @method Purchase[]    findAll()
 * @method Purchase[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PurchaseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Purchase::class);
    }

    /**
     * @param $params
     * @return QueryBuilder
     * API request result
     * @throws Exception
     */
    public function getRequestResult($params)
    {
        $result = $this->createQueryBuilder('p');
        if (key_exists("search",$params)) {
            $result->where('p.serial_number LIKE :search')
                ->setParameter("search", '%'.$params["search"].'%');
        }
        if (key_exists("first",$params)) {
            $result->andWhere('p.id >= :id')
                ->setParameter('id',$params["first"]);
        }
        if (key_exists("user",$params)) {
            $result->andWhere('p.user = :user')
                ->setParameter('user',$params["user"]);
        }
        if (key_exists("last",$params)) {
            $result->setMaxResults($params["last"]);
        }
        if (key_exists("ord",$params)) {
            $result->orderBy('p.id', $params["ord"]);
        }
        if (count($result->getQuery()->getResult()) > 0 )
            return $result->getQuery()->getResult();
        else
            throw new Exception("No se ha encontrado ningún resultado");
    }

    public function getMonthlyEarns () {
        $result = $this->createQueryBuilder('p');
        // Sum all the purchases' prices
        $result->select('SUM(p.final_price) as earns');

        // Filter by first and last of month
        $result->where('p.created_at >= :first_of_month')
            ->setParameter('first_of_month', date('Y-m-01'));
        $result->andWhere('p.created_at <= :last_of_month')
            ->setParameter('last_of_month', date('Y-m-t'));
        if (count($result->getQuery()->getResult()) > 0 )
            return $result->getQuery()->getResult();
        else
            throw new Exception("No se ha encontrado ningún resultado");
    }

}
