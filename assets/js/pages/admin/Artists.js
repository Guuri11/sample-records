import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Header from "../../components/admin/Header";
import Pagination from "react-js-pagination";
import Loading from "../../components/public/Loading";

class Artists extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        loading: true,
        artists: [],
        total_artists: [],
        active_page : 1,
        artists_per_page: 10,
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
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getArtists = () => {
        axios.get('/index.php/api/v1.0/artist').then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { artists: res.data.results, total_artists: res.data.results, loading: false } );
            } else {
                <Redirect to={'error404'}/>
            }

        })
    }

    // Filter by search
    handleSearch = (e) => {
        // Get input value
        const search_request = e.target.value.toLowerCase();
        if (search_request !== ""){

            // Filter artists searching in his name and artist alias
            const search_results = this.state.artists.filter( (artist) => {
                let artist_slug = artist.name + artist.alias + artist.surname;
                return artist_slug.toLowerCase().indexOf(search_request) !== -1;
            } )
            this.setState( {artists: search_results} )
        } else {
            // if search value is empty reset products
            this.setState( { artists: this.state.total_artists } )
        }

    }

    orderByNewest = () => {
        const newest = this.state.artists.sort( function compare( a, b ) {
            if ( new Date(a.created_at.date) > new Date(b.created_at.date) ){
                return -1;
            }
            if ( new Date(a.created_at.date) < new Date(b.created_at.date) ){
                return 1;
            }
            return 0;
        } );
        this.setState( { artists : newest, active_page: 1 } );
    }

    orderByOldest = () => {
        const oldest = this.state.artists.sort( function compare( a, b ) {
            if ( new Date(a.created_at.date) < new Date(b.created_at.date) ){
                return -1;
            }
            if ( new Date(a.created_at.date) > new Date(b.created_at.date) ){
                return 1;
            }
            return 0;
        } );
        this.setState( { artists : oldest, active_page: 1 } );
    }

    // Set how many item show per page
    handleItemsPerPage = (e) => {
        const num_per_page = parseInt(e.target.value);
        this.setState( { artists_per_page: num_per_page, active_page: 1 } );
    }

    /* SET CURRENT PAGE */
    handlePageChange(pageNumber) {
        this.setState({active_page: pageNumber});
    }

    /* DELETE CALL */
    handleDelete = (id) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {
            let {total_artists} = this.state;

            axios.delete(`/index.php/api/v1.0/artist/delete/${id}`).then(res => {
                if (res.data.success === true) {
                    total_artists = total_artists.filter(function( item ) {
                        return item.id !== parseInt(id);
                    });
                    this.setState({ total_artists: total_artists, artists: total_artists ,message: 'Artista eliminado' });
                }
            }).catch(error => {
                this.setState( { message: "No se pudo borrar al artista" } )
            });
        }
    }

    _renderIndex = () => {

        const { active_page, artists_per_page, artists, message} = this.state;

        // Logic for pagination
        const indexLastEvent = active_page * artists_per_page;
        const indexFirstEvent = indexLastEvent - artists_per_page;
        const currentArtists = artists.slice(indexFirstEvent, indexLastEvent);

        return (
            <div className={"row"}>
                <div className="card shadow mb-4 w-100">
                    <div className="card-header py-3">
                        <h5 className="m-0 font-weight-bold text-sr">Todos los artistas</h5>
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
                                            </select> artistas
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
                                            onClick={() => this.setState({section:"new"}) }>Crear artista</button>
                                </div>
                            </div>
                            <table className="table table-bordered" id="dataTable" width={100}
                                   cellSpacing="0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Alias</th>
                                    <th>Apellidos</th>
                                    <th>Fecha nacimiento</th>
                                    <th>Procedencia</th>
                                    <th>Bio</th>
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
                                    <th>Alias</th>
                                    <th>Apellidos</th>
                                    <th>Fecha nacimiento</th>
                                    <th>Procedencia</th>
                                    <th>Bio</th>
                                    <th>Imagen</th>
                                    <th>Creado el dia</th>
                                    <th>Actualizado el dia</th>
                                    <th>Acciones</th>
                                </tr>
                                </tfoot>
                                <tbody>
                                {
                                    currentArtists.map( ( artist,idx ) =>{
                                        const birth_day = new Date(artist.birth.date).getDate();
                                        const birth_month = new Date(artist.birth.date).getMonth();
                                        const birth_year = new Date(artist.birth.date).getFullYear();

                                        const created_at_day = new Date(artist.created_at.date).getDate();
                                        const created_at_month = new Date(artist.created_at.date).getMonth();
                                        const created_at_year = new Date(artist.created_at.date).getFullYear();

                                        const updated_at_day = new Date(artist.updated_at.date).getDate();
                                        const updated_at_month = new Date(artist.updated_at.date).getMonth();
                                        const updated_at_year = new Date(artist.updated_at.date).getFullYear();

                                        return (
                                            <tr key={idx} className={"row-sr"}>
                                                <td>{idx+1+artists_per_page*(active_page-1)}</td>
                                                <td>{artist.name}</td>
                                                <td>{artist.alias}</td>
                                                <td>{artist.surname ? artist.surname : ''}</td>
                                                <td>{birth_day+"-"+birth_month+"-"+birth_year}</td>
                                                <td>{artist.is_from}</td>
                                                <td>{artist.bio !== null ? artist.bio:''}</td>
                                                <td>
                                                    <img src={artist.img_name} alt={"No se ha encontrado la imagen"}
                                                         className="img-thumbnail" width={300}/>
                                                </td>
                                                <td>{created_at_day+"-"+created_at_month+"-"+created_at_year}</td>
                                                <td>{updated_at_day+"-"+updated_at_month+"-"+updated_at_year}</td>

                                                <td>
                                                    <Link to={`/admin/artistas/${artist.id}`} className={"font-weight-bolder"}>
                                                        <button className="btn btn-primary d-block mb-2">Ver</button>
                                                    </Link>
                                                    <button className={"btn btn-danger"}
                                                            onClick={this.handleDelete.bind(this,artist.id)}>Borrar</button>
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
                                    itemsCountPerPage={artists_per_page}
                                    totalItemsCount={artists.length}
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
        const { errors } = this.state;
        return (
            <div className={"row"}>
                <div className="card shadow mb-4 w-100">
                    <div className="card-header py-3">
                        <h5 className="m-0 font-weight-bold text-sr">Crear artista</h5>
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
                                        <label htmlFor="surname" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Apellidos
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('surname') ?
                                                <p className={"text-danger"}>{this.state.errors.surname}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="surname" name="surname"
                                                   className="form-control here"
                                                   type="text"/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="alias" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Alias
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('alias') ?
                                                <p className={"text-danger"}>{this.state.errors.alias}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="alias" name="alias"
                                                   className="form-control here"
                                                   type="text"/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="birth" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Fecha de nacimiento
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('birth') ?
                                                <p className={"text-danger"}>{this.state.errors.birth}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="birth" name="birth"
                                                   className="form-control here"
                                                   type="date"/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="is_from" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Providencia
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('is_from') ?
                                                <p className={"text-danger"}>{this.state.errors.surname}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="is_from" name="is_from"
                                                   className="form-control here"
                                                   type="text"/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="bio" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Biografía
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('bio') ?
                                                <p className={"text-danger"}>{this.state.errors.bio}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <textarea id={"bio"} name={"bio"} cols={80} rows={10}/>
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
                                                    className="btn btn-success">Crear artista
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

        const name = document.querySelector('#name').value;
        const surname = document.querySelector('#surname').value;
        const alias = document.querySelector('#alias').value;
        const birth = document.querySelector('#birth').value;
        const is_from = document.querySelector('#is_from').value;
        const bio = document.querySelector('#bio').value;
        const img = document.querySelector('#img').files[0];

        const {total_artists} = this.state;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, surname: surname, alias: alias, birth: birth, is_from: is_from, bio: bio })
        };

        this.setState( { sending: true } )

        fetch('/index.php/api/v1.0/artist/new', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    let artist = data.results;
                    // If image is submited too send it, if not update state
                    if (img !== undefined){
                        const formData = new FormData();
                        formData.append('img',img);

                        // Make the API call
                        axios.post(`/index.php/api/v1.0/artist/upload-img/${artist.id}`, formData, {})
                            .then(res=> {
                                if (res.data.success){
                                    // Get new album
                                    artist = res.data.results;
                                    // Update albums list
                                    total_artists.unshift(artist);

                                    this.setState({ total_artists:total_artists, artists: total_artists, submited: true,
                                        message:"¡Artista creado!",success: true,section: "index", sending: false })
                                }else
                                    this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                            } )
                            .catch(e=>{
                                let {errors} = this.state;
                                errors.cant_upload_img = "No se ha podido subir la imagen";
                                this.setState({ success: false, errors: errors, submited: true, sending: false }) })

                    }else{
                        // Get new album
                        artist = data.results;
                        // Update albums list
                        total_artists.unshift(artist);
                        this.setState({ total_artists:total_artists, artists: total_artists, submited: true,
                            message:"¡Artista creado!",success: true,section: "index", sending: false})
                    }
                }else
                    this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            }).catch(e=>{});
    }


    render() {
        const {loading, section} = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Artistas</h1>
                            </div>
                            {
                                loading ?
                                    null
                                    :
                                    section === "index" ?
                                        this._renderIndex()
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

export default Artists;