import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Header from "../../components/admin/Header";
import Pagination from "react-js-pagination";
import Loading from "../../components/public/Loading";

class Events extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        loading: true,
        items: [],
        token: '',
        total_items: [],
        artists: [],
        active_page : 1,
        items_per_page: 5,
        message: this.props.location.state ? this.props.location.state.delete_success: '',
        section: "index",
        submited: false,
        success: false,
        sending: false,
        errors: {},
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getArtists();
            this.getToken();
            this.getEvents();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getEvents = () => {
        axios.get('/api/v1.0/event').then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { items: res.data.results, total_items: res.data.results, loading: false } );
            } else {
                <Redirect to={'error404'}/>
            }

        }).catch(e =>{})
    }

    getToken() {
        axios.get('/api/v1.0/user/token').then(res => {
            if (res.data.success === true) {
                const token = res.data.results;

                this.setState({token: token});
            }
        }).catch();
    }


    getArtists = () =>  {
        axios.get(`/api/v1.0/artist`).then(res => {
            if (res.data.success === true) {
                const artists = res.data.results;

                this.setState({artists: artists});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    // Filter by search
    handleSearch = (e) => {
        // Get input value
        const search_request = e.target.value.toLowerCase();
        if (search_request !== ""){

            // Filter events searching in his name and artist alias and city
            const search_results = this.state.items.filter( (event) => {
                let event_slug = event.name + event.artist.alias + event.city;
                return event_slug.toLowerCase().indexOf(search_request) !== -1;
            } )
            this.setState( {items: search_results} )
        } else {
            // if search value is empty reset products
            this.setState( { items: this.state.total_items } )
        }

    }

    orderByNewest = () => {
        const newest = this.state.items.sort( function compare( a, b ) {
            if ( new Date(a.date.date) > new Date(b.date.date) ){
                return -1;
            }
            if ( new Date(a.date.date) < new Date(b.date.date) ){
                return 1;
            }
            return 0;
        } );
        this.setState( { items : newest, active_page: 1 } );
    }

    orderByOldest = () => {
        const oldest = this.state.items.sort( function compare( a, b ) {
            if ( new Date(a.date.date) < new Date(b.date.date) ){
                return -1;
            }
            if ( new Date(a.date.date) > new Date(b.date.date) ){
                return 1;
            }
            return 0;
        } );
        this.setState( { items : oldest, active_page: 1 } );
    }

    // Set how many items show per page
    handleItemsPerPage = (e) => {
        const num_per_page = parseInt(e.target.value);
        this.setState( { items_per_page: num_per_page, active_page: 1 } );
    }

    /* SET CURRENT PAGE */
    handlePageChange(pageNumber) {
        this.setState({active_page: pageNumber});
    }

    /* DELETE CALL */
    handleDelete = (id) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");
        const {token} = this.state;

        if (ans) {

            let {total_items} = this.state;

            axios.delete(`/api/v1.0/event/delete/${id}`, { data: {token: token} }).then(res => {
                if (res.data.success === true) {
                    total_items = total_items.filter(function( item ) {
                        return item.id !== parseInt(id);
                    });
                    this.setState({ total_item: total_items, items: total_items ,message: 'Evento eliminado' });
                }
            }).catch(error => {
                this.setState( { message: "No se pudo borrar el evento" } )
            });
        }
    }

    _renderIndex = () => {

        const { active_page, items_per_page, items, message} = this.state;

        // Logic for pagination
        const indexLastEvent = active_page * items_per_page;
        const indexFirstEvent = indexLastEvent - items_per_page;
        const currentItems = items.slice(indexFirstEvent, indexLastEvent);

        return (
            <div className={"row"}>
                <div className="card shadow mb-4 w-100">
                    <div className="card-header py-3">
                        <h5 className="m-0 font-weight-bold text-sr">Todos los eventos</h5>
                        {
                            message !== '' ?
                                <h6 className={"text-info"}>{message}</h6>
                                :
                                null
                        }
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <div className="row">
                                <div className="col-sm-12 col-md-3">
                                    <div className="quantity_items" id="quantity_items">
                                        <label>Mostrar
                                            <select name="quantity_items" aria-controls="dataTable"
                                                    className="custom-select custom-select-sm form-control form-control-sm"
                                                    onChange={this.handleItemsPerPage}>
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                            </select> eventos
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3">
                                    <div className="items_order" id="items_order">
                                        <label>Ordenar por
                                            <select name="items_order" aria-controls="dataTable"
                                                    className="custom-select custom-select-sm form-control form-control-sm">
                                                <option value="newest" onClick={this.orderByNewest}>Más nuevos</option>
                                                <option value="oldest" onClick={this.orderByOldest}>Más antiguos</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3">
                                    <div id="dataTable_filter" className="dataTables_filter">
                                        <label>Buscar:<input type="search"
                                                             className="form-control form-control-sm"
                                                             placeholder=""
                                                             aria-controls="dataTable"
                                                             onChange={this.handleSearch}/></label>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-3">
                                    <button className="btn btn-primary btn-success mt-3"
                                            onClick={() => this.setState({section:"new"}) }>Crear evento</button>
                                </div>
                            </div>
                            <table className="table table-bordered" id="dataTable" width={100}
                                   cellSpacing="0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Artista</th>
                                    <th>Lugar</th>
                                    <th>Ciudad</th>
                                    <th>País</th>
                                    <th>Fecha de evento</th>
                                    <th>Prefijo de serie</th>
                                    <th>Entradas disponibles</th>
                                    <th>Imagen</th>
                                    <th>Creado el dia</th>
                                    <th>Actualizado el dia</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tfoot>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Artista</th>
                                    <th>Lugar</th>
                                    <th>Ciudad</th>
                                    <th>País</th>
                                    <th>Fecha de evento</th>
                                    <th>Prefijo de serie</th>
                                    <th>Entradas disponibles</th>
                                    <th>Imagen</th>
                                    <th>Creado el dia</th>
                                    <th>Actualizado el dia</th>
                                    <th>Acciones</th>
                                </tr>
                                </tfoot>
                                <tbody>
                                {
                                    currentItems.map( ( item,idx ) =>{

                                        const date_at_day = new Date(item.date.date).getDate();
                                        const date_at_month = new Date(item.date.date).getMonth();
                                        const date_at_year = new Date(item.date.date).getFullYear();

                                        const created_at_day = new Date(item.created_at.date).getDate();
                                        const created_at_month = new Date(item.created_at.date).getMonth();
                                        const created_at_year = new Date(item.created_at.date).getFullYear();

                                        const updated_at_day = new Date(item.updated_at.date).getDate();
                                        const updated_at_month = new Date(item.updated_at.date).getMonth();
                                        const updated_at_year = new Date(item.updated_at.date).getFullYear();

                                        return (
                                            <tr key={idx} className={"row-sr"}>
                                                <td>
                                                    {idx+1+items_per_page*(active_page-1)}
                                                </td>
                                                <td>{item.name}</td>
                                                <td><Link to={`/admin/artistas/${item.artist.id}`}>{item.artist.alias} </Link></td>
                                                <td>{item.place}</td>
                                                <td>{item.city !== null ? item.city:''}</td>
                                                <td>{item.country}</td>
                                                <td>{date_at_day+"-"+date_at_month+"-"+date_at_year}</td>
                                                <td>{item.prefix_serial_number}</td>
                                                <td>{item.ticket_quantity}</td>
                                                <td><img src={item.img_name} alt={"No se ha encontrado la imagen"}
                                                         className="img-thumbnail" width={300}/></td>
                                                <td>{created_at_day+"-"+created_at_month+"-"+created_at_year}</td>
                                                <td>{updated_at_day+"-"+updated_at_month+"-"+updated_at_year}</td>

                                                <td>
                                                    <Link to={`/admin/eventos/${item.id}`} className={"font-weight-bolder"}>
                                                        <button className="btn btn-primary d-block mb-2">Ver</button>
                                                    </Link>
                                                    <button className={"btn btn-danger"}
                                                            onClick={this.handleDelete.bind(this,item.id)}>Borrar</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                            <div className={"row"}>
                                <Pagination
                                    activePage={active_page}
                                    itemsCountPerPage={items_per_page}
                                    totalItemsCount={items.length}
                                    pageRangeDisplayed={4}
                                    onChange={this.handlePageChange.bind(this)}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    _renderNew = () => {
        const { errors, artists } = this.state

        return (
            <div className={"row"}>
                <div className="card shadow mb-4 w-100">
                    <div className="card-header py-3">
                        <h5 className="m-0 font-weight-bold text-sr">Crear evento</h5>
                        {
                            errors.hasOwnProperty('cant_delete') ?
                                <h6 className={"text-danger"}>{errors.cant_delete}</h6> : null
                        }
                    </div>
                    <div className="card-body">
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
                                            <p className={"text-danger"}>¡No se pudo crear!</p>
                                        :
                                        null
                                }
                            </div>

                            <div className="col-md-12">
                                <form onSubmit={this.handleCreate}>
                                    <div className="form-group row">
                                        <label htmlFor="name" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Nombre
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('name') ?
                                                <p className={"text-danger"}>{this.state.errors.name}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="name" name="name"
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
                                            <select name={"artist"} id={"artist"}>
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
                                            <input id="place" name="place"
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
                                            <input id="city" name="city"
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
                                            <input id="country" name="country"
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
                                            <input id="prefix_serial_number" name="prefix_serial_number"
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
                                            <input id="ticket_quantity" name="ticket_quantity"
                                                   className="form-control here" defaultValue={"0"}
                                                   type="number" step="0.01"/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="price" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Precio de entrada
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('price') ?
                                                <p className={"text-danger"}>{this.state.errors.price}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="price" name="price"
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
                                                    className="btn btn-success">Crear evento
                                            </button>
                                            <button className="btn btn-primary ml-2"
                                                    onClick={() => this.setState({section:"index"})}>Volver atrás
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    handleCreate = (e) => {
        e.preventDefault();

        // Get form data
        const name = document.querySelector('#name').value;
        const artist = document.querySelector('#artist').value;
        const place = document.querySelector('#place').value;
        const city = document.querySelector('#city').value;
        const country = document.querySelector('#country').value;
        const date = document.querySelector('#date').value;
        const prefix_serial_number = document.querySelector('#prefix_serial_number').value;
        const ticket_quantity = document.querySelector('#ticket_quantity').value;
        const price = document.querySelector('#price').value;
        const {token} = this.state;
        const img = document.querySelector('#img').files[0];

        let {total_items} = this.state;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, artist: artist, place: place, city: city, country: country,
                date: date, prefix_serial_number: prefix_serial_number, ticket_quantity: ticket_quantity, price: price, token: token})
        };

        this.setState( { sending: true } )

        fetch('/api/v1.0/event/new', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    let event = data.results;

                    // If image is submited too send it, if not update state
                    if (img !== undefined){
                        const formData = new FormData();
                        formData.append('img',img);

                        // Make the API call
                        axios.post(`/api/v1.0/event/upload-img/${event.id}`, formData, {})
                            .then(res=> {
                                if (res.data.success){
                                    // Get new event
                                    event = res.data.results;
                                    // Update events list
                                    total_items.unshift(event);

                                    this.setState({ total_items:total_items, items: total_items, submited: true,
                                        message:"¡Evento creado!",success: true,section: "index", sending: false })
                                }else
                                    this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                            } )
                            .catch(e=>{
                                let {errors} = this.state;
                                errors.cant_upload_img = "No se ha podido subir la imagen";
                                this.setState({ success: false, errors: errors, submited: true, sending: false }) })

                    }// Image no uploaded, update state
                    else{
                        // Get new event
                        event = data.results;
                        // Update events list
                        total_items.unshift(event);
                        this.setState({ total_items:total_items, items: total_items, submited: true, success: true, message:"¡Evento creado!",
                            section: "index", sending: false })
                    }
                }else
                    this.setState({ success: false, errors: data.error.errors ? data.error.errors:{} , submited: true, sending: false })
            }).catch(e=>{
            this.setState({ success: false, errors: data.error.errors ? data.error.errors:{} , submited: true, sending: false })
        });

    }



    render() {
        const { loading, section} = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Eventos</h1>
                            </div>
                            {
                                loading ?
                                    null
                                    :
                                    section === "index" ? this._renderIndex()
                                        :
                                        section === "new" ? this._renderNew() : null
                            }
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>

        )
    }
}

export default Events;