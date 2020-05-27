import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import axios from 'axios';
import {Link, Redirect} from "react-router-dom";
import Slider from 'react-slick';

class Home extends Component{

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        last_two: [],
        last_posts: [],
        last_products: [],
        last_song: [],
        loading: true,
        error:false
    };

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getLastTwo();
            this.getLastSong();
            this.getLastProducts();
            this.getLastPosts();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    /* API REQUESTS */

    getLastTwo() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDay();
        const now_formated = year+"-"+month+"-"+day;

        axios.get(`/index.php/api/v1.0/search/last?last=2&until=${now_formated}`).then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { last_two: res.data.results } );
            } else {
                <Redirect to={'error404'}/>
            }

        }).catch(e=>{})
    }


    getLastSong () {
        axios.get(`/index.php/api/v1.0/song?last=1`).then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { last_song: res.data.results } );
            } else {
                <Redirect to='/error404' />
            }

        })
    }

    getLastProducts () {
        axios.get(`/index.php/api/v1.0/product?last=6&available=1s`).then(res => {
            if (res.data.success === true){
                this.setState( { last_products: res.data.results } );
            } else {
                <Redirect to='/error404' />
            }

        })
    }

    getLastPosts () {
        axios.get(`/index.php/api/v1.0/post?last=6`).then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { last_posts: res.data.results, loading: false } );
            } else {
                <Redirect to='/error404' />

            }

        })
    }

    /* END API REQUESTS */

    render () {

        // Slider configuration
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
            lazyLoad: true,
            responsive: [
                {
                    breakpoint: 1095,
                    settings: {
                        slidesToShow: 2,
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
        };

        const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        return(
            <div>
                <Title title={"SR - INICIO"}/>
                <Header active={"home"}/>

                {/* Last two items section */}
                <div id="magicCarousel" className="carousel slide carousel-sr" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#magicCarousel" data-slide-to="0" className="active"/>
                        <li data-target="#magicCarousel" data-slide-to="1"/>
                    </ol>

                    <div className="carousel-inner" role="listbox">
                        {
                            this.state.last_two.map((item, i) =>
                            {
                                return (
                                    <div key={i} className={i === 0 ? "carousel-item carousel-height active" : "carousel-item carousel-height" }>
                                        <img src={item.img_name} className="d-block img-fluid"/>
                                        <div className="carousel-caption">
                                            <h3>{item.artist.alias}</h3>
                                            <p>
                                                {item.hasOwnProperty('name') ? item.name : item.title}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <a href="#magicCarousel" className="carousel-control-prev" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon"/>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a href="#magicCarousel" className="carousel-control-next" role="button" data-slide="next">
                            <span className="carousel-control-next-icon"/>
                            <span className="sr-only">Next</span>
                        </a>

                    </div>
                </div>

                {/* Last posts section */}
                <div className="box-rounded">
                    <div className="container caption">
                        <h2 className="text-sr">Últimas noticias</h2>
                        <hr/>
                    </div>
                    <Slider {...settings}>
                        {
                            this.state.last_posts.map((post,i)=>{
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

                {/* Last products section */}
                <div className="box-rounded">
                    <div className="container caption">
                        <h2 className="text-sr">Últimos productos</h2>
                        <hr/>
                    </div>
                    <Slider {...settings}>
                        {
                            this.state.last_products.map((product,i)=>{
                                return (
                                    <div key={i}>
                                        <div className="wrapper">
                                            <div className="container">
                                                <div className="top" >
                                                    <img src={product.img_name} className="product-img-top" alt={product.name} height={200} width={100}/>
                                                </div>
                                                <div className="bottom">
                                                    <div className="left">
                                                        <div className="details">
                                                            <Link to={`/tienda/${product.id}`}>
                                                                <p className="product-name text-sr">{product.name}</p>
                                                            </Link>
                                                            <p>{product.price}€</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="inside">
                                                <div className="icon"><i className="material-icons">info_outline</i></div>
                                                <div className="contents">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Precio</th>
                                                                <th>Stock</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>{product.price}€</td>
                                                                <td>{product.stock}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Descripción</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>{product.description}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Slider>
                </div>

                {/* Last song section */}
                {
                    this.state.last_song.length === 0 ?
                        <span/>
                        :
                        <section className="featured-artist-area section-padding-100 bg-img bg-overlay bg-fixed"
                                 style={{backgroundImage: "url(img/bg/last_song_index.jpg)"}}>
                            <div className={"container"}>
                                <div className="row align-items-end pb-md-5">
                                    <div className="col-12 col-md-5 col-lg-4">
                                        <div className="featured-artist-thumb">
                                            <img src={this.state.last_song[0].img_name} width={280} height={250} alt={this.state.last_song[0].title}/>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-7 col-lg-8">
                                        <div className="featured-artist-content">
                                            <div className="section-heading text-white text-left mb-2">
                                                <p>Escucha lo último de</p>
                                                <h2>{this.state.last_song[0].artist.alias}</h2>
                                            </div>
                                            <div className="song-play-area">
                                                <div className="song-name">
                                                    <p className="text-sr">{this.state.last_song[0].name}</p>
                                                </div>
                                                <audio preload="auto" controls style={{width:"70%"}}>
                                                    <source src={"/songs/"+this.state.last_song[0].song_file}/>
                                                </audio>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                }

                <Footer additionalStyles={{marginTop: 0}}/>
            </div>
        )
    }
}

export default Home;