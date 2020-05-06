import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcumb";
import BoxArea from "../components/BoxArea";
import {Link, Redirect} from "react-router-dom";
import Loading from "../components/Loading";

class Login extends Component {

    state = {
        email: '',
        password: '',
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
                console.log(data);
                if (data.hasOwnProperty('success')){
                    this.setState({ success:data.success, message:data.message, errors: data.errors, submited: true, sending:false });
                    let user = document.querySelector('.js-user-rating');
                    user.setAttribute('data-is-authenticated','true');
                }else
                    this.setState({ succes: false, message: "Email o contraseña incorrectos", errors: [], submited: true, sending: false })
            });
    }

    render() {
        return (
            <div className={"bg-sr"}>
                <Title title={"SR - LOGIN"}/>
                <Header/>
                <Breadcrumb title={"INICIAR SESIÓN"}/>

                <div className="container section-padding-100">
                    <BoxArea>
                        <h3>¡Bienvenido!</h3>
                        {
                            this.state.sending ?
                                <div>
                                    <h5 className="text-info">Enviando...</h5>
                                    <Loading/>
                                </div>
                                :
                                <span/>
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
export default Login;