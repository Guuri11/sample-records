<?php


namespace App\Service;

use DateTimeZone;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

/**
 * Class CustomLog
 * @package App\Service
 */
class CustomLog extends Logger
{
    /**
     * @var string
     */
    private $file_name;
    /**
     * @var
     */
    private $level;

    /**
     * @var string
     */
    protected $name;
    /**
     * CustomLog constructor.
     * @param string $name
     * @param string $file_name
     * @param int $level
     * @param array $handlers
     * @param array $processors
     * @param DateTimeZone|null $timezone
     */
    public function __construct(string $name, string $file_name, $level = self::INFO, array $handlers = [], array $processors = [], ?DateTimeZone $timezone = null)
   {
       $this->name = $name;
       $this->file_name = $file_name;
       parent::__construct($this->name, $handlers, $processors, $timezone);
       $this->pushHandler(new StreamHandler("../var/log/sr/$this->file_name", $level));
   }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getFileName(): string
    {
        return $this->file_name;
    }

    /**
     * @param string $file_name
     */
    public function setFileName(string $file_name): void
    {
        $this->file_name = $file_name;
    }

    /**
     * @return mixed
     */
    public function getLevel()
    {
        return $this->level;
    }

    /**
     * @param mixed $level
     */
    public function setLevel($level): void
    {
        $this->level = $level;
    }
}