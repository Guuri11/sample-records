import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Events extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - EVENTOS"}/>
                <Header active={"events"}/>
                <Footer/>
            </div>
        );
    }
}
export default Events;