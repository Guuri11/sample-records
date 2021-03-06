import React, { Component } from 'react';
import axios from "axios";

class Header extends Component{

    constructor(props) {
        super(props);
    }

    handleLogout = () => {
        axios.get(`/api/v1.0/user/logout`).then(()=>{
            sessionStorage.setItem('auth',false);
            sessionStorage.setItem('is_admin',false);
            window.location.assign('/');
        })
    }


    render() {
        return (
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars"/>
                </button>

                <ul className="navbar-nav ml-auto">

                    <div className="topbar-divider d-none d-sm-block"/>

                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="mr-2 d-none d-lg-inline text-gray-600">Admin</span>
                            <i className="fa fa-user-circle" aria-hidden="true"/>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                             aria-labelledby="userDropdown">
                            <p className="dropdown-item pointer" onClick={ () => window.location.assign('/perfil') }>
                                <i className="fa fa-home fa-sm fa-fw mr-2"/>
                                Perfil
                            </p>
                            <p className="dropdown-item pointer" onClick={this.handleLogout.bind(this)}>
                                <i className="fa fa-sign-out fa-sm fa-fw mr-2"/>
                                Logout
                            </p>
                        </div>
                    </li>
                </ul>
            </nav>

        )
    }
}
export default Header