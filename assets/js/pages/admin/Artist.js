import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class Artist extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        item: {},
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
            const {artist} = this.props.match.params;
            this.getArtist(artist);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getArtist( id ) {
        axios.get(`/api/v1.0/artist/${id}`).then(res => {
            if (res.data.success === true) {
                const item = res.data.results;

                this.setState({item: item, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    static propTypes = {
        match: PropTypes.shape({
            params:PropTypes.object,
            isExact:PropTypes.bool,
            path:PropTypes.string,
            url: PropTypes.string
        })
    }

    _renderInfo = (artist) => {

        const birth_day = new Date(artist.birth.date).getDate();
        const birth_month = new Date(artist.birth.date).getMonth();
        const birth_year = new Date(artist.birth.date).getFullYear();

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
                            {artist.name}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="surname" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Apellidos
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {artist.surname ? artist.surname : ''}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="alias" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Alias
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {artist.alias}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="birth" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Fecha de nacimiento
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {birth_day+"-"+birth_month+"-"+birth_year}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="is_from" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Providencia
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {artist.is_from}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="bio" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Biografía
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {artist.bio !== null ? artist.bio:'No tiene biografía'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="img" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Imágen
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            <img src={artist.img_name} alt={"Imagen no disponible"} width={75} className={"img img-fluid"}/>
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, artist) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (artist) => {

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
                                <input id="name" name="name" defaultValue={artist.name}
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
                                <input id="surname" name="surname" defaultValue={artist.surname}
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
                                <input id="alias" name="alias" defaultValue={artist.alias}
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
                                <input id="is_from" name="is_from" defaultValue={artist.is_from}
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
                                <textarea id={"bio"} name={"bio"} defaultValue={artist.bio !== null ? artist.bio:''} cols={80} rows={10}/>
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
    handleDelete = (artist) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {
            // API call to delete artist
            axios.delete(`/api/v1.0/artist/delete/${artist.id}`).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/artistas/',
                            state: {delete_success: "Artista eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar el artista"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar el artista"} } )
            });
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        // Get form data
        const name = document.querySelector('#name').value;
        const surname = document.querySelector('#surname').value;
        const alias = document.querySelector('#alias').value;
        const birth = document.querySelector('#birth').value;
        const is_from = document.querySelector('#is_from').value;
        const bio = document.querySelector('#bio').value;
        const img = document.querySelector('#img').files[0];
        const {artist} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, surname: surname, alias: alias, birth: birth, is_from: is_from, bio: bio })
        };

        this.setState( { sending: true } )

        // If image is edited send it, if not only send the rest of data
        if (img !== undefined){
            const formData = new FormData();
            formData.append('img',img);

            // Make the API call
            fetch(`/api/v1.0/artist/edit/${artist.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ item:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{});

            // Make the API call to upload image
            axios.post(`/api/v1.0/artist/upload-img/${artist.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ item:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_img = "No se ha podido subir la imagen";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } else {
            fetch(`/api/v1.0/artist/edit/${artist.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ artist:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{});
        }

    }

    render() {

        const { item, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Artista {item.alias}</h1>
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
                                                        this._renderInfo(item) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(item) : null
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

export default Artist;