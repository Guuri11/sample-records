import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";

class Error404 extends Component {

    constructor(props) {
        super(props);

    }

    handleSubmit = (e) => {
        e.preventDefault();

        const search = document.querySelector('#searchErrorPage').value;
        console.log(search);
        this.props.history.push(`/search?s=${search}`);
    }

    render() {
        return (
            <div>
                <Title title={"No se encontró la página"}/>
                <Header/>
                <div className={"container mt-5"}>
                    <h1 className={"error-code"}>404</h1>
                    <h2 className={"error-message"}>Lo sentimos pero no existe la página solicitada.</h2>
                    <h2 className={"error-message"}>¿Por qué no intenta buscar algo y nosotros le ayudamos? 🕵️‍♂️😊</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="input-group md-form form-sm form-1 pl-0">
                            <button className="btn btn-primary">
                                <span className="fa fa-search"/>
                            </button>
                            <input className="form-control my-0 py-1" id="searchErrorPage" type="text" placeholder={"Escriba aquí lo que está buscando"} aria-label="Search"/>
                        </div>
                    </form>
                </div>
                <Footer/>
            </div>
        );
    }
}
export default Error404;