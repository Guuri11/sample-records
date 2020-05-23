import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class Ticket extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        ticket: {},
        events: [],
        loading: true,
        section: 'Mostrar',
        submited: false,
        success: false,
        sending: false,
        errors: {},
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted){
            const {ticket} = this.props.match.params;
            this.getTicket(ticket);
            this.getEvents();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    static propTypes = {
        match: PropTypes.shape({
            params:PropTypes.object,
            isExact:PropTypes.bool,
            path:PropTypes.string,
            url: PropTypes.string
        })
    }

    getTicket( id ) {
        axios.get(`/api/v1.0/ticket/${id}`).then(res => {
            if (res.data.success === true) {
                const ticket = res.data.results;

                this.setState({ticket: ticket, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    getEvents = () =>  {
        axios.get(`/api/v1.0/event`).then(res => {
            if (res.data.success === true) {
                const events = res.data.results;

                this.setState({events: events, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    _renderInfo = (ticket) => {

        return (
            <div className="row">
                <div className="col-md-12">
                    {
                        this.state.submited ?
                            this.state.success ?
                                <p className={"text-success"}>¡Actualizado con éxito!</p>
                                :
                                null
                            :
                            null
                    }
                    <div className="form-group row">
                        <label htmlFor="serial_number" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Nº de serie
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {ticket.serial_number}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="price" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Precio
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {ticket.price}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="event" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Event
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {ticket.event.name}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="sold" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Vendido
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {ticket.sold ? "Sí":"No"}
                        </div>
                    </div>

                    <hr/>
                    <div className="form-group row">
                        <div className="col-12 mb-2">
                            <button name="submit" type="submit"
                                    className="btn btn-primary"
                                    onClick={ () => this.setState( { section: "Editar" } ) }>Editar
                            </button>
                            <button name="submit" type="submit"
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, ticket) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (ticket, events) => {

        return (
            <div className="row">
                <div className="col-md-12">
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
                        this.state.submited ?
                            this.state.success ?
                                null
                                :
                                <p className={"text-danger"}>¡No se pudo actualizar!</p>
                            :
                            null
                    }
                </div>

                <div className="col-md-12">
                    <form onSubmit={this.handleUpdate}>
                        <div className="form-group row">
                            <label htmlFor="serial_number" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Nº de serie
                            </label>
                            {
                                this.state.errors.hasOwnProperty('serial_number') ?
                                    <p className={"text-danger"}>{this.state.errors.serial_number}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="serial_number" name="serial_number" defaultValue={ticket.serial_number}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="price" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Precio
                            </label>
                            {
                                this.state.errors.hasOwnProperty('price') ?
                                    <p className={"text-danger"}>{this.state.errors.price}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="price" name="price" defaultValue={ticket.price}
                                       className="form-control here"
                                       type="number"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="artist" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Evento
                            </label>
                            {
                                this.state.errors.hasOwnProperty('event') ?
                                    <p className={"text-danger"}>{this.state.errors.event}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select name={"event"} id={"event"} defaultValue={''}>
                                    <option value={''}/>
                                    {
                                        events.map( (event, idx) => {
                                            return (
                                                <option key={idx} value={event.id}>{event.name}</option>
                                            )
                                        } )
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="sold" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Vendido
                            </label>
                            {
                                this.state.errors.hasOwnProperty('sold') ?
                                    <p className={"text-danger"}>{this.state.errors.sold}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select id={"sold"} name={"sold"} defaultValue={ticket.sold ? "1":"0"}>
                                    <option value={"1"}>Sí</option>
                                    <option value={"0"}>No</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <button name="submit" type="submit"
                                        className="btn btn-success">Actualizar
                                </button>
                                <button className="btn btn-primary ml-2"
                                        onClick={() => this.setState({section:"Mostrar"})}>Volver atrás
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    /* DELETE CALL */
    handleDelete = (ticket) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {


            axios.delete(`/api/v1.0/ticket/delete/${ticket.id}`).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/eventos/entradas/',
                            state: {delete_success: "Ticket eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar el ticket"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar el ticket"} } )
            });
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        const serial_number = document.querySelector('#serial_number').value;
        const event = document.querySelector('#event').value;
        const price = document.querySelector('#price').value;
        const sold = document.querySelector('#sold').value;
        const {ticket} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serial_number: serial_number, event: event, price: price, sold: sold})
        };

        this.setState( { sending: true } )


        fetch(`/api/v1.0/ticket/edit/${ticket.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    this.setState({ ticket:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                }else
                    this.setState({ success: false, errors: data.error.errors ? data.error.errors: data.error.code === 0 ? {serial_number:"Número de serie repetido"}:'',
                        submited: true, sending: false })
            }).catch(e=>{});

    }


    render() {
        const { ticket, events, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Entrada {ticket.serial_number}</h1>
                            </div>
                            {
                                loading ?
                                    null
                                    :
                                    <div className={"row"}>
                                        <div className="card shadow mb-4 w-100">
                                            <div className="card-header py-3">
                                                <h5 className="m-0 font-weight-bold text-sr">{section}</h5>
                                                {
                                                    errors.hasOwnProperty('cant_delete') ?
                                                        <h6 class={"text-danger"}>{errors.cant_delete}</h6> : null
                                                }
                                            </div>
                                            <div className="card-body">
                                                {
                                                    section === "Mostrar" ?
                                                        this._renderInfo(ticket) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(ticket,events) : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        )
    }
}

export default Ticket;