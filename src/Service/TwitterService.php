<?php

namespace App\Service;


use Abraham\TwitterOAuth\TwitterOAuth;
use Abraham\TwitterOAuth\TwitterOAuthException;

class TwitterService extends TwitterOAuth
{

    private const API_KEY = "";
    private const API_SECRET_KEY = "";
    private const ACCESS_TOKEN = "";
    private const ACCESS_TOKEN_SECRET = "";

    public function __construct()
    {
        parent::__construct(self::API_KEY, self::API_SECRET_KEY, self::ACCESS_TOKEN, self::ACCESS_TOKEN_SECRET);
    }

    /**
     * Post on Twitter
     * @param $text
     * @param string $image
     * @return bool
     */
    public function postItem ($text, $image = "") : bool
    {
        try {
            if ($image !== "") {
                $tw_img = $this->upload('media/upload', ['media' => $image]);
                $params = ['status' => $text, 'media_ids'=>[$tw_img->media_id_string]];
                $this->post('statuses/update', $params);
            } else
                $this->post("statuses/update", ["status" => $text]);

        }catch (TwitterOAuthException $exception){
            return false;
        }

        return $this->getLastHttpCode() === 200;
    }

    /**
     * Get tweets posted by followers talking about the events
     * @return array
     */
    public function getEventTweets ()
    {
        $last_tweets = [];
        $tweets = $this->get("statuses/mentions_timeline");


        foreach ($tweets as $tweet) {
            if (strpos(strtolower($tweet->text), "#srevents") && count($last_tweets)<3) {
                array_push($last_tweets, $tweet->id_str);
            }
        }

        return $last_tweets;
    }
}
