import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";
import {Link} from "react-router-dom";

class Song extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        song: {},
        albums: [],
        token: '',
        artists: [],
        loading: true,
        section: 'Mostrar',
        submited: false,
        success: false,
        sending: false,
        errors: {}
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted){
            const {song} = this.props.match.params;
            this.getSong(song);
            this.getAlbums();
            this.getToken();
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

    getSong( id ) {
        axios.get(`/api/v1.0/song/${id}`).then(res => {
            if (res.data.success === true) {
                const song = res.data.results;

                this.setState({song: song, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
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

    getAlbums = () =>  {
        axios.get(`/api/v1.0/album`).then(res => {
            if (res.data.success === true) {
                const albums = res.data.results;

                this.setState({albums: albums, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    _renderInfo = (song) => {

        const released_at_day = new Date(song.released_at.date).getDate();
        const released_at_month = new Date(song.released_at.date).getMonth();
        const released_at_year = new Date(song.released_at.date).getFullYear();

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
                            {song.name}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="artist" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Artista
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {song.artist.alias}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="album" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Album
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {song.album !== null ? song.album.name:'No tiene'}
                        </div>
                    </div>


                    <div className="form-group row">
                        <label htmlFor="duration" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Duración
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {song.duration !== null ? song.duration:'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="album" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Enlace videoclip
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {song.video_src !== null ? song.video_src:'No tiene'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="released_at" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Fecha de lanzamiento
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {released_at_day+"-"+released_at_month+"-"+released_at_year}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="album" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Fichero canción
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            <audio preload="auto" controls>
                                <source src={"/songs/"+song.song_file}/>
                            </audio>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="img" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Imágen
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            <img src={song.img_name} alt={"Imagen no disponible"} width={75} className={"img img-fluid"}/>
                        </div>
                    </div>

                    <hr/>
                    <div className="form-group row">
                        <div className="col-12 mb-2">
                            <button name="submit" type="submit"
                                    className="btn btn-success"
                                    onClick={ () => this.setState( { section: "Editar" } ) }>Editar
                            </button>
                            <Link to={'/admin/canciones'} className="btn btn-primary ml-2"
                            >Volver atrás
                            </Link>
                            <button name="submit" type="submit"
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, song) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (song ,albums, artists) => {

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
                                <input id="name" name="name" defaultValue={song.name}
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
                            <label htmlFor="album" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Album
                            </label>
                            {
                                this.state.errors.hasOwnProperty('album') ?
                                    <p className={"text-danger"}>{this.state.errors.album}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select name={"album"} id={"album"} defaultValue={''}>
                                    <option value={''}/>
                                    {
                                        albums.map( (album, idx) => {
                                            return (
                                                <option key={idx} value={album.id}>{album.name}</option>
                                            )
                                        } )
                                    }
                                </select>
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
                                <input id="duration" name="duration" defaultValue={song.duration}
                                       className="form-control here"
                                       type="number" step="0.01"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="video_src" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Enlace videoclip
                            </label>
                            {
                                this.state.errors.hasOwnProperty('video_src') ?
                                    <p className={"text-danger"}>{this.state.errors.video_src}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="video_src" name="video_src" defaultValue={song.video_src !== null ? song.video_src:''}
                                       className="form-control here"
                                       type="text"/>
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
                            <label htmlFor="song" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Fichero canción
                            </label>
                            {
                                this.state.errors.hasOwnProperty('cant_upload_song') ?
                                    <p className={"text-danger"}>{this.state.errors.cant_upload_song}</p> : null
                            }
                            {
                                this.state.errors.hasOwnProperty('song') ?
                                    <p className={"text-danger"}>{this.state.errors.song}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="song" name="song"
                                       className="form-control here"
                                       type="file"/>
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
    handleDelete = (song) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");
        const {token} = this.state;
        if (ans) {


            axios.delete(`/api/v1.0/song/delete/${song.id}`, { data: {token:token} }).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/canciones/',
                            state: {delete_success: "Canción eliminada"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar la canción"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar la canción"} } )
            });
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        // Get form data
        const name = document.querySelector('#name').value;
        const artist = document.querySelector('#artist').value;
        const album = document.querySelector('#album').value;
        const duration = document.querySelector('#duration').value;
        const video_src = document.querySelector('#video_src').value;
        const released_at = document.querySelector('#released_at').value;
        const song_file = document.querySelector('#song').files[0];
        const img = document.querySelector('#img').files[0];
        const {token} = this.state;
        const {song} = this.state;

        let formData = new FormData()

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, album: album, artist: artist, duration: duration, video_src: video_src, released_at: released_at, token: token })
        };

        this.setState( { sending: true } )

        // If image and/or song is edited send it, if not only send the rest of data

        // Only image submited
        if (img !== undefined && song_file === undefined){
            formData.append('img',img);
            // Make the API call
            fetch(`/api/v1.0/song/edit/${song.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ song:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{
                this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            });

            // Make the API call
            axios.post(`/api/v1.0/song/upload-img/${song.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ song:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_img = "No se ha podido subir la imagen";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } // Only song submited
        else if(img === undefined && song_file !== undefined){
            formData.append('song',song_file);

            // Make the API call
            fetch(`/api/v1.0/song/edit/${song.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ song:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{
                this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            });

            // Make the API call
            axios.post(`/api/v1.0/song/upload-song/${song.id}`, formData, {})
                .then(res=> {

                    if (res.data.success){
                        this.setState({ song:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_song = "No se ha podido subir la canción";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } // Image and song submited
        else if(img !== undefined && song_file !== undefined) {

            formData.append('song',song_file);

            // Make the API call
            fetch(`/api/v1.0/song/edit/${song.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ song:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{
                this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            });


            // Make the API call
            axios.post(`/api/v1.0/song/upload-song/${song.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ song:res.data.results })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_song = "No se ha podido subir la canción";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

            formData.delete('song');
            formData.append('img',img);


            // Make the API call
            axios.post(`/api/v1.0/song/upload-img/${song.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ song:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_img = "No se ha podido subir la imagen";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } // Image and song NOT submited
        else {
            fetch(`/api/v1.0/song/edit/${song.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ song:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{
                this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            });
        }

    }

    render() {

        const { song ,albums, artists, loading, section, errors } = this.state;


        return(
            <div id="wrapper">
                <Navbar/>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Canción {song.name}</h1>
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
                                                        <h6 className={"text-danger"}>{errors.cant_delete}</h6> : null
                                                }
                                            </div>
                                            <div className="card-body">
                                                {
                                                    section === "Mostrar" ?
                                                        this._renderInfo(song) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(song,albums, artists) : null
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

export default Song;