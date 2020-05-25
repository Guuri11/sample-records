import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Navbar extends Component {

    render() {
        return (
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                <div className="sidebar-brand d-flex align-items-center justify-content-center">
                    <div className="sidebar-brand-icon pointer" onClick={ () => window.location.assign('/')}>
                        <img src="/img/core/logo-white-onlylogo.png" width="50" height="50"/>
                    </div>
                    <div className="sidebar-brand-text mx-3 pointer text-white font-weight-bolder one-day" onClick={ () => window.location.assign('/')}>
                        Sample Records
                    </div>
                </div>

                <hr className="sidebar-divider my-0"/>

                <li className="nav-item active">
                    <Link to={'/admin/'} className="nav-link">
                        <i className="fa fa-home"/>
                        <span>Inicio</span></Link>
                </li>

                <hr className="sidebar-divider"/>

                <li className="nav-item active">
                    <p onClick={() => { window.location.assign('/admin/api/doc') }} className="nav-link pointer">
                        <i className="fa fa-book"/>
                        <span>API Doc</span></p>
                </li>

                <li className="nav-item">
                    <Link  to={'#'} className="nav-link collapsed text-white" data-toggle="collapse"
                           data-target="#collapseArtists" aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fa fa-music text-white"/>
                        <span className="font-weight-bolder">Artistas  <i className="fa fa-angle-down"/></span>
                    </Link>
                    <div id="collapseArtists" className="collapse" aria-labelledby="headingTwo"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <Link className="collapse-item" to={'/admin/artistas'}>Artistas</Link>
                            <Link className="collapse-item" to={'/admin/albums'}>Albums</Link>
                            <Link className="collapse-item" to={'/admin/canciones'}>Canciones</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item active">
                    <Link to={'/admin/comentarios'} className="nav-link">
                        <i className="fa fa-comment"/>
                        <span>Comentarios</span></Link>
                </li>


                <li className="nav-item">
                    <Link to={'#'} className="nav-link collapsed text-white" data-toggle="collapse"
                       data-target="#collapseEvents" aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fa fa-ticket text-white"/>
                        <span className="font-weight-bolder">Eventos  <i className="fa fa-angle-down"/></span>
                    </Link>
                    <div id="collapseEvents" className="collapse" aria-labelledby="headingTwo"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <Link to={'/admin/eventos'} className="collapse-item">Eventos</Link>
                            <Link to={'/admin/eventos/entradas'} className="collapse-item">Entradas</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <Link  to={'#'} className="nav-link collapsed text-white" data-toggle="collapse"
                           data-target="#collapsePosts" aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fa fa-newspaper-o text-white"/>
                        <span className="font-weight-bolder">Noticias  <i className="fa fa-angle-down"/></span>
                    </Link>
                    <div id="collapsePosts" className="collapse" aria-labelledby="headingTwo"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <Link className="collapse-item" to={'/admin/noticias'}>Noticias</Link>
                            <Link className="collapse-item" to={'/admin/noticias/tags'}>Tags</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <Link to={'#'} className="nav-link collapsed text-white" data-toggle="collapse"
                          data-target="#collapsePurchases" aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fa fa-shopping-bag text-white"/>
                        <span className="font-weight-bolder">Tienda  <i className="fa fa-angle-down"/></span>
                    </Link>
                    <div id="collapsePurchases" className="collapse" aria-labelledby="headingTwo"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <Link to={'/admin/productos'} className="collapse-item">Productos</Link>
                            <Link to={'/admin/categorias'} className="collapse-item">Categorias</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item active">
                    <Link to={'/admin/usuarios'} className="nav-link">
                        <i className="fa fa-user"/>
                        <span>Usuarios</span></Link>
                </li>


                <li className="nav-item active">
                    <Link to={'/admin/ventas'} className="nav-link">
                        <i className="fa fa-shopping-bag"/>
                        <span>Ventas</span></Link>
                </li>

                <hr className="sidebar-divider d-none d-md-block"/>

                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0 fa fa-navicon text-white" id="sidebarToggle"/>
                </div>

            </ul>

        )
    }
}
export default Navbar;