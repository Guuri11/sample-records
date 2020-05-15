import React, { Component } from 'react';
import {Link} from "react-router-dom";
import SimpleTooltip from "./SimpleTooltip";

class SessionIconsNav extends Component {

    constructor(props) {
        super(props);
        this.state = { auth: this.props.auth }
    }

    render() {
        return (
                this.state.auth === "true" ?
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
        );
    }
}
export default SessionIconsNav;