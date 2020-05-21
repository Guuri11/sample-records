import React, { Component } from 'react';

class Header extends Component{

    render() {
        return (
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars"/>
                </button>

                <ul className="navbar-nav ml-auto">

                    <li className="nav-item dropdown no-arrow d-sm-none">
                        <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fa fa-search"/>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                             aria-labelledby="searchDropdown">
                            <form className="form-inline mr-auto w-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small"
                                           placeholder="Search for..." aria-label="Search"
                                           aria-describedby="basic-addon2"/>
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" type="button">
                                                <i className="fa fa-search fa-sm"/>
                                            </button>
                                        </div>
                                </div>
                            </form>
                        </div>
                    </li>

                    <div className="topbar-divider d-none d-sm-block"/>

                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="mr-2 d-none d-lg-inline text-gray-600">Admin</span>
                            <i className="fa fa-user-circle" aria-hidden="true"/>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                             aria-labelledby="userDropdown">
                            <a className="dropdown-item" href="#" >
                                <i className="fa fa-sign-out fa-sm fa-fw mr-2"/>
                                Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>

        )
    }
}
export default Header