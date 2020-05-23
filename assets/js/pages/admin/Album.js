import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class Album extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        album: {},
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
            const {album} = this.props.match.params;
            this.getAlbum(album);
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

    getAlbum( id ) {
        axios.get(`/api/v1.0/album/${id}`).then(res => {
            if (res.data.success === true) {
                const album = res.data.results;

                this.setState({album: album, loading: false});
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

    _renderInfo = (album) => {

        const released_at_day = new Date(album.released_at.date).getDate();
        const released_at_month = new Date(album.released_at.date).getMonth();
        const released_at_year = new Date(album.released_at.date).getFullYear();

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
                        <label htmlFor="name" className="col-3 col-form-label font-weight-bolder">
                            Nombre
                        </label>
                        <div className="col-3">
                            {album.name}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="artist" className="col-3 col-form-label font-weight-bolder">
                            Artista
                        </label>
                        <div className="col-3">
                            {album.artist.alias}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="price" className="col-3 col-form-label font-weight-bolder">
                            Precio
                        </label>
                        <div className="col-3">
                            {album.price}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="duration" className="col-3 col-form-label font-weight-bolder">
                            Duración
                        </label>
                        <div className="col-3">
                            {album.duration !== null ? album.duration:'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="released_at" className="col-3 col-form-label font-weight-bolder">
                            Fecha de lanzamiento
                        </label>
                        <div className="col-3">
                            {released_at_day+"-"+released_at_month+"-"+released_at_year}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="img" className="col-3 col-form-label font-weight-bolder">
                            Imágen
                        </label>
                        <div className="col-3">
                            <img src={album.img_name} alt={"Imagen no disponible"} width={75} className={"img img-fluid"}/>
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, album) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (album, artists) => {

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
                            <label htmlFor="name" className="col-3 col-form-label font-weight-bolder">
                                Nombre
                            </label>
                            {
                                this.state.errors.hasOwnProperty('name') ?
                                    <p className={"text-danger"}>{this.state.errors.name}</p> : null
                            }
                            <div className="col-3">
                                <input id="name" name="name" defaultValue={album.name}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="artist" className="col-3 col-form-label font-weight-bolder">
                                Artista
                            </label>
                            {
                                this.state.errors.hasOwnProperty('artist') ?
                                    <p className={"text-danger"}>{this.state.errors.artist}</p> : null
                            }
                            <div className="col-3">
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
                            <label htmlFor="price" className="col-3 col-form-label font-weight-bolder">
                                Precio
                            </label>
                            {
                                this.state.errors.hasOwnProperty('price') ?
                                    <p className={"text-danger"}>{this.state.errors.price}</p> : null
                            }
                            <div className="col-3">
                                <input id="price" name="price" defaultValue={album.price}
                                       className="form-control here"
                                       type="number"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="duration" className="col-3 col-form-label font-weight-bolder">
                                Duración
                            </label>
                            {
                                this.state.errors.hasOwnProperty('duration') ?
                                    <p className={"text-danger"}>{this.state.errors.duration}</p> : null
                            }
                            <div className="col-3">
                                <input id="duration" name="duration" defaultValue={album.duration  !== null ? album.duration:0 }
                                       className="form-control here"
                                       type="number"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="released_at" className="col-3 col-form-label font-weight-bolder">
                                Fecha lanzamiento
                            </label>
                            {
                                this.state.errors.hasOwnProperty('released_at') ?
                                    <p className={"text-danger"}>{this.state.errors.released_at}</p> : null
                            }
                            <div className="col-3">
                                <input id="released_at" name="released_at"
                                       className="form-control here"
                                       type="date"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="img" className="col-3 col-form-label font-weight-bolder">
                                Imagen
                            </label>
                            {
                                this.state.errors.hasOwnProperty('cant_upload_img') ?
                                    <p className={"text-danger"}>{this.state.errors.cant_upload_img}</p> : null
                            }
                            <div className="col-3">
                                <input id="img" name="img"
                                       className="form-control here"
                                       type="file"/>
                            </div>
                        </div>


                        <div className="form-group row">
                            <div className="col-3">
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
    handleDelete = (album) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {


            axios.delete(`/api/v1.0/album/delete/${album.id}`).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/albums/',
                            state: {delete_success: "Album eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar el album"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar el album"} } )
            });
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const artist = document.querySelector('#artist').value;
        const price = document.querySelector('#price').value;
        const duration = document.querySelector('#duration').value;
        const released_at = document.querySelector('#released_at').value;
        const img = document.querySelector('#img').files[0];
        const {album} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, artist: artist, price: price, duration: duration, released_at: released_at })
        };

        this.setState( { sending: true } )

        // If image is edited send it, if not only send the rest of data
        if (img !== undefined){
            const formData = new FormData();
            formData.append('img',img);

            // Make the API call
            fetch(`/api/v1.0/album/edit/${album.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ album:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{});

            // Make the API call
            axios.post(`/api/v1.0/album/upload-img/${album.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ album:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_img = "No se ha podido subir la imagen";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } else {
            fetch(`/api/v1.0/album/edit/${album.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ album:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{});
        }

    }


    render() {
        const { album, artists, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Album {album.name}</h1>
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
                                                        this._renderInfo(album) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(album,artists) : null
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

export default Album;