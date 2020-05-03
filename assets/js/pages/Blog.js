import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";

class Blog extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - NOTICIAS"}/>
                <Header active={"news"}/>
            </div>
        );
    }
}
export default Blog;