import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';

class Home extends Component{

    state = {
        last_two: [],
        last_news: [],
        last_products: [],
        last_song: [],
        loading: true,
        error:false
    };

    componentDidMount() {
        this.getLastTwo();
        this.getLastSong();
        this.getLastProducts()
    }

    getLastTwo() {
        axios.get(`http://localhost:8000/api/v1.0/search/last?last=2`).then(res => {
            if (res.data.success === true){
                this.setState( { last_two: res.data.results } );
            } else {
                // TODO: REDIRIGIR 500
                console.log("Error");
            }

        })
    }

    getImgSliderRoute(object) {
        let route = "";
        switch (object.entity) {
            case "App\\Entity\\Album":
                route = "/img/albums/";
                break;
            case "App\\Entity\\Post":
                route = "/img/posts/";
                break;
            case "App\\Entity\\Song":
                route = "/img/songs/";
                break;
            case "App\\Entity\\Event":
                route = "/img/events/";
                break;

            default:
        }
        return route;
    }

    getLastSong () {
        axios.get(`http://localhost:8000/api/v1.0/song?last=1`).then(res => {
            if (res.data.success === true){
                this.setState( { last_song: res.data.results, loading: false } );
            } else {
                // TODO: REDIRIGIR 500
                console.log("Error");
            }

        })
    }

    getLastProducts () {
        axios.get(`http://localhost:8000/api/v1.0/product?last=6`).then(res => {
            if (res.data.success === true){
                this.setState( { last_products: res.data.results, loading: false } );
            } else {
                // TODO: REDIRIGIR 500
                console.log("Error");
            }

        })
    }

    render () {
        const song = this.state.last_song[0];
        const products = this.state.last_products;
        return(
            <div>
                <Title title={"SR - INICIO"}/>
                <Header active={"home"}/>
            </div>
        )
    }
}

export default Home;