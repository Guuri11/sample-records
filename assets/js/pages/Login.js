import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Login extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - LOGIN"}/>
                <Header/>
                <Footer/>
            </div>
        );
    }
}
export default Login;