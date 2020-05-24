import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import Breadcrumb from "../../components/public/Breadcumb";
import BoxArea from "../../components/public/BoxArea";
import {Link, Redirect, withRouter} from "react-router-dom";
import Loading from "../../components/public/Loading";

class Login extends Component {

    state = {
        email: '',
        password: '',
        success: false,
        sending: false,
        submited: false
    }

    handleSubmit = (e) => {
        this.setState( { sending:false, submited: false } )
        e.preventDefault();
        // Get form data
        const email_value = document.getElementById("username").value;
        const password_value = document.getElementById("password").value;

        this.setState( { sending:true } )
        // Prepare the post call
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: email_value, password: password_value })
        };

        // Make the Post call
        fetch("/api/v1.0/user/login", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.hasOwnProperty('success')){
                    sessionStorage.setItem('auth',true);
                    this.setState({ success:data.success, message:data.message, errors: data.errors, submited: true, sending:false });
                }else
                    this.setState({ success: false, message: "Email o contraseña incorrectos", errors: [], submited: true, sending: false })
            });
    }

    render() {
        return (
            <div>
                <Title title={"SR - LOGIN"}/>
                <Header/>
                <Breadcrumb title={"INICIAR SESIÓN"}/>

                <div className="container section-padding-100">
                    <BoxArea>
                        <h3>¡Bienvenido!</h3>
                        {
                            // Redirect message if comes from a unauthorized page
                            this.props.location.state !== undefined ?
                                <h4 className={"text-info"}>{this.props.location.state.redirect_message}</h4>
                                :
                                null
                        }
                        {
                            this.state.sending ?
                                <div>
                                    <h5 className="text-info">Enviando...</h5>
                                    <Loading/>
                                </div>
                                :
                                null
                        }
                        {
                            this.state.submited && this.state.success ?
                                <Redirect to={'/perfil'}/>
                                :
                                <h5 className={"alert-danger"}>{this.state.message}</h5>
                        }
                        <div className="login-form">
                            <form onSubmit={this.handleSubmit} method="post">
                                <div className="form-group login-group">
                                    <label htmlFor="exampleInputEmail1">Email</label>
                                    <input type="email" className="form-control" id="username"
                                           aria-describedby="emailHelp" name={"username"} placeholder="example@example.com"/>
                                        <small id="emailHelp" className="form-text text-muted"><i
                                            className="fa fa-lock mr-2"/>Nunca compartiremos tu información privada.</small>
                                </div>
                                <div className="form-group login-group">
                                    <label htmlFor="exampleInputPassword1">Contraseña</label>
                                    <input type="password" className="form-control" id="password"
                                           placeholder="Contraseña" name={"password"}/>
                                </div>
                                <button type="submit" className="btn btn-primary btn-primary-sr mt-3 bg-primary-color">Iniciar sesión
                                </button>
                            </form>
                        </div>
                        <hr/>
                        <p className="text-muted">¿No tienes cuenta?</p>
                        <Link to={'/registrarse'}>
                            <h5>¡Regístrate aquí!</h5>
                        </Link>
                    </BoxArea>
                </div>
                <Footer/>
            </div>
        );
    }
}
export default withRouter(Login);