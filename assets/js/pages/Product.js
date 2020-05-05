import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Product extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - INICIO"}/>
                <Header/>
                <Footer/>
            </div>
        );
    }
}
export default Product;