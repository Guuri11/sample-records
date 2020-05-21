import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";

class Error404 extends Component {

    render() {
        return(
            <div id="wrapper">
                <Navbar />
                    error 404 bro
                <Footer/>
            </div>
        )
    }
}

export default Error404;