import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Header from "../../components/admin/Header";
import Pagination from "react-js-pagination";

class Albums extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        loading: true,
        albums: [],
        total_albums: [],
        active_page : 1,
        albums_per_page: 5,
        message: '',
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getAlbums();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getAlbums = () => {
        axios.get('/api/v1.0/album').then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { albums: res.data.results, total_albums: res.data.results, loading: false } );
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

            // Filter albums searching in his name and artist alias
            const search_results = this.state.albums.filter( (album) => {
                let album_slug = album.name + album.artist.alias;
                return album_slug.toLowerCase().indexOf(search_request) !== -1;
            } )
            this.setState( {albums: search_results} )
        } else {
            // if search value is empty reset products
            this.setState( { albums: this.state.total_albums } )
        }

    }

    orderByNewest = () => {
        const newest = this.state.albums.sort( function compare( a, b ) {
            if ( new Date(a.created_at.date) > new Date(b.created_at.date) ){
                return -1;
            }
            if ( new Date(a.created_at.date) < new Date(b.created_at.date) ){
                return 1;
            }
            return 0;
        } );
        this.setState( { albums : newest, active_page: 1 } );
    }

    orderByOldest = () => {
        const oldest = this.state.albums.sort( function compare( a, b ) {
            if ( new Date(a.created_at.date) < new Date(b.created_at.date) ){
                return -1;
            }
            if ( new Date(a.created_at.date) > new Date(b.created_at.date) ){
                return 1;
            }
            return 0;
        } );
        this.setState( { albums : oldest, active_page: 1 } );
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

        if (ans) {

            let {total_albums} = this.state;

            axios.delete(`/api/v1.0/album/delete/${id}`).then(res => {
                if (res.data.success === true) {
                    total_albums = total_albums.filter(function( item ) {
                        return item.id !== parseInt(id);
                    });
                    this.setState({ total_albums: total_albums, albums: total_albums ,message: 'Álbum eliminado' });
                }
            }).catch(error => {
                this.setState( { message: "No se pudo borrar el album" } )
            });
        }
    }


    render() {

        const { active_page, albums_per_page, albums, loading, message} = this.state;

        // Logic for pagination
        const indexLastEvent = active_page * albums_per_page;
        const indexFirstEvent = indexLastEvent - albums_per_page;
        const currentAlbums = albums.slice(indexFirstEvent, indexLastEvent);

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Albums</h1>
                            </div>
                            {
                                loading ?
                                    null
                                    :
                                    <div className={"row"}>
                                        <div className="card shadow mb-4 w-100">
                                            <div className="card-header py-3">
                                                <h6 className="m-0 font-weight-bold text-sr">Todos los albums</h6>
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
                                                        <div className="col-sm-12 col-md-4">
                                                            <div className="quantity_albums" id="quantity_items">
                                                                <label>Mostrar
                                                                    <select name="quantity_items" aria-controls="dataTable"
                                                                            className="custom-select custom-select-sm form-control form-control-sm"
                                                                            onChange={this.handleItemsPerPage}>
                                                                    <option value={5}>5</option>
                                                                    <option value={10}>10</option>
                                                                    <option value={15}>15</option>
                                                                    <option value={20}>20</option>
                                                                    </select> albums
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
                                                                        <td>
                                                                            <Link to={`/admin/albums/${album.id}`} className={"font-weight-bolder"}>
                                                                                {idx+1+albums_per_page*(active_page-1)}
                                                                            </Link>
                                                                        </td>
                                                                        <td>{album.name}</td>
                                                                        <td>{album.price}</td>
                                                                        <td>{album.duration}</td>
                                                                        <td>{released_at_day+"-"+released_at_month+"-"+released_at_year}</td>
                                                                        <td><Link to={`/admin/artistas/${album.artist.alias}`}>{album.artist.alias}</Link></td>
                                                                        <td><img src={album.img_name} alt={"No se ha encontrado la imagen"}
                                                                                className="img-thumbnail" width={100}/></td>
                                                                        <td>{created_at_day+"-"+created_at_month+"-"+created_at_year}</td>
                                                                        <td>{updated_at_day+"-"+updated_at_month+"-"+updated_at_year}</td>

                                                                        <td>
                                                                            <button className="btn btn-primary d-block mb-2">Editar</button>
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
                                                            totalItemsCount={albums.length}
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

export default Albums;