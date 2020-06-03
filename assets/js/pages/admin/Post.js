import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class Post extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        post: {},
        token:  '',
        artists: [],
        tags: [],
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
            const {post} = this.props.match.params;
            this.getPost(post);
            this.getArtists();
            this.getToken();
            this.getTags();
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

    getPost( id ) {
        axios.get(`/api/v1.0/post/${id}`).then(res => {
            if (res.data.success === true) {
                const post = res.data.results;

                this.setState({post: post, loading: false});
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

    getTags = () =>  {
        axios.get(`/api/v1.0/tag`).then(res => {
            if (res.data.success === true) {
                const tags = res.data.results;

                this.setState({tags: tags, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    _renderInfo = (post) => {

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
                            Título
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {post.title}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="description" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Cuerpo
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {post.description}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="artist" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Artista
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {post.artist !== null ? post.artist.alias:'No tiene'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="artist" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Tags
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {
                                post.tags.map(tag => {
                                return tag.tag+" ";
                            })}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="img" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Imágen
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            <img src={post.img_name} alt={"Imagen no disponible"} width={75} className={"img img-fluid"}/>
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, post) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (post, artists, tags) => {

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
                            <label htmlFor="title" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Título
                            </label>
                            {
                                this.state.errors.hasOwnProperty('title') ?
                                    <p className={"text-danger"}>{this.state.errors.title}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="title" name="title" defaultValue={post.title}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="description" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Cuerpo
                            </label>
                            {
                                this.state.errors.hasOwnProperty('description') ?
                                    <p className={"text-danger"}>{this.state.errors.description}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <textarea defaultValue={post.description} cols={80} rows={10} name={"description"} id={"description"}/>
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
                            <label htmlFor="tag" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Tags
                            </label>
                            {
                                this.state.errors.hasOwnProperty('tag') ?
                                    <p className={"text-danger"}>{this.state.errors.tag}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select name={"tag"} id={"tag"} multiple={true}>
                                    {
                                        tags.map( (tag, idx) => {
                                            return (
                                                <option key={idx} value={tag.id}>{tag.tag}</option>
                                            )
                                        } )
                                    }
                                </select>
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
    handleDelete = (post) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");
        const {token} = this.state;
        if (ans) {
            axios.delete(`/api/v1.0/post/delete/${post.id}`, { data: {token: token} }).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/noticias/',
                            state: {delete_success: "Noticia eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar la noticia"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar la noticia"} } )
            });
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        //Get form data
        const title = document.querySelector('#title').value;
        const artist = document.querySelector('#artist').value;
        const description = document.querySelector('#description').value;
        const tags = document.querySelector('#tag').selectedOptions;
        const { token } = this.state;
        let arr_tags = [];

        // tags variable cant be stringify: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
        // so we have to access in each option value manually an store in a different variable
        Object.keys(tags).map( (option) => {
            arr_tags.push(tags[option].value)
        } )


        const img = document.querySelector('#img').files[0];
        const {post} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title, artist: artist, description: description, tag: arr_tags, token: token })
        };

        this.setState( { sending: true } )

        // If image is edited send it, if not only send the rest of data
        if (img !== undefined){
            const formData = new FormData();
            formData.append('img',img);

            // Make the API call
            fetch(`/api/v1.0/post/edit/${post.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ post:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{
                this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            });

            // Make the API call
            axios.post(`/api/v1.0/post/upload-img/${post.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ post:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_img = "No se ha podido subir la imagen";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } else {
            fetch(`/api/v1.0/post/edit/${post.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ post:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{
                this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            });
        }

    }

    render() {
        const { post, artists, tags,loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Noticia {post.title}</h1>
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
                                                        this._renderInfo(post) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(post,artists,tags) : null
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

export default Post;