<?php

namespace App\Service;

use PhpParser\Node\Expr\Array_;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;


/**
 * Class CustomFileUploader
 * @package App\Service
 */
class CustomFileUploader
{
    /**
     * DIRECTORIES NAMES
     */
    const ALBUM = "/public/img/albums/";
    /**
     *
     */
    const ARTIST = "/public/img/artists/";
    /**
     *
     */
    const EVENT = "/public/img/events/";
    /**
     *
     */
    const POST = "/public/img/posts/";
    /**
     *
     */
    const PRODUCT = "/public/img/products/";
    /**
     *
     */
    const IMG_SONG = "/public/img/songs/";
    /**
     *
     */
    const USER_HEADER = "/public/img/users/header/";
    /**
     *
     */
    const USER_PROFILE = "/public/img/users/profile/";
    /**
     *
     */
    const SONG = "/public/songs/";

    /**
     * AVAIABLE EXTENSIONS
     */
    private const PNG = "png";
    /**
     *
     */
    private const JPG = "jpg";
    /**
     *
     */
    private const JPEG = "jpeg";
    /**
     *
     */
    private const MP3 = "mp3";


    /**
     * @var string
     */
    private $file_name;

    /**
     * @var mixed
     */
    private $root_directory;
    /**
     * @var SluggerInterface
     */
    private $slugger;

    /**
     * CustomFileUploader constructor.
     * @param SluggerInterface $slugger
     * @param ParameterBagInterface $bag
     */
    public function __construct(SluggerInterface $slugger, ParameterBagInterface $bag)
    {
        $this->root_directory = $bag->get('kernel.project_dir');
        $this->slugger = $slugger;
    }

    /**
     * @param $song
     * @param $directory
     * @return bool|string[]
     */
    public function uploadSong($song, $directory, $old_song = null)
    {
        // Prepare the full file path
        $directory = $this->root_directory.$directory;
        $file_name = pathinfo($song['name'], PATHINFO_FILENAME);
        $extension = strtolower(pathinfo($song['name'],PATHINFO_EXTENSION));
        $file_name = $file_name.'-'.uniqid().'.'.$extension;
        $song_route = $directory.basename($file_name);

        // this property will be used at the controller, where is called this function
        $this->setFileName($file_name);

        if ($this->validateAudioExtension($extension)){
            if (move_uploaded_file($song['tmp_name'],$song_route)){
                // delete old song unless is the default one
                if ($old_song !== "song-default.mp3")
                    unlink($directory.basename($old_song));
                return [];
            }
            else
                return ["cant_upload"=>"No se pudo subir la canción"];
        } else {
            return ["extension"=>"La extension del fichero no es valida, tiene que ser mp3"];
        }
    }

    /**
     * @param $img
     * @param $old_profile_img
     * @param $directory
     * @return bool|string[]
     */
    public function uploadImage($img, $directory, $old_img= null)
    {

        // Prepare the full file path
        $directory = $this->root_directory.$directory;
        $file_name = pathinfo($img['name'], PATHINFO_FILENAME);
        $extension = strtolower(pathinfo($img['name'],PATHINFO_EXTENSION));
        // create a unique name
        $file_name = $file_name.'-'.uniqid().'.'.$extension;
        $img_route = $directory.basename($file_name);

        // this property will be used at the controller, where is called this function
        $this->setFileName($file_name);


        if ($this->validateImgExtension($extension)){
            // Upload image
            $uploaded = move_uploaded_file($img['tmp_name'],$img_route);
            if ($uploaded){
                // delete old image unless is the default one
                if ($old_img !== null && $old_img !== "user-default.png" && $old_img !== "default-album.png"
                && $old_img !== "artist-default.png" && $old_img !== "default-event.png"
                    && $old_img !== "product-default.png" && $old_img !== "song-default.png" && $old_img !== "header-default.jpg"
                    && $old_img !== "post-default.png")

                    unlink($directory.basename($old_img));
                return [];
            }
            else
                return ["cant_upload"=>"No se pudo subir la foto"];
        } else {
            return ["extension"=>"La extension del fichero no es valida, tiene que ser JPG, PNG o JPEG"];
        }
    }

    /**
     * @param string $extension
     * @return bool
     */
    public function validateImgExtension(string $extension) : bool {
        return $extension === self::JPG || $extension === self::PNG || $extension === self::JPEG;
    }

    /**
     * @param string $extension
     * @return bool
     */
    public function validateAudioExtension(string $extension) : bool {
        return $extension === self::MP3;
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

}