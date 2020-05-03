import React, { Component } from 'react';
import Header from "../components/Header";
import Title from "../components/Title";

class Artists extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - ARTISTAS"}/>
                <Header active={"artists"}/>
            </div>
        );
    }
}
export default Artists;