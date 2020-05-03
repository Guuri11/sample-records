import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";

class SRMusic extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - SR MUSIC"}/>
                <Header active={"srmusic"}/>            </div>
        );
    }
}
export default SRMusic;