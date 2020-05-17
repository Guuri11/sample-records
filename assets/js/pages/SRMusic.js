import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import axios from "axios";
import Slider from "react-slick";
import SongPlayed from "../components/SR-Music/SongPlayed";
import Album from "../components/SR-Music/Album";
import Artist from "../components/SR-Music/Artist";
import {withRouter} from "react-router-dom";

class SRMusic extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        artists: [],
        artist: {},
        songs: [],
        current_song: {},
        albums: [],
        album: {},
        search: "",
        section: "INICIO",
        loading: true
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            // Check if user is loggued
            if (sessionStorage.getItem('auth') === "true") {
                // Get data
                let [artists, songs, albums] = await Promise.all([
                    axios.get(`/api/v1.0/artist`).catch(e => {
                    }),
                    axios.get(`/api/v1.0/song?last=5`).catch(e => {
                    }),
                    axios.get(`/api/v1.0/album?last=3`).catch(e => {
                    })
                ])

                artists = artists.data.results;
                albums = albums.data.results;
                songs = songs.data.results;

                const current_song = songs[0];

                this.setState({
                    artists: artists,
                    songs: songs,
                    current_song: current_song,
                    albums: albums,
                    loading: false
                });
            } else {
                this.props.history.push({
                    pathname: '/login',
                    state: { redirect_message: "Para entrar a SR Music necesitas iniciar sesión" }
                });
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    renderIndex = (songs, albums) => {
        const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

        return (
            <div className="row">
                <div className=" col-12 box-rounded">
                    <h4 className="text-align-center font-weight-bolder text-sr">ÚLTIMOS ALBUMS</h4>
                    <hr/>
                    <Slider {...this.MultipleSettings(albums.length)}>
                        {
                            albums.map((album,i)=>{
                                const day = new Date(album.released_at.date).getDate();
                                const month = new Date(album.released_at.date).getMonth();
                                const year = new Date(album.released_at.date).getFullYear();
                                return (
                                    <div key={i}>
                                        <div className="card card-post">
                                            <img src={album.img_name} className="card-img-top pointer" alt={album.name} height={200} width={100}
                                                 onClick={this.selectAlbum.bind(this,album)}/>
                                            <div className="card-body">
                                                <h5 className="card-title pointer" onClick={this.selectAlbum.bind(this,album)}>{album.name}</h5>
                                                <p>{months[month]} {day}, {year}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>

                <div className="col-12 box-rounded">
                    <h4 className="text-align-center font-weight-bolder text-sr">ÚLTIMAS CANCIONES</h4>
                    <hr/>
                    <Slider {...this.MultipleSettings(songs.length)}>
                        {
                            songs.map((song,i)=>{
                                const day = new Date(song.released_at.date).getDate();
                                const month = new Date(song.released_at.date).getMonth();
                                const year = new Date(song.released_at.date).getFullYear();
                                return (
                                    <div key={i}>
                                        <div className="card card-post">
                                            <img src={song.img_name} className="card-img-top pointer" alt={song.name} height={200} width={100}
                                            onClick={this.handleSong.bind(this, song)}/>
                                            <div className="card-body">
                                                <h5 className="card-title pointer"
                                                    onClick={this.handleSong.bind(this, song)}>{song.name}</h5>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Slider>

                </div>
            </div>
        )
    }

    renderArtists = (artists) => {
        return (
            <div className="row">
                <div className=" col-12 box-rounded">
                    <Slider {...this.MultipleSettings(artists.length)}>
                        {
                            artists.map((artist,i)=>{
                                return (
                                    <div key={i}>
                                        <div className="card card-post">
                                            <img src={artist.img_name} className="card-img-top pointer" alt={artist.alias}
                                                 onClick={this.selectArtist.bind(this,artist)} height={200} width={100}/>
                                            <div className="card-body">
                                                <h5 className="card-title pointer" onClick={this.selectArtist.bind(this,artist)}>{artist.alias}</h5>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>
            </div>
        )
    }

    // Shows all the albums
    renderAlbums = (albums) => {
        return (
            <div className="row">
                <div className=" col-12 box-rounded">
                    <Slider {...this.MultipleSettings(albums.length)}>
                        {
                            albums.map((album,i)=>{
                                return (
                                    <div key={i}>
                                        <div className="card card-post">
                                            <img src={album.img_name} className="card-img-top pointer" onClick={this.selectAlbum.bind(this,album)}
                                                 alt={album.name} height={200} width={100}/>
                                            <div className="card-body">
                                                <h5 className="card-title pointer"
                                                    onClick={this.selectAlbum.bind(this,album)}>{album.name}</h5>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>
            </div>
        )
    }

    // Prepare to show one album and call Album component to display it
    selectAlbum = (album) => {
        this.setState( { section: "ALBUM", album: album } )
    }

    selectArtist = (artist) => {
        this.setState( { section: "ARTISTA", artist: artist } )
    }

    // Slider settings configuration
    MultipleSettings = (items_number) => {
        return {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: items_number < 3 ? items_number:3,
            slidesToScroll: 1,
            rows: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
            lazyLoad: true,
            responsive: [
                {
                    breakpoint: 1095,
                    settings: {
                        slidesToShow: items_number > 1 ? 2:1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    },

                },{

                    breakpoint: 665,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    },

                }

            ]
        }
    }

    changeSection = (section) => {
        this.setState( { section: section } );
    }

    handleSong = (song) => {
        // save the song so the user can start listening the last song he listened
        sessionStorage.setItem('last_song',song.id)
        const audio = document.querySelector("audio");
        this.setState({ current_song: song },function(){
            audio.pause();
            audio.load();
            audio.play();
        })
    }


    render() {

        const { loading, section, songs, current_song,albums, album, artists, artist } = this.state;

        return (
            <div className={"full-screen"}>
                <Title title={"SR - SR MUSIC"}/>
                <Header active={"srmusic"} sticky={true}/>

                {
                    loading ?
                        null
                        :
                        <div className="container-fluid section-padding-100-0 pb-sr-music">
                            <div className="row">

                                {/* MENU */}
                                <div className="col-12 col-md-2">
                                    <div className="single-widget-area bg-white height-500 menu-sr-music">
                                        <div className="widget-title one-day">
                                            <h3><strong>Menu</strong></h3>
                                        </div>
                                        <div className="widget-content">
                                            <ul>
                                                <li className={"pointer"} onClick={this.changeSection.bind(this,"INICIO")}>
                                                    <h4 className="menu-item-sr-music">
                                                        <span className="fa fa-home"/> Inicio
                                                    </h4>
                                                </li>
                                                <li className={"pointer"} onClick={this.changeSection.bind(this,"ARTISTAS")}>
                                                    <h4 className="menu-item-sr-music">
                                                        <span className="fa fa-headphones"/> Artistas
                                                    </h4>
                                                </li>
                                                <li className={"pointer"} onClick={this.changeSection.bind(this,"ALBUMS")}>
                                                    <h4 className="menu-item-sr-music">
                                                        <span className="fa fa-music"/> Albums
                                                    </h4>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <br/><br/>
                                </div>

                                {/* MAIN CONTENT */}

                                <div className="col-12 col-md-9 content-area-sr-music mb-5">
                                    <br/>
                                    <div className="row">
                                        <div className="col-12 col-md-4">
                                            <h3 className="title one-day"><strong>{section}</strong></h3>
                                        </div>
                                    </div>
                                    <br/>
                                    {
                                        section === "INICIO" ?
                                            this.renderIndex(songs,albums)
                                            :
                                            null
                                    }
                                    {
                                        section === "ARTISTAS" ?
                                            this.renderArtists(artists)
                                            :
                                            null
                                    }
                                    {
                                        section === "ALBUMS" ?
                                            this.renderAlbums(albums)
                                            :
                                            null
                                    }
                                    {
                                        section === "ALBUM" ?
                                            <Album album={album} handleSong={this.handleSong}/>
                                            :
                                            null
                                    }
                                    {
                                        section === "ARTISTA" ?
                                            <Artist artist={artist} handleSong={this.handleSong} selectAlbum={this.selectAlbum}/>
                                            :
                                            null
                                    }
                                    <br/>
                                </div>
                            </div>

                            {/* SONG AREA */}
                            <SongPlayed song={current_song}/>

                        </div>
                }

            </div>
        );
    }
}
export default withRouter(SRMusic);