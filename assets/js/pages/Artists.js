import React, { Component } from 'react';
import Header from "../components/Header";
import Title from "../components/Title";
import Footer from "../components/Footer";

class Artists extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - ARTISTAS"}/>
                <Header active={"artists"}/>


                <Footer/>
            </div>
        );
    }
}
export default Artists;