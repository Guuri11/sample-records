<?php


namespace App\Utils;


use App\Repository\PurchaseRepository;

class SerialNumber
{
    private $serial_number = '';

    /**
     * @return string
     */
    public function GenerateSerialNumber() {
        $chars = array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
        $max = count($chars)-1;
        for($i=0;$i<20;$i++){
            $this->serial_number .= (!($i % 5) && $i ? '-' : '').$chars[rand(0, $max)];
        }
        return $this->serial_number;
    }

    /**
     * @param PurchaseRepository $repository
     * @return bool
     */
    public function checkSerialNumber(PurchaseRepository $repository):bool {
        $existSerialNumber = $repository->findOneBy(['serial_number'=>$this->serial_number]);
        return $existSerialNumber !== null;
    }

    /**
     * @return string
     */
    public function getSerialNumber(): string
    {
        return $this->serial_number;
    }

    /**
     * @param string $serial_number
     */
    public function setSerialNumber(string $serial_number): void
    {
        $this->serial_number = $serial_number;
    }



}