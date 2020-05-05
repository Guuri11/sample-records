import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class SRMusic extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - SR MUSIC"}/>
                <Header active={"srmusic"}/>
                <Footer/>
            </div>
        );
    }
}
export default SRMusic;