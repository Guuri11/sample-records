import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";

class Shop extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - TIENDA"}/>
                <Header active={"shop"}/>
            </div>
        );
    }
}
export default Shop;