import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import Header from "../../components/admin/Header";
import {Link} from "react-router-dom";

class Error404 extends Component {

    render() {
        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="text-center">
                                <div className="error mx-auto" data-text="404">404</div>
                                <p className="lead text-gray-800 mb-5">Página no encontrada</p>
                                <Link to={'/admin'}>&larr; Volver a inicio</Link>
                            </div>

                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        )
    }
}

export default Error404;