import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Artist extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - ARTISTA"}/>
                <Header/>
                <Footer/>
            </div>
        );
    }
}
export default Artist;