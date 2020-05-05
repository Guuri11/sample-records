import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Shop extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - TIENDA"}/>
                <Header active={"shop"}/>
                <Footer/>
            </div>
        );
    }
}
export default Shop;