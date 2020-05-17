import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcumb";
import BoxArea from "../components/BoxArea";
import Loading from "../components/Loading";
import {Link, Redirect} from "react-router-dom";

class Register extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        sending: false,
        submited: false,
        message: '',
        success: false,
        errors: []
    }

    handleSubmit = (e) => {
        this.setState( { sending:false } )
        e.preventDefault();
        // Get form data
        const name_value = document.getElementById("name").value;
        const email_value = document.getElementById("email").value;
        const password_value = document.getElementById("password").value;

        this.setState( { sending:true } )
        // Prepare the post call
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name_value, email: email_value, password: password_value })
        };

        // Make the Post call
        fetch("/api/v1.0/user/register", requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({ success:data.success, message:data.message, errors: data.error.errors, submited: true, sending:false });
            });
    }

    getErrors = (name_form) => {

        const errors = this.state.errors !== undefined ? this.state.errors : [];
        if (errors.length === 0)
            return '';

        let message = '';
        switch (name_form) {
            case "name":
                message = errors.hasOwnProperty('name') ? <p className={"text-danger"}>{errors.name}</p>:message;break;
            case "email":
                message = errors.hasOwnProperty('email') ? <p className={"text-danger"}>{errors.email}</p>:message;break;
            case "password":
                message = errors.hasOwnProperty('password') ? <p className={"text-danger"}>{errors.password}</p>:message;break;
        }
        return message;
    }


    render() {
        return (
            <div>
                <Title title={"SR - INICIO"}/>
                <Header/>
                <Breadcrumb title={"REGISTRARSE"}/>

                <div className="container section-padding-100">
                    <BoxArea>
                        <h3>¡Únete a la família!</h3>
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
                                    { this.getErrors('name') }
                                    <label htmlFor="exampleInputName">Nombre</label>
                                    <input type="text" className="form-control" id="name"
                                           placeholder="Nombre" name={"name"}/>
                                </div>
                                <div className="form-group login-group">
                                    { this.getErrors('email') }
                                    <label htmlFor="exampleInputEmail1">Email</label>
                                    <input type="email" className="form-control" id="email"
                                           aria-describedby="emailHelp" name={"email"} placeholder="tucorreo@example.com"/>
                                    <small id="emailHelp" className="form-text text-muted"><i
                                        className="fa fa-lock mr-2"/>Nunca compartiremos tu información privada.</small>
                                </div>
                                <div className="form-group login-group">
                                    { this.getErrors('password') }
                                    <label htmlFor="exampleInputPassword1">Contraseña</label>
                                    <input type="password" className="form-control" id="password"
                                           placeholder="Contraseña" name={"password"}/>
                                </div>
                                <button type="submit" className="btn btn-primary btn-primary-sr mt-3 bg-primary-color">Crear cuenta
                                </button>
                            </form>
                        </div>
                        <hr/>
                        <p className="text-muted">¿Ya estás registrado?</p>
                        <Link to={'/login'}>
                            <h5>¡Inicia sesión aquí!</h5>
                        </Link>
                    </BoxArea>
                </div>
                <Footer/>
            </div>
        );
    }
}
export default Register;