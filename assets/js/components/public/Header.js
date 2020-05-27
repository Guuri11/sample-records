import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
//TODO: Añadir carrito
import Search from "./Search";
import Cart from "./Cart";
import {Link} from "react-router-dom";
import SimpleTooltip from "./SimpleTooltip";
import axios from "axios";
import SessionIconsNav from "./SessionIconsNav";


class Header extends PureComponent {

    constructor(props){
        super(props);
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted && sessionStorage.getItem('auth') === null){
            this.isUserAuth();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    static propTypes = {
        sticky: PropTypes.bool
    }

    isUserAuth = () => {
        axios.get('/index.php/api/v1.0/user/authenticated').then(res => {
                sessionStorage.setItem('auth', res.data.success);
                if (res.data.hasOwnProperty("is_admin"))
                    sessionStorage.setItem('is_admin', res.data.is_admin);
                else
                    sessionStorage.removeItem('is_admin');
        }).catch(error => {
        });
    }

    render() {
        const {active, sticky} = this.props;
        return (
            <div className={sticky ? "bg-white shadow sticky":"bg-white shadow"} onLoad={this.isUserAuth}>
                <nav className="navbar navbar-expand-lg navbar-light nav-sr container">
                    <Link to={'/'} className={"navbar-brand text-brand one-day"}>
                        <img src={"/img/core/logo-black-onlylogo.png"} width={50} style={{marginRight:5}} alt={"Logo"}/>
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
                            <SessionIconsNav auth={sessionStorage.getItem('auth')}/>
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