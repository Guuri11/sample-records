import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import {Link} from "react-router-dom";
import axios from "axios";
import Breadcumb from "../../components/public/Breadcumb";

// Search Page
class Search extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        search : new URLSearchParams(window.location.search).get('s'),
        results: [],
        loading: true
    }

    componentDidMount() {
        const {search} = this.state;
        this._isMounted = true;
        if (this._isMounted && (search !== "" || search !== null)){
            this.getSearch({search});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getSearch = ({search}) => {
        // Format date
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDay();
        const now_formated = year+"-"+month+"-"+day;

        axios.get(`/api/v1.0/search?search=${search}&available=1&until=${now_formated}`).then(res => {
            this.setState( { results: res.data.results ? res.data.results : [], loading: false } )
        }).catch(error => {});
    }

    // Show artists founded
    _renderArtist = (artists) => {
        return(
            artists.map( (artist,idx) => {
                return (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <div className="single-event-area mb-3">
                            <div className="event-thumbnail">
                                <img src={artist.img_name} alt="Imagen no disponible" width={350} height={350}/>
                            </div>
                            <div className="event-text">
                                <h4>{artist.alias}</h4>
                                <Link to={`/artistas/${artist.alias}`}
                                      className="btn see-more-btn">
                                    Ver
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            } )
        )
    }

    // Show posts founded
    _renderPosts = (posts) => {
        return(
            posts.map( (post,idx) => {
                return (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <div className="single-event-area mb-3">
                            <div className="event-thumbnail">
                                <img src={post.img_name} alt="Imagen no disponible" width={350} height={350}/>
                            </div>
                            <div className="event-text">
                                <h4>{post.title}</h4>
                                <Link to={`/noticias/${post.id}`}
                                      className="btn see-more-btn">
                                    Ver
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            } )
        )
    }

    // Show products founded
    _renderProducts = (products) => {
        return(
            products.map( (product,idx) => {
                return (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <div className="single-event-area mb-3">
                            <div className="event-thumbnail">
                                <img src={product.img_name} alt="Imagen no disponible" width={350} height={350}/>
                            </div>
                            <div className="event-text">
                                <h4>{product.name}</h4>
                                <Link to={`/tienda/${product.id}`}
                                      className="btn see-more-btn">
                                    Ver
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            } )
        )
    }

    // Show events founded
    _renderEvents = (events) => {
        return(
            events.map( (event,idx) => {
                return (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                        <div className="single-event-area mb-3">
                            <div className="event-thumbnail">
                                <img src={event.img_name} alt="Imagen no disponible" width={350} height={350}/>
                            </div>
                            <div className="event-text">
                                <h4>{event.name}</h4>
                                <Link to={`/eventos/${event.id}`}
                                      className="btn see-more-btn">
                                    Ver
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            } )
        )
    }


    render() {

        const { results, loading, search } = this.state;

        return (
            <div>
                <Title title={"SR - BUSQUEDA"}/>
                <Header/>
                { loading ? null : <Breadcumb title={search} p_text={"Esto es lo que hemos encontrado!"}/> }

                {
                    loading ?
                        null
                        :
                        results.length === 0 ?
                            <div className={"container mt-5"}>
                                <h2 className="font-weight-bolder text-align-center">No hemos encontrado resultados de tu busqueda, lo sentimos 😔</h2>
                            </div>
                            :
                            <div className="col-12">
                                <section className="events-area section-padding-100">
                                    <div className="container">
                                        <div className="row">
                                            {
                                                results.hasOwnProperty('artists') ?
                                                    this._renderArtist(results.artists)
                                                    :
                                                    null
                                            }
                                            {
                                                results.hasOwnProperty('posts') ?
                                                    this._renderPosts(results.posts)
                                                    :
                                                    null
                                            }
                                            {
                                                results.hasOwnProperty('products') ?
                                                    this._renderProducts(results.products)
                                                    :
                                                    null
                                            }
                                            {
                                                results.hasOwnProperty('events') ?
                                                    this._renderEvents(results.events)
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>
                                </section>
                            </div>
                }

                <Footer/>
            </div>
            );
    }
}
export default Search;