import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class Product extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        product: {},
        artists: [],
        token: '',
        categories: [],
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
            const {product} = this.props.match.params;
            this.getProduct(product);
            this.getArtists();
            this.getToken();
            this.getCategories();
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

    getProduct( id ) {
        axios.get(`/api/v1.0/product/${id}`).then(res => {
            if (res.data.success === true) {
                const product = res.data.results;

                this.setState({product: product, loading: false});
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

    getCategories = () =>  {
        axios.get(`/api/v1.0/category`).then(res => {
            if (res.data.success === true) {
                const categories = res.data.results;

                this.setState({categories: categories, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    _renderInfo = (product) => {

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
                            {product.name}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="price" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Precio
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {product.price}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="discount" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Descuento
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {product.discount !== null ? product.discount : 'No tiene'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="size" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Talla
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {product.size !== null ? product.size : 'No tiene'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="discount" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Descuento
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {product.discount !== null ? product.discount : 'No tiene'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="stock" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Stock
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {product.stock}
                        </div>
                    </div>


                    <div className="form-group row">
                        <label htmlFor="description" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Descripción
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {product.description}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="artist" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Artista
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {product.artist !== null ? product.artist.alias : 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="category" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Categoria
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {product.category !== null ? product.category.name : 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="img" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Imágen
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            <img src={product.img_name} alt={"Imagen no disponible"} width={75} className={"img img-fluid"}/>
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, product) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (product, artists, categories) => {

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
                                <input id="name" name="name" defaultValue={product.name}
                                       className="form-control here"
                                       type="text"/>
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
                                <input id="price" name="price" defaultValue={product.price}
                                       className="form-control here"
                                       type="number" step="0.01"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="discount" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Descuento
                            </label>
                            {
                                this.state.errors.hasOwnProperty('discount') ?
                                    <p className={"text-danger"}>{this.state.errors.discount}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="discount" name="discount" defaultValue={product.discount !== null ? product.discount : 0}
                                       className="form-control here"
                                       type="number" step="0.01"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="size" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Talla
                            </label>
                            {
                                this.state.errors.hasOwnProperty('sizze') ?
                                    <p className={"text-danger"}>{this.state.errors.size}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="size" name="size" defaultValue={product.size !== null ? price.size : ''}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="stock" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Stock
                            </label>
                            {
                                this.state.errors.hasOwnProperty('stock') ?
                                    <p className={"text-danger"}>{this.state.errors.stock}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="stock" name="stock" defaultValue={product.stock}
                                       className="form-control here"
                                       type="number" step="0.01"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="available" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Disponible
                            </label>
                            {
                                this.state.errors.hasOwnProperty('avaiable') ?
                                    <p className={"text-danger"}>{this.state.errors.avaiable}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select id={"available"} name={"available"} defaultValue={product.avaiable ? "1":"0"}>
                                    <option value={"1"}>Sí</option>
                                    <option value={"0"}>No</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="description" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Descripción
                            </label>
                            {
                                this.state.errors.hasOwnProperty('description') ?
                                    <p className={"text-danger"}>{this.state.errors.description}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <textarea cols={80} rows={10} name={"description"} id={"description"} defaultValue={product.description}/>
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
                            <label htmlFor="category" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Categoria
                            </label>
                            {
                                this.state.errors.hasOwnProperty('category') ?
                                    <p className={"text-danger"}>{this.state.errors.category}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select name={"category"} id={"category"} defaultValue={''}>
                                    <option value={''}/>
                                    {
                                        categories.map( (category, idx) => {
                                            return (
                                                <option key={idx} value={category.id}>{category.name}</option>
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
    handleDelete = (product) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");
        const {token} = this.state;

        if (ans) {


            axios.delete(`/api/v1.0/product/delete/${product.id}`, {data: {token: token}}).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/productos/',
                            state: {delete_success: "Producto eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar el producto"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar el producto"} } )
            });
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        // Get form data
        const name = document.querySelector('#name').value;
        const price = document.querySelector('#price').value;
        const discount = document.querySelector('#discount').value;
        const size = document.querySelector('#size').value;
        const stock = document.querySelector('#stock').value;
        const available = document.querySelector('#available').value;
        const description = document.querySelector('#description').value;
        const artist = document.querySelector('#artist').value;
        const category = document.querySelector('#category').value;
        const img = document.querySelector('#img').files[0];
        const {token} = this.state;
        const {product} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, artist: artist, price: price, discount: discount, size: size, stock: stock,
                                        avaiable: available, description: description, category: category, token: token})
        };

        this.setState( { sending: true } )

        // If image is edited send it, if not only send the rest of data
        if (img !== undefined){
            const formData = new FormData();
            formData.append('img',img);

            // Make the API call
            fetch(`/api/v1.0/product/edit/${product.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ product:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{
                this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            });

            // Make the API call
            axios.post(`/api/v1.0/product/upload-img/${product.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ product:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_img = "No se ha podido subir la imagen";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } else {
            fetch(`/api/v1.0/product/edit/${product.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ product:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{
                this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            });
        }

    }


    render() {
        const { product, categories, artists, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Producto {product.name}</h1>
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
                                                        this._renderInfo(product) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(product,artists, categories) : null
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

export default Product;