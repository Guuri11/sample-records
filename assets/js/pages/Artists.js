import React, { Component } from 'react';
import Header from "../components/Header";
import Title from "../components/Title";
import Footer from "../components/Footer";
import axios from 'axios';
import {Redirect, Link} from "react-router-dom";
import Breadcumb from "../components/Breadcumb";

class Artists extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        success: false,
        loading: true,
        artists: []
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getArtists();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    /* API REQUEST TO GET THE ARTISTS DATA */

    getArtists() {
        axios.get(`/api/v1.0/artist`).then(res => {
            if (res.data.success === true){
                this.setState( { artists: res.data.results, loading: false } )
            } else {
                <Redirect to={'error404'}/>
            }

        })
    }

    render() {

        const { artists, loading } = this.state;

        return (
            <div className={"bg-sr"}>
                <Title title={"SR - ARTISTAS"}/>
                <Header active={"artists"}/>
                <Breadcumb title={"ARTISTAS"} p_text={"¡Conoce a nuestras promesas!"}/>
                {
                    loading ?
                        null
                        :
                        <div className="col-12">
                            <section className="events-area section-padding-100">
                                <div className="container">
                                    <div className="row">
                                        {
                                            artists ?
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
                                                :
                                                null
                                        }
                                    </div>

                                    <div className="row ">
                                        <div className="col-12">
                                            <div className="load-more-btn text-center mt-70">
                                                <a href="#" className="btn btn-primary btn-primary-sr">Load More <i
                                                    className="fa fa-angle-double-right"/></a>
                                            </div>
                                        </div>
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
export default Artists;