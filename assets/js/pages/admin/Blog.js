import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Header from "../../components/admin/Header";
import Pagination from "react-js-pagination";
import Loading from "../../components/public/Loading";

class Blog extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        loading: true,
        items: [],
        total_items: [],
        artists: [],
        tags: [],
        active_page : 1,
        items_per_page: 10,
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
            this.getPosts();
            this.getArtists();
            this.getTags()
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getPosts = () => {
        axios.get('/index.php/api/v1.0/post').then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { items: res.data.results, total_items: res.data.results, loading: false } );
            } else {
                <Redirect to={'error404'}/>
            }

        })
    }

    getArtists = () =>  {
        axios.get(`/index.php/api/v1.0/artist`).then(res => {
            if (res.data.success === true) {
                const artists = res.data.results;

                this.setState({artists: artists, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    getTags = () =>  {
        axios.get(`/index.php/api/v1.0/tag`).then(res => {
            if (res.data.success === true) {
                const tags = res.data.results;

                this.setState({tags: tags, loading: false});
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

            // Filter post searching in his title and description
            const search_results = this.state.items.filter( (post) => {
                let post_slug = post.title + post.description;
                return post_slug.toLowerCase().indexOf(search_request) !== -1;
            } )
            this.setState( {items: search_results} )
        } else {
            // if search value is empty reset products
            this.setState( { items: this.state.total_items } )
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
        this.setState( { items_per_page: num_per_page, active_page: 1 } );
    }

    /* SET CURRENT PAGE */
    handlePageChange(pageNumber) {
        this.setState({active_page: pageNumber});
    }

    /* DELETE CALL */
    handleDelete = (id) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {

            let {total_items} = this.state;

            axios.delete(`/index.php/api/v1.0/post/delete/${id}`).then(res => {
                if (res.data.success === true) {
                    total_items = total_items.filter(function( item ) {
                        return item.id !== parseInt(id);
                    });
                    this.setState({ total_item: total_items, items: total_items ,message: 'Noticias eliminada' });
                }
            }).catch(error => {
                this.setState( { message: "No se pudo borrar la noticias" } )
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
                        <h5 className="m-0 font-weight-bold text-sr">Todos las noticias</h5>
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
                                            </select> noticias
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
                                            onClick={() => this.setState({section:"new"}) }>Crear noticia</button>
                                </div>
                            </div>
                            <table className="table table-bordered" id="dataTable" width={100}
                                   cellSpacing="0">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Título</th>
                                    <th>Cuerpo</th>
                                    <th>Artista</th>
                                    <th>Tags</th>
                                    <th>Imagen</th>
                                    <th>Creado el dia</th>
                                    <th>Actualizado el dia</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tfoot>
                                <tr>
                                    <th>#</th>
                                    <th>Título</th>
                                    <th>Cuerpo</th>
                                    <th>Artista</th>
                                    <th>Tags</th>
                                    <th>Imagen</th>
                                    <th>Creado el dia</th>
                                    <th>Actualizado el dia</th>
                                    <th>Acciones</th>
                                </tr>
                                </tfoot>
                                <tbody>
                                {
                                    currentItems.map( ( item,idx ) =>{
                                        const created_at_day = new Date(item.created_at.date).getDate();
                                        const created_at_month = new Date(item.created_at.date).getMonth();
                                        const created_at_year = new Date(item.created_at.date).getFullYear();

                                        const updated_at_day = new Date(item.updated_at.date).getDate();
                                        const updated_at_month = new Date(item.updated_at.date).getMonth();
                                        const updated_at_year = new Date(item.updated_at.date).getFullYear();

                                        return (
                                            <tr key={idx} className={"row-sr"}>
                                                <td>{idx+1+items_per_page*(active_page-1)}</td>
                                                <td>{item.title}</td>
                                                <td>{item.description}</td>
                                                <td>{item.artist ? <Link to={`/admin/artistas/${item.artist.alias}`}>{item.artist.alias}</Link> : ''}</td>
                                                <td>
                                                    {item.tags.map((tag,idx) => {
                                                        return <Link key={idx} to={`/admin/tags/${tag.id}`}>{tag.tag} </Link>
                                                    })}
                                                </td>
                                                <td>
                                                    <img src={item.img_name} alt={"No se ha encontrado la imagen"}
                                                         className="img-thumbnail" width={300}/>
                                                </td>
                                                <td>{created_at_day+"-"+created_at_month+"-"+created_at_year}</td>
                                                <td>{updated_at_day+"-"+updated_at_month+"-"+updated_at_year}</td>

                                                <td>
                                                    <Link to={`/admin/noticias/${item.id}`} className={"font-weight-bolder"}>
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
        const { errors, artists, tags } = this.state;
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
                                        <label htmlFor="title" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Título
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('title') ?
                                                <p className={"text-danger"}>{this.state.errors.title}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="title" name="title"
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
                                            <textarea cols={80} rows={10} name={"description"} id={"description"}/>
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
                                                    className="btn btn-success">Crear noticia
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

        const title = document.querySelector('#title').value;
        const artist = document.querySelector('#artist').value;
        const description = document.querySelector('#description').value;
        const tags = document.querySelector('#tag').selectedOptions;
        const img = document.querySelector('#img').files[0];
        let arr_tags = [];

        // tags variable cant be stringify: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
        // so we have to access in each option value manually an store in a different variable
        Object.keys(tags).map( (option) => {
            arr_tags.push(tags[option].value)
        } )

        let {total_items} = this.state;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title, artist: artist, description: description, tag: arr_tags })
        };

        this.setState( { sending: true } )

        fetch('/index.php/api/v1.0/post/new', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    let post = data.results;
                    // If image is submited too send it, if not update state
                    if (img !== undefined){
                        const formData = new FormData();
                        formData.append('img',img);

                        // Make the API call
                        axios.post(`/index.php/api/v1.0/post/upload-img/${post.id}`, formData, {})
                            .then(res=> {
                                if (res.data.success){
                                    // Get new album
                                    post = res.data.results;
                                    // Update albums list
                                    total_items.unshift(post);

                                    this.setState({ total_items:total_items, items: total_items, submited: true,
                                        message:"¡Noticia creada!",success: true,section: "index", sending: false })
                                }else
                                    this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                            } )
                            .catch(e=>{
                                let {errors} = this.state;
                                errors.cant_upload_img = "No se ha podido subir la imagen";
                                this.setState({ success: false, errors: errors, submited: true, sending: false }) })

                    }else{
                        // Get new album
                        post = data.results;
                        // Update albums list
                        total_items.unshift(post);
                        this.setState({ total_items:total_items, items: total_items, submited: true,
                            message:"¡Noticia creada!",success: true,section: "index", sending: false})
                    }
                }else
                    this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            }).catch(e=>{});
    }


    render() {

        const { loading, section } = this.state;


        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Noticias</h1>
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

export default Blog;