import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcumb";
import BoxArea from "../components/BoxArea";
import Loading from "../components/Loading";

class Contact extends Component{

    state = {
        sending: false,
        success: false,
        message: '',
        errors:[],
        submited: false
    }

    handleSubmit = (e) => {
        this.setState( { sending:false } )
        e.preventDefault();
        // Get form data
        const name_value = document.getElementById("name").value;
        const email_value = document.getElementById("email").value;
        const subject_value = document.getElementById("subject").value;
        const message_value = document.getElementById("message").value;

        this.setState( { sending:true } )
        // Prepare the post call
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name_value, email: email_value, subject: subject_value, message: message_value })
        };

        // Make the Post call
        fetch("/api/v1.0/user/contact", requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({ success:data.success, message:data.message, errors: data.errors, submited: true, sending:false })
            });
    }
    
    getErrors = (name_form) => {
        const errors = this.state.errors;
        if (errors.length === 0)
            return '';

        let message = '';
        switch (name_form) {
            case "name":
                message = errors[0].hasOwnProperty('empty_name') ? <p className={"text-danger message-form"}>{errors[0].empty_name}</p>:message;break;
            case "email":
                message = errors[0].hasOwnProperty('empty_email') ? <p className={"text-danger message-form"}>{errors[0].empty_email}</p>:message;
                message = errors[0].hasOwnProperty('not_email') ? <p className={"text-danger message-form"}>{errors[0].not_email}</p>:message;break;
            case "subject":
                message = errors[0].hasOwnProperty('empty_subject') ? <p className={"text-danger message-form"}>{errors[0].empty_subject}</p>:message;break;
            case "message":
                message = errors[0].hasOwnProperty('empty_message') ? <p className={"text-danger message-form"}>{errors[0].empty_message}</p>:message;break;
        }
        return message;
    }



    render () {
        return(
            <div>
                <Title title={"SR - CONTACTO"}/>
                <Header active={"contact"}/>
                <Breadcrumb title={"¡Contáctanos!"} p_text={"¿Alguna duda?"}/>

                <div className="container section-padding-100">
                    <BoxArea>
                        <h3>¡Envianos tu pregunta!</h3>
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
                                <h5 className={"alert-success"}>{this.state.message}</h5>
                                :
                                <h5 className={"alert-danger"}>{this.state.message}</h5>
                        }
                        <form onSubmit={this.handleSubmit} method="post">
                            <div className="row contact">
                                <div className="col-md-6 col-lg-6">
                                    <div className="form-group">
                                        { this.getErrors('name') }
                                        <input type="text" className="contact-form form-control" name={"name"} id="name" placeholder="Nombre"/>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6">
                                    <div className="form-group">
                                        { this.getErrors('email') }
                                        <input type="email"  className="contact-form form-control" name={"email"} id="email" placeholder="E-mail"/>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        { this.getErrors('subject') }
                                        <input type="text"  className="contact-form form-control" name={"subject"} id="subject" placeholder="Asunto"/>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        { this.getErrors('message') }
                                        <textarea className="contact-form  form-control"  name="message" id="message" cols="30" rows="10"
                                          placeholder="Mensaje"/>
                                    </div>
                                </div>
                                <div className="col-12 text-center">
                                    <button className="btn btn-primary btn-primary-sr mt-3" type="submit">Enviar <i
                                        className="fa fa-angle-double-right"/></button>
                                </div>
                            </div>
                        </form>
                    </BoxArea>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Contact;