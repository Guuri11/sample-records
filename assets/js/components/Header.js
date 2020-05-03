import React, { Component } from 'react';
import LogoWhite from "../../../public/img/core/logo-white-onlylogo.png";
import LogoBlack from "../../../public/img/core/logo-black-onlylogo.png";
import PropTypes from 'prop-types';
//TODO: Añadir carrito
import Cart from "./Cart";
import Search from "./Search";
import {Link} from "react-router-dom";


class Header extends Component {

    constructor(props){
        super(props);
        this.state = {sticky: this.props.sticky}
    }

    static propTypes = {
        sticky: PropTypes.bool
    }

    render() {
        const {active} = this.props;
        return (
            <div className={"bg-light"}>
                <nav className="navbar navbar-expand-lg navbar-light nav-sr container">
                    <a className="navbar-brand text-brand one-day" href="#">
                        <img src={"img/core/logo-black-onlylogo.png"} width={50} style={{marginRight:5}}/>
                        <span>SAMPLE RECORDS</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav mt-2 mt-lg-0">
                            <li className="nav-item ">
                                <Link to={'/'} class={active === "home" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/artistas'} class={active === "artists" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Artistas</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/eventos'} class={active === "events" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Eventos</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/noticias'} class={active === "news" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Noticias</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/tienda'} class={active === "shop" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Tienda</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/sr-music'} class={active === "srmusic" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>SR Music</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/contacto'} class={active === "contact" ? "nav-link nav-sr-item active":"nav-link nav-sr-item"}>Contacto</Link>
                            </li>
                        </ul>
                        <div className={"nav-icons"}>
                            <span className="fa fa-shopping-cart" data-toggle="modal" data-target="#cartModal"/>
                            <span className="fa fa-search" data-toggle="modal" data-target="#searchModal"/>
                            <Link to={'/login'} class="text-dark">
                                <span className="fa fa-sign-in"/>
                            </Link>
                        </div>
                    </div>
                </nav>

                <Cart/>
                <Search/>

            </div>
        );
    }
}

Header.defaultProps = {
    sticky:false
}

export default Header;