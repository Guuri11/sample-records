import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Header from "../../components/admin/Header";
import Pagination from "react-js-pagination";

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
        message: ''
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
        axios.get('/api/v1.0/artist').then(res => {
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
            const search_results = this.state.artist.filter( (artist) => {
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

            axios.delete(`/api/v1.0/artist/delete/${id}`).then(res => {
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



    render() {
        const { active_page, artists_per_page, artists, loading, message} = this.state;

        // Logic for pagination
        const indexLastEvent = active_page * artists_per_page;
        const indexFirstEvent = indexLastEvent - artists_per_page;
        const currentArtists = artists.slice(indexFirstEvent, indexLastEvent);

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
                                                        <div className="col-sm-12 col-md-4">
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
                                                        <div className="col-sm-12 col-md-4">
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
                                                        <div className="col-sm-12 col-md-4">
                                                            <div id="dataTable_filter" className="dataTables_filter">
                                                                <label>Buscar:<input type="search"
                                                                                     className="form-control form-control-sm"
                                                                                     placeholder=""
                                                                                     aria-controls="dataTable"
                                                                                     onChange={this.handleSearch}/></label>
                                                            </div>
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
                                                                        <td>
                                                                            <Link to={`/admin/artistas/${artist.id}`} className={"font-weight-bolder"}>
                                                                                {idx+1+artists_per_page*(active_page-1)}
                                                                            </Link>
                                                                        </td>
                                                                        <td>{artist.name}</td>
                                                                        <td>{artist.alias}</td>
                                                                        <td>{artist.surname ? artist.surname : ''}</td>
                                                                        <td>{birth_day+"-"+birth_month+"-"+birth_year}</td>
                                                                        <td>{artist.is_from}</td>
                                                                        <td>{artist.bio !== null ? artist.bio:''}</td>
                                                                        <td>
                                                                            <img src={artist.img_name} alt={"No se ha encontrado la imagen"}
                                                                                 className="img-thumbnail" width={100}/>
                                                                        </td>
                                                                        <td>{created_at_day+"-"+created_at_month+"-"+created_at_year}</td>
                                                                        <td>{updated_at_day+"-"+updated_at_month+"-"+updated_at_year}</td>

                                                                        <td>
                                                                            <button className="btn btn-primary d-block mb-2">Editar</button>
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