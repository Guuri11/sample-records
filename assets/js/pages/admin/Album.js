import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";

class Album extends Component {

    render() {
        return(
            <div id="wrapper">
                <Navbar />

                <Footer/>
            </div>
        )
    }
}

export default Album;