import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class Event extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        event: {},
        artists: [],
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
            const {event} = this.props.match.params;
            this.getEvent(event);
            this.getArtists();
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

    getEvent( id ) {
        axios.get(`/api/v1.0/event/${id}`).then(res => {
            if (res.data.success === true) {
                const event = res.data.results;

                this.setState({event: event, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    getArtists = () =>  {
        axios.get(`/api/v1.0/artist`).then(res => {
            if (res.data.success === true) {
                const artists = res.data.results;

                this.setState({artists: artists, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    _renderInfo = (event) => {

        const date_at_day = new Date(event.date.date).getDate();
        const date_at_month = new Date(event.date.date).getMonth();
        const date_at_year = new Date(event.date.date).getFullYear();

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
                        <label htmlFor="name" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Nombre
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {event.name}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="artist" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Artista
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {event.artist.alias}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="place" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Lugar
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {event.place}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="city" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Ciudad
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {event.city !== null ? event.city:'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="country" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            País
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {event.country}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="date" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Fecha de evento
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {date_at_day+"-"+date_at_month+"-"+date_at_year}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="prefix_serial_number" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Prefijo de nº serie
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {event.prefix_serial_number}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="ticket_quantity" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Cantidad de tickets
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {event.ticket_quantity}
                        </div>
                    </div>


                    <div className="form-group row">
                        <label htmlFor="img" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Imágen
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            <img src={event.img_name} alt={"Imagen no disponible"} width={75} className={"img img-fluid"}/>
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, event) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (event, artists) => {

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
                            <label htmlFor="name" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Nombre
                            </label>
                            {
                                this.state.errors.hasOwnProperty('name') ?
                                    <p className={"text-danger"}>{this.state.errors.name}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="name" name="name" defaultValue={event.name}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="artist" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Artista
                            </label>
                            {
                                this.state.errors.hasOwnProperty('artist') ?
                                    <p className={"text-danger"}>{this.state.errors.artist}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select name={"artist"} id={"artist"} defaultValue={''}>
                                    <option value={''}/>
                                    {
                                        artists.map( (artist, idx) => {
                                            return (
                                                <option key={idx} value={artist.id}>{artist.alias}</option>
                                            )
                                        } )
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="place" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Lugar
                            </label>
                            {
                                this.state.errors.hasOwnProperty('place') ?
                                    <p className={"text-danger"}>{this.state.errors.place}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="place" name="place" defaultValue={event.place}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="city" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Ciudad
                            </label>
                            {
                                this.state.errors.hasOwnProperty('city') ?
                                    <p className={"text-danger"}>{this.state.errors.city}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="city" name="city" defaultValue={event.city !== null ? event.city:''}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="country" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                País
                            </label>
                            {
                                this.state.errors.hasOwnProperty('countr') ?
                                    <p className={"text-danger"}>{this.state.errors.country}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="country" name="country" defaultValue={event.country}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="date" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Fecha
                            </label>
                            {
                                this.state.errors.hasOwnProperty('date') ?
                                    <p className={"text-danger"}>{this.state.errors.date}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="date" name="date"
                                       className="form-control here"
                                       type="date"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="prefix_serial_number" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Prefijo de nº serie
                            </label>
                            {
                                this.state.errors.hasOwnProperty('prefix_serial_number') ?
                                    <p className={"text-danger"}>{this.state.errors.prefix_serial_number}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="prefix_serial_number" name="prefix_serial_number" defaultValue={event.prefix_serial_number}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>


                        <div className="form-group row">
                            <label htmlFor="ticket_quantity" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Nº entradas
                            </label>
                            {
                                this.state.errors.hasOwnProperty('ticket_quantity') ?
                                    <p className={"text-danger"}>{this.state.errors.ticket_quantity}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="ticket_quantity" name="ticket_quantity" defaultValue={event.ticket_quantity}
                                       className="form-control here"
                                       type="number" step="0.01"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="img" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Imagen
                            </label>
                            {
                                this.state.errors.hasOwnProperty('cant_upload_img') ?
                                    <p className={"text-danger"}>{this.state.errors.cant_upload_img}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="img" name="img"
                                       className="form-control here"
                                       type="file"/>
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
    handleDelete = (event) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {
            axios.delete(`/api/v1.0/event/delete/${event.id}`).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/eventos/',
                            state: {delete_success: "Evento eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar el evento"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar el evento"} } )
            });
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const artist = document.querySelector('#artist').value;
        const place = document.querySelector('#place').value;
        const city = document.querySelector('#city').value;
        const country = document.querySelector('#country').value;
        const date = document.querySelector('#date').value;
        const prefix_serial_number = document.querySelector('#prefix_serial_number').value;
        const ticket_quantity = document.querySelector('#ticket_quantity').value;
        const img = document.querySelector('#img').files[0];
        const {event} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, artist: artist, place: place, city: city, country: country,
                                        date: date, prefix_serial_number: prefix_serial_number, ticket_quantity: ticket_quantity})
        };

        this.setState( { sending: true } )

        // If image is edited send it, if not only send the rest of data
        if (img !== undefined){
            const formData = new FormData();
            formData.append('img',img);

            // Make the API call
            fetch(`/api/v1.0/event/edit/${event.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ event:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{});

            // Make the API call
            axios.post(`/api/v1.0/event/upload-img/${event.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ event:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_img = "No se ha podido subir la imagen";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } else {
            fetch(`/api/v1.0/event/edit/${event.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ event:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{});
        }

    }



    render() {
        const { event, artists, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Evento {event.name}</h1>
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
                                                        this._renderInfo(event) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(event,artists) : null
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

export default Event;