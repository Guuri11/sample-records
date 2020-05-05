import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Error404 extends Component {
    render() {
        return (
            <div>
                <Title title={"No se encontró la página"}/>
                <Header/>
                Not found
                <Footer/>
            </div>
        );
    }
}
export default Error404;