import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Footer extends Component{

    render () {
        return(
            <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright &copy; Sample Records 2020 | <a href={'https://github.com/Guuri11'} className="text-info">Sergio Gurillo Corral</a></span>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;