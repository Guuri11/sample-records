import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import Breadcumb from "../../components/public/Breadcumb";
import axios from "axios";
import Loading from "../../components/public/Loading";

class Checkout extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        cart: [],
        no_products : true,
        isAuth: false,
        user_data: {},
        form_data: {},
        sending: false,
        success: false,
        submited: false,
        errors: {},
        final_price: 0,
        loading: true,
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            // Check if user is loggued
            if (sessionStorage.getItem('auth') === "true"){
                // Get user data to use the values in the form
                axios.get('/index.php/api/v1.0/user/profile/info').then(res => {
                    if (res.data.success === true) {
                        this.setState({ user_data: res.data.results[0], isAuth: true});
                        // Get cart items
                        this.updateCart()
                    }
                }).catch(() => {this.setState({ isAuth: false})});
            }else {
                this.updateCart()
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    updateCart = () => {
        this.setState({ cart: [], loading: true });
        const cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
        // Get total price
        let final_price = 0;
        if (this.state.isAuth){
            cart.map(item => {
                final_price += item.price * 0.95;
            })
        } else{
            cart.map(item => {
                final_price += item.price;
            })
        }
        this.setState({ cart: cart, no_products: cart.length === 0, loading: false, final_price: final_price });
    }

    handleDeleteItem = (idx) => {

        // Get cart's items
        let {cart} = this.state;

        // delete the item
        if (cart.length === 1){
            cart = [];
            localStorage.removeItem('cart');
            this.setState( { cart: cart, final_price: 0, no_products: true } )
        } else {
            cart = cart.splice(idx,1);
            // reset final price
            let final_price = 0;
            if (this.state.isAuth){
                cart.map(item => {
                    final_price += item.price * 0.95;
                })
            } else{
                cart.map(item => {
                    final_price += item.price;
                })
            }

            // update cart
            localStorage.setItem('cart', JSON.stringify(cart));
            this.setState( { cart: cart, final_price: final_price } )
        }
    }

    // handle form
    handleSubmit = async (e) => {
        e.preventDefault();

        const {cart} = this.state;

        // Get form data
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const town = document.getElementById("town").value;
        const city = document.getElementById("city").value;
        const country = document.getElementById("country").value;
        const credit_card = document.getElementById("credit_card").value;
        const comment = document.getElementById("comment").value;

        this.setState({sending: true})

        for (const item of cart) {
            let idx = cart.indexOf(item);

            // Prepare the post call
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: name, email: email, address: address, town: town,
                    city: city, country: country, credit_card: credit_card, comment: comment,
                    product: item.type === "product" ? item.id : null, event: item.type === "event" ? item.id : null
                })
            };

            // Make the Post call
            await fetch("/index.php/api/v1.0/purchase/buy", requestOptions)
                .then(response => response.json())
                .then(data => {
                    if(!data.success) {
                        this.setState( { errors: data.error  } )
                    }
                }).catch(e => {});
        }

        if(Object.keys(this.state.errors).length === 0) {
            localStorage.removeItem('cart');
            this.setState( { sending: false, submited: true, success: true, cart: [] } )
        } else {
            this.setState( { sending: false, submited: true, success: false } )
        }

    }

    render() {

        const { user_data,cart,isAuth,final_price,loading, sending, success, submited, errors, no_products } = this.state;

        return (
            <div>
                <Title title={"SR - CHECKOUT"}/>
                <Header/>
                <Breadcumb title={"Comprar"}/>

                {
                    loading ?
                        null
                        :
                        <div className="container wow fadeIn">
                            {
                                // If there's no products in the cart dont show nothing
                                !no_products ?
                                    <div className="row mt-4">

                                        {/* CHECKOUT FORM */}
                                        <div className="col-md-8 mt-5 mb-3">

                                            <div className="card">
                                                {/* STATEMENT MESSAGES */}
                                                {
                                                    sending ?
                                                        <div className={"text-align-center mt-3"}>
                                                            <h5 className="text-info">Procesando</h5>
                                                            <Loading/>
                                                        </div>
                                                        :
                                                        null
                                                }
                                                {
                                                    submited ?
                                                        success ?
                                                            <div>
                                                                <h4 className={"text-success text-align-center mt-3"}>¡Compra realizada!</h4>
                                                                <h6 className={"text-info text-align-center mt-3"}>Tardará aproximádamente 2 dias en llegar</h6>
                                                            </div>
                                                            :
                                                            <h4 className={"text-danger text-align-center mt-3"}>No se pudo completar la compra</h4>
                                                        :
                                                        null
                                                }
                                                {
                                                    errors.hasOwnProperty("no_stock") ?
                                                        <h6>{errors.no_stock}</h6>
                                                        :
                                                        null
                                                }
                                                {
                                                    errors.hasOwnProperty("required_product") ?
                                                        <p className={"text-danger"}>{errors.required_product}</p>
                                                        :
                                                        null
                                                }
                                                <form className="card-body" onSubmit={this.handleSubmit}>
                                                    <div className="md-form mb-5">
                                                        <label htmlFor="name" className="">Nombre</label>
                                                        {
                                                            errors.hasOwnProperty("required_name") ?
                                                                <p className={"text-danger"}>{errors.required_name}</p>
                                                                :
                                                                null
                                                        }
                                                        <input type="text" id="name" name={"name"} className="form-control"
                                                               required defaultValue={isAuth ? user_data.name: ''}/>
                                                    </div>
                                                    <div className="md-form mb-5">
                                                        <label htmlFor="email" className="">Email</label>
                                                        {
                                                            errors.hasOwnProperty("required_email") ?
                                                                <p className={"text-danger"}>{errors.required_email}</p>
                                                                :
                                                                null
                                                        }
                                                        <input type="email" id="email" name={"email"} className="form-control"
                                                               required defaultValue={isAuth ? user_data.email: ''}/>
                                                    </div>
                                                    <div className="md-form mb-5">
                                                        <label htmlFor="address">Dirección</label>
                                                        {
                                                            errors.hasOwnProperty("required_address") ?
                                                                <p className={"text-danger"}>{errors.required_address}</p>
                                                                :
                                                                null
                                                        }
                                                        <input type="text" id="address" name={"address"}
                                                               className="form-control" defaultValue={isAuth ? user_data.address: ''}/>
                                                    </div>
                                                    <div className="md-form mb-5">
                                                        <label htmlFor="town" className="">Población</label>
                                                        <input type="text" id="town" name={"town"} className="form-control"
                                                               defaultValue={isAuth ? user_data.town: ''}/>
                                                    </div>
                                                    <div className="md-form mb-5">
                                                        <label htmlFor="city" className="">Ciudad</label>
                                                        <input type="text" id="city" name={"city"} className="form-control"
                                                               defaultValue={isAuth ? user_data.city: ''}/>
                                                    </div>
                                                    <div className="md-form mb-5">
                                                        <label htmlFor="country" className="">País</label>
                                                        {
                                                            errors.hasOwnProperty("required_country") ?
                                                                <p className={"text-danger"}>{errors.required_country}</p>
                                                                :
                                                                null
                                                        }
                                                        <input type="text" id="country" name={"country"}
                                                               className="form-control"/>
                                                    </div>
                                                    <div className="md-form mb-5">
                                                        <label htmlFor="country" className="">¿Algún comentario que desees añadir?</label>
                                                        <textarea cols="30" rows="5" id="comment" name={"comment"}
                                                               className="form-control"/>
                                                    </div>
                                                    <hr/>
                                                    <div className="row">
                                                        <div className="col-12 md-form mb-5">
                                                            <label htmlFor="credit_card" className="">Tarjeta de crédito</label>
                                                            {
                                                                errors.hasOwnProperty("required_credit_card") ?
                                                                    <p className={"text-danger"}>{errors.required_credit_card}</p>
                                                                    :
                                                                    null
                                                            }
                                                            <input type="text" id="credit_card" name={"credit_card"}
                                                                   className="form-control"
                                                                   defaultValue={isAuth ? user_data.credit_card: ''}/>
                                                        </div>

                                                        <hr className="mb-4"/>
                                                        {
                                                            submited && success ?
                                                                null
                                                                :
                                                                <button className="btn btn-primary btn-primary-sr center-box"
                                                                        type="submit">Comprar
                                                                </button>
                                                        }

                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                        {/* CART FORM */}
                                        <div className="col-md-4 mb-4 mt-5 mb-3">
                                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="text-muted">Tu carrito</span>
                                                <span className="badge badge-secondary badge-pill bg-primary">{cart.length}</span>
                                            </h4>
                                            <ul className="list-group mb-3 z-depth-1">
                                                {
                                                    isAuth ?
                                                        <li className="list-group-item d-flex justify-content-between bg-light">
                                                            <div className="text-success">
                                                                <h6 className="my-0">Descuento de cliente</h6>
                                                            </div>
                                                            <span className="text-success">5% / Producto</span>
                                                        </li>
                                                        :
                                                        null
                                                }
                                                {
                                                    cart.map( (item,idx) => {
                                                        return (
                                                            <li key={idx} className="list-group-item d-flex justify-content-between lh-condensed">
                                                                <div>
                                                                    <h6 className="my-0">{item.name}</h6>
                                                                </div>
                                                                <span className="text-muted">{item.price}</span>
                                                                <button value={idx} className={"btn btn-danger btn-sm"}
                                                                        onClick={this.handleDeleteItem.bind(this,idx)}>
                                                                    <i className="fa fa-times"/>
                                                                </button>
                                                            </li>
                                                        )
                                                    } )
                                                }
                                                <li className="list-group-item d-flex justify-content-between">
                                                    <span className="font-weight-bolder">Total:</span>
                                                    <strong className={"text-success"}>{final_price.toFixed(2)} €</strong>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                    :
                                    <div className="mt-5 mb-5">
                                        <h1 className="text-align-center">No tienes ningún producto para comprar 😟</h1>
                                    </div>
                            }
                        </div>
                }

                <Footer/>
            </div>
        );
    }
}
export default Checkout;