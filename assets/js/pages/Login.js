import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";

class Login extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - LOGIN"}/>
                <Header/>
            </div>
        );
    }
}
export default Login;