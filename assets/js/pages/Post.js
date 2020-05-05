import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Post extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - POSTS"}/>
                <Header/>
                <Footer/>
            </div>
        );
    }
}
export default Post;