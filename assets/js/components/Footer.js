import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Footer extends Component {
    render() {
        return (
            <div>
                <footer className="footer-area">
                    <div className="container">
                        <div className="row d-flex flex-wrap align-items-center">
                            <div className="col-12 col-md-6">
                                <a className="text-dark one-day" id="footer-sr" href="#">SAMPLE RECORDS</a>
                                <p className="copywrite-text"><a
                                    href="#">
                                    Copyright &copy;
                                    <script>document.write(new Date().getFullYear());</script>
                                    All rights reserved | This template is made with <i className="fa fa-heart-o"
                                                                                        aria-hidden="true"/> by <a
                                        href="https://colorlib.com" target="_blank"/>Colorlib</a>
                                </p>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="footer-nav">
                                    <ul>
                                        <li><Link to={'/'}>Inicio</Link></li>
                                        <li><Link to={'/tienda'}>Tienda</Link></li>
                                        <li><Link to={'/eventos'}>Eventos</Link></li>
                                        <li><Link to={'/noticias'}>Noticias</Link></li>
                                        <li><Link to={'/contacto'}>Contacto</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}
export default Footer;

