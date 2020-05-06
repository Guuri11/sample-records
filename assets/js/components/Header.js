import React, {Component} from 'react';
import PropTypes from 'prop-types';
//TODO: Añadir carrito
import Search from "./Search";
import {Link} from "react-router-dom";
import SimpleTooltip from "./SimpleTooltip";


class Header extends Component {

    constructor(props){
        super(props);
        this.state = {sticky: this.props.sticky, isUserAuth:false}
    }

    static propTypes = {
        sticky: PropTypes.bool
    }

    isUserAuth = () => {
        const userRating = document.querySelector('.js-user-rating');
        this.setState({ isUserAuth: userRating.dataset.isAuthenticated === "true" }) ;
    }

    render() {
        const {active} = this.props;
        return (
            <div className={"bg-white shadow"} onLoad={this.isUserAuth}>
                <nav className="navbar navbar-expand-lg navbar-light nav-sr container">
                    <Link to={'/'} className={"navbar-brand text-brand one-day"}>
                        <img src={"img/core/logo-black-onlylogo.png"} width={50} style={{marginRight:5}} alt={"Logo"}/>
                        <span>SAMPLE RECORDS</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav mt-2 mt-lg-0">
                            <li className="nav-item ">
                                <Link to={'/'} className={active === "home" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/artistas'} className={active === "artists" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Artistas</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/eventos'} className={active === "events" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Eventos</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/noticias'} className={active === "news" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Noticias</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/tienda'} className={active === "shop" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Tienda</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/sr-music'} className={active === "srmusic" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>SR Music</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/contacto'} className={active === "contact" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Contacto</Link>
                            </li>
                        </ul>
                        <div className={"nav-icons"}>
                            <span className="fa fa-shopping-cart" data-toggle="modal" data-target="#cartModal" id={"chartIcon"}/>
                            <SimpleTooltip target="chartIcon" >Carrito</SimpleTooltip>
                            <span className="fa fa-search" data-toggle="modal" data-target="#searchModal" id={"searchIcon"}/>
                            <SimpleTooltip target="searchIcon" >Encuentra lo quieras aquí</SimpleTooltip>
                            {
                                this.state.isUserAuth ?
                                    <div className={"d-inline"}>
                                        <Link to={'/logout'} className="text-dark">
                                            <span className="fa fa-sign-out" id={"logoutIcon"}/>
                                            <SimpleTooltip target="logoutIcon">Cerrar sesión</SimpleTooltip>
                                        </Link>

                                        <Link to={'/perfil'} className="text-dark">
                                            <span className="fa fa-user-circle" id={"profileIcon"}/>
                                            <SimpleTooltip target="profileIcon">Perfil</SimpleTooltip>
                                        </Link>
                                    </div>
                                    :
                                    <div className={"d-inline"}>
                                        <Link to={'/login'} className="text-dark">
                                            <span className="fa fa-sign-in" id={"loginIcon"}/>
                                            <SimpleTooltip target="loginIcon" >¡Inicia sesión!</SimpleTooltip>
                                        </Link>

                                        <Link to={'/registrarse'} className="text-dark">
                                            <span className="fa fa-user-plus" id={"registerIcon"}/>
                                            <SimpleTooltip target="registerIcon" >¡Regístrate!</SimpleTooltip>
                                        </Link>
                                    </div>

                            }
                        </div>
                    </div>
                </nav>

                <Search/>

            </div>
        );
    }
}

Header.defaultProps = {
    sticky:false
}

export default Header;