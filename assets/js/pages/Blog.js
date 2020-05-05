import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Blog extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - NOTICIAS"}/>
                <Header active={"news"}/>
                <Footer/>
            </div>
        );
    }
}
export default Blog;