import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Footer extends Component {
    render() {
        return (
            <footer className="mainfooter" role="contentinfo" style={this.props.additionalStyles}>
                <div className="footer-middle">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="footer-pad row justify-content-center">
                                    <div className="col12 col-md-3 justify-content-center">
                                        <Link to={'/'} className={"text-center"}>
                                            <h4 className="one-day font-weight-bolder">SAMPLE RECORDS</h4>
                                        </Link>
                                    </div>
                                    <div className="col-12 col-md-3 text-center">
                                        <ul className="social-network social-circle">
                                            <li><a href="#" className="icoTwitter" title="Twitter"><i
                                                className="fa fa-twitter"/></a></li>
                                            <li><a href="#" className="icoGmail" title="Gmail"><i
                                                className="fa fa-google-plus"/></a></li>
                                            <li><a href="#" className="icoGithub" title="Github"><i
                                                className="fa fa-github"/></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-md-12 copy mt-3">
                                <p className="text-center text-dark">&copy; Copyright 2020 - Sample Records. All rights
                                    reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
export default Footer;

