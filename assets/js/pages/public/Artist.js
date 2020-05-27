import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import PropTypes from 'prop-types';
import axios from "axios";
import {Link} from "react-router-dom";
import Slider from 'react-slick';
import {Helmet} from "react-helmet";
import VideoClip from "../../components/public/VideoClip";

class Artist extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        artist: {},
        posts: [],
        songs: [],
        products: [],
        events: [],
        loading: true
    }

    static propTypes = {
        match: PropTypes.shape({
            params:PropTypes.object,
            isExact:PropTypes.bool,
            path:PropTypes.string,
            url: PropTypes.string
        })
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted){
            // Get artist by the url
            const {artist} = this.props.match.params;
            // api call to get artist data
            const artist_data = await axios.get(`/index.php/api/v1.0/artist/${artist}`).catch(error => {
                this.props.history.push('/error404');
            });
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const day = now.getDay();
            const now_formated = year+"-"+month+"-"+day;
            const artist_id = artist_data.data.results.id;

            const posts = await axios.get(`/index.php/api/v1.0/post?artist=${artist_id}`).catch(error => {});

            const songs = await axios.get(`/index.php/api/v1.0/song?artist=${artist_id}`).catch(error => {});

            const events = await axios.get(`/index.php/api/v1.0/event?until${now_formated}&artist=${artist_id}`).catch(error => {});

            this.setState( {
                artist: artist_data.data.results,
                posts: posts ? posts.data.results: [],
                songs: songs ? songs.data.results: [],
                events: events ? events.data.results: [],
                loading: false
            } );
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
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

    render() {
        const { artist, posts, songs, events, loading } = this.state;

        const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

        return (
            <div>
                <Title title={"SR - "+artist.alias === undefined ? "ARTISTAS":artist.alias}/>
                <Header/>
                {
                    songs.lenght===0 ?
                        null
                        :
                        songs.map((song,i) => {
                            if (song.video_src !== ""){
                                return (
                                    <div key={i}>
                                        <VideoClip id_videoclip={"videoclip"+i} idx_song={"song"+i} src_videoclip={song.video_src}/>
                                    </div>
                                )
                            }
                        })

                }

                {
                    loading ?
                        null
                        :
                        <div>
                            <div className={"container hero-img"}>
                                <img src={artist.img_name} className={"img-artist"} alt={"Imagen no disponble"}/>
                            </div>
                            <div className="text-align-center one-day font-weight-bolder text-sr artist-name">{artist.alias}</div>
                            {
                                /* BIO SECTION */
                                artist.bio ?
                                    <div className={"container artist-bio"}>{artist.bio}</div>
                                    :
                                    null
                            }
                            {
                                /* POSTS SECTION */
                                posts.length > 0 ?
                                    <div className="box-rounded">
                                        <div className="container caption">
                                            <h2 className="text-sr">Noticias</h2>
                                            <hr/>
                                        </div>
                                        <Slider {...this.MultipleSettings(posts.length)}>
                                            {
                                                posts.map((post,i)=>{
                                                    const day = new Date(post.created_at.date).getDate();
                                                    const month = new Date(post.created_at.date).getMonth();
                                                    const year = new Date(post.created_at.date).getFullYear();
                                                    return (
                                                        <div key={i}>
                                                            <div className="card card-post">
                                                                <img src={post.img_name} className="card-img-top" alt={post.name} height={200} width={100}/>
                                                                <Link to={`/noticias/${post.id}`}>
                                                                    <div className="card-body">
                                                                        <div className="post-date">
                                                                            <span>{day}</span>
                                                                            <span>{months[month]+" ‘"+year.toString().substr(-2)}</span>
                                                                        </div>
                                                                        <h5 className="card-title">{post.title}</h5>
                                                                        <p className="card-text">{post.description}</p>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Slider>
                                    </div>
                                    :
                                    null
                            }
                            {
                                /* SONGS SECTION */
                                songs.length > 0 ?
                                    <div className="box-rounded">
                                        <div className="container caption">
                                            <h2 className="text-sr">Canciones</h2>
                                            <hr/>
                                        </div>
                                        <Slider {...this.MultipleSettings(songs.length)}>
                                            {
                                                songs.map((song,i)=>{
                                                    const day = new Date(song.released_at.date).getDate();
                                                    const month = new Date(song.released_at.date).getMonth();
                                                    const year = new Date(song.released_at.date).getFullYear();
                                                    return (
                                                        <div key={i}>
                                                            <div className="card card-post">
                                                                <img src={song.img_name} className="card-img-top" alt={song.name} height={200} width={100}/>
                                                                {
                                                                    song.video_src !== "" ?
                                                                        <span className="fa fa-play-circle-o play-button-videoclip"
                                                                              data-toggle="modal" data-target={"#videoclip"+i} id={"song"+i}/>
                                                                              :
                                                                        null
                                                                }
                                                                <div className="card-body">
                                                                        <h5 className="card-title">{song.name}</h5>
                                                                        <p>{months[month]} {day}, {year}</p>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Slider>

                                    </div>
                                    :
                                    null
                            }

                            {
                                /* EVENTS SECTION */
                                events.length > 0 ?
                                    <div className="box-rounded">
                                        <div className="container caption">
                                            <h2 className="text-sr">Eventos</h2>
                                            <hr/>
                                        </div>
                                        <Slider {...this.MultipleSettings(events.length)}>
                                            {
                                                events.map((event,i)=>{
                                                    const day = new Date(event.date.date).getDate();
                                                    const month = new Date(event.date.date).getMonth();
                                                    const year = new Date(event.date.date).getFullYear();
                                                    return (
                                                        <div key={i}>
                                                            <div className="card card-post">
                                                                <img src={event.img_name} className="card-img-top" alt={event.name} height={200} width={100}/>
                                                                <Link to={`/eventos/${event.id}`}>
                                                                    <div className="card-body">
                                                                        <div className="post-date">
                                                                            <span>{day}</span>
                                                                            <span>{months[month]+" ‘"+year.toString().substr(-2)}</span>
                                                                        </div>
                                                                        <h5 className="card-title">{event.name}</h5>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Slider>
                                    </div>
                                    :
                                    null
                            }

                        </div>
                }
                <Footer/>
            </div>
        );
    }
}
export default Artist;