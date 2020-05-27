import React, { Component } from 'react';
import {withRouter} from "react-router-dom";

class Cart extends Component {

    state = {
        cart: [],
        loading: true,
        final_price: 0
    }

    updateCart = () => {
        this.setState({ cart: [], loading: true });
        const cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
        // Get total price
        let final_price = 0;
        cart.map(item => {
            final_price += item.price;
        })
        this.setState({ cart: cart, loading: false, final_price: final_price });
    }

    handleDeleteItem = (idx) => {

        // Get cart's items
        let {cart} = this.state;


        // delete the item
        if (cart.length === 1){
            cart = [];
            localStorage.removeItem('cart');
            this.setState( { cart: cart, final_price: 0 } )
        } else {
            cart.splice(idx,1);
            // reset final price
            let final_price = 0;
            cart.map(item => {
                final_price += item.price;
            })
            // update cart
            localStorage.setItem('cart', JSON.stringify(cart));
            this.setState( { cart: cart, final_price: final_price } )
        }
    }

    handleGoToCheckout = (e) => {
        // get modals
        const modal = document.querySelector('#cartModal');
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('style', 'display: none');

        // get modal backdrops
        const modalsBackdrops = document.getElementsByClassName('modal-backdrop');

        // remove every modal backdrop
        for(let i=0; i<modalsBackdrops.length; i++) {
            document.body.removeChild(modalsBackdrops[i]);
        }
        document.body.classList.remove('modal-open');

        this.props.history.push('/checkout');
    }

render() {

const { cart, final_price, loading } = this.state;
return (
    <div onFocus={this.updateCart}>
        <div className="modal fade" id="cartModal" tabIndex="-1" role="dialog" aria-labelledby="title-cart"
             aria-hidden="false">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                {
                    loading ?
                        null
                        :
                        <div className="modal-content">
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title" id="title-cart">
                                    Tu carrito
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Cerrar">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    cart.length !== 0 ?
                                        <table className="table table-image">
                                            <thead>
                                            <tr>
                                                <th scope="col"/>
                                                <th scope="col">Producto</th>
                                                <th scope="col">Precio</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {
                                                cart.map( (item, idx) => {
                                                    return (
                                                        <tr key={idx}>
                                                            <td className="w-25">
                                                                <img
                                                                    src={item.img}
                                                                    className="img-fluid img-thumbnail img-cart-item" alt="Sheep"/>
                                                            </td>
                                                            <td>{item.name}</td>
                                                            <td>{item.price}</td>
                                                            <td>
                                                                <button value={idx} className={"btn btn-danger btn-sm"}
                                                                        onClick={this.handleDeleteItem.bind(this,idx)}>
                                                                    <i className="fa fa-times"/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                } )
                                            }
                                            </tbody>

                                        </table>
                                        :
                                        <h3 className="text-info">No tienes ningún producto en el carrito</h3>
                                }
                                <div className="d-flex justify-content-end">
                                    <h5>Total: <span className="price text-success">{final_price.toFixed(2)}</span></h5>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 d-flex justify-content-between">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                <button type="button" className="btn btn-success" onClick={this.handleGoToCheckout}>Comprar</button>
                            </div>
                        </div>
                }
            </div>
        </div>
    </div>
);
}
}
export default withRouter(Cart);