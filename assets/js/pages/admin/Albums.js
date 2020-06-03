import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Header from "../../components/admin/Header";
import Pagination from "react-js-pagination";
import Loading from "../../components/public/Loading";

class Albums extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        loading: true,
        items: [],
        artists: [],
        token: '',
        total_albums: [],
        active_page : 1,
        albums_per_page: 5,
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
            this.getAlbums();
            this.getToken();
            this.getArtists();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getAlbums = () => {
        axios.get('/api/v1.0/album').then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { items: res.data.results, total_albums: res.data.results, loading: false } );
            } else {
                <Redirect to={'error404'}/>
            }

        })
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

                this.setState({artists: artists, loading: false});
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

            // Filter albums searching in his name and artist alias
            const search_results = this.state.items.filter( (album) => {
                let album_slug = album.name + album.artist.alias;
                return album_slug.toLowerCase().indexOf(search_request) !== -1;
            } )
            this.setState( {items: search_results} )
        } else {
            // if search value is empty reset products
            this.setState( { items: this.state.total_albums } )
        }

    }

    orderByNewest = () => {
        const newest = this.state.items.sort( function compare( a, b ) {
            if ( new Date(a.created_at.date) > new Date(b.created_at.date) ){
                return -1;
            }
            if ( new Date(a.created_at.date) < new Date(b.created_at.date) ){
                return 1;
            }
            return 0;
        } );
        this.setState( { items : newest, active_page: 1 } );
    }

    orderByOldest = () => {
        const oldest = this.state.items.sort( function compare( a, b ) {
            if ( new Date(a.created_at.date) < new Date(b.created_at.date) ){
                return -1;
            }
            if ( new Date(a.created_at.date) > new Date(b.created_at.date) ){
                return 1;
            }
            return 0;
        } );
        this.setState( { items : oldest, active_page: 1 } );
    }

    // Set how many items show per page
    handleItemsPerPage = (e) => {
        const num_per_page = parseInt(e.target.value);
        this.setState( { albums_per_page: num_per_page, active_page: 1 } );
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

            let {total_albums} = this.state;

            axios.delete(`/api/v1.0/album/delete/${id}`, { data: { token: token } }).then(res => {
                if (res.data.success === true) {
                    total_albums = total_albums.filter(function( item ) {
                        return item.id !== parseInt(id);
                    });
                    this.setState({ total_albums: total_albums, items: total_albums ,message: 'Álbum eliminado' });
                }
            }).catch(error => {
                this.setState( { message: "No se pudo borrar el album" } )
            });
        }
    }

    /* PAGE WHERE SHOWS ALL ITEMS */
    _renderIndex = () => {
        const { active_page, albums_per_page, items, message} = this.state;

        // Logic for pagination
        const indexLastEvent = active_page * albums_per_page;
        const indexFirstEvent = indexLastEvent - albums_per_page;
        const currentAlbums = items.slice(indexFirstEvent, indexLastEvent);

        return (
            <div className={"row"}>
                <div className="card shadow mb-4 w-100">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-sr">Todos los álbunes</h6>
                        {
                            message !== '' ?
                                <h5 className={"text-info"}>{message}</h5>
                                :
                                null
                        }
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <div className="row">
                                <div className="col-sm-12 col-md-3">
                                    <div className="quantity_albums" id="quantity_items">
                                        <label>Mostrar
                                            <select name="quantity_items" aria-controls="dataTable"
                                                    className="custom-select custom-select-sm form-control form-control-sm"
                                                    onChange={this.handleItemsPerPage}>
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                            </select> álbunes
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
                                            onClick={() => this.setState({section:"new"}) }>Crear álbum</button>
                                </div>
                            </div>
                            <table className="table table-bordered" id="dataTable" width={100}
                                   cellSpacing="0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Duracion</th>
                                    <th>Fecha lanzamineto</th>
                                    <th>Artista</th>
                                    <th>Imagen álbum</th>
                                    <th>Creado el dia</th>
                                    <th>Actualizado el dia</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tfoot>
                                </tfoot>
                                <tbody>
                                {
                                    currentAlbums.map( ( album,idx ) =>{

                                        const released_at_day = new Date(album.released_at.date).getDate();
                                        const released_at_month = new Date(album.released_at.date).getMonth();
                                        const released_at_year = new Date(album.released_at.date).getFullYear();

                                        const created_at_day = new Date(album.created_at.date).getDate();
                                        const created_at_month = new Date(album.created_at.date).getMonth();
                                        const created_at_year = new Date(album.created_at.date).getFullYear();

                                        const updated_at_day = new Date(album.updated_at.date).getDate();
                                        const updated_at_month = new Date(album.updated_at.date).getMonth();
                                        const updated_at_year = new Date(album.updated_at.date).getFullYear();

                                        return (
                                            <tr key={idx} className={"row-sr"}>
                                                <td>{idx+1+albums_per_page*(active_page-1)}</td>
                                                <td>{album.name}</td>
                                                <td>{album.price}</td>
                                                <td>{album.duration}</td>
                                                <td>{released_at_day+"-"+released_at_month+"-"+released_at_year}</td>
                                                <td><Link to={`/admin/artistas/${album.artist.alias}`}>{album.artist.alias}</Link></td>
                                                <td><img src={album.img_name} alt={"No se ha encontrado la imagen"}
                                                         className="img-thumbnail" width={300}/></td>
                                                <td>{created_at_day+"-"+created_at_month+"-"+created_at_year}</td>
                                                <td>{updated_at_day+"-"+updated_at_month+"-"+updated_at_year}</td>

                                                <td>
                                                    <Link to={`/admin/albunes/${album.id}`} className={"font-weight-bolder"}>
                                                        <button className="btn btn-primary d-block mb-2">Ver</button>
                                                    </Link>
                                                    <button className={"btn btn-danger"}
                                                            onClick={this.handleDelete.bind(this,album.id)}>Borrar</button>
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
                                    itemsCountPerPage={albums_per_page}
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

    /* PAGE TO CREATE A ITEM */
    _renderNew = () => {
        const { errors, artists } = this.state

        return (
            <div className={"row"}>
                <div className="card shadow mb-4 w-100">
                    <div className="card-header py-3">
                        <h5 className="m-0 font-weight-bold text-sr">Crear álbum</h5>
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
                                        <label htmlFor="price" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Precio
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
                                        <label htmlFor="duration" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Duración
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('duration') ?
                                                <p className={"text-danger"}>{this.state.errors.duration}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="duration" name="duration"
                                                   className="form-control here"
                                                   type="number" step="0.01"/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="released_at" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Fecha lanzamiento
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('released_at') ?
                                                <p className={"text-danger"}>{this.state.errors.released_at}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="released_at" name="released_at"
                                                   className="form-control here"
                                                   type="date"/>
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
                                                    className="btn btn-success">Crear álbum
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

    /* SUBMIT FORM */
    handleCreate = (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const artist = document.querySelector('#artist').value;
        const price = document.querySelector('#price').value;
        const duration = document.querySelector('#duration').value;
        const released_at = document.querySelector('#released_at').value;
        const img = document.querySelector('#img').files[0];
        const {token} = this.state;

        let { total_albums } = this.state;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, artist: artist, price: price, duration: duration, released_at: released_at, token: token })
        };

        this.setState( { sending: true } )

        fetch('/api/v1.0/album/new', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    let album = data.results;

                    // If image is submited too send it, if not update state
                    if (img !== undefined){
                        const formData = new FormData();
                        formData.append('img',img);

                        // Make the API call
                        axios.post(`/api/v1.0/album/upload-img/${album.id}`, formData, {})
                            .then(res=> {
                                if (res.data.success){
                                    // Get new album
                                    album = res.data.results;
                                    // Update albums list
                                    total_albums.unshift(album);

                                    this.setState({ total_albums:total_albums, items: total_albums, submited: true,
                                        message:"¡Álbum creado!",success: true,section: "index", sending: false })
                                }else
                                    this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                            } )
                            .catch(e=>{
                                let {errors} = this.state;
                                errors.cant_upload_img = "No se ha podido subir la imagen";
                                this.setState({ success: false, errors: errors, submited: true, sending: false }) })

                    }// Image no uploaded, update state
                    else{
                        // Get new album
                        album = data.results;
                        // Update albums list
                        total_albums.unshift(album);
                        this.setState({ total_albums:total_albums, items: total_albums, submited: true, success: true, message:"¡Álbum creado!",
                            section: "index", sending: false })
                    }
                }else
                    this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            }).catch(e=>{
                console.log(e)
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
                                <h1 className="h3 mb-0 text-gray-800">Álbunes</h1>
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

export default Albums;