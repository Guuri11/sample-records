import React, { Component } from 'react';

class Cart extends Component {

    // TODO: COPIAR CODIGO Y HACER LOGICA DEL CARRITO

    render() {
        return (
            <div>
                <div className="modal fade" id="cartModal" tabIndex="-1" role="dialog" aria-labelledby="title-cart"
                     aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title" id="title-cart">
                                    Tu carrito
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table className="table table-image">
                                    <thead>
                                    <tr>
                                        <th scope="col"/>
                                        <th scope="col">Product</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Qty</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="w-25">
                                            <img
                                                src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/vans.png"
                                                className="img-fluid img-thumbnail" alt="Sheep"/>
                                        </td>
                                        <td>Vans Sk8-Hi MTE Shoes</td>
                                        <td>89$</td>
                                        <td className="qty"><input type="text" className="form-control" id="input1"
                                                                   value="2"/></td>
                                        <td>178$</td>
                                        <td>
                                            <a href="#" className="btn btn-danger btn-sm">
                                                <i className="fa fa-times"/>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-25">
                                            <img
                                                src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/vans.png"
                                                className="img-fluid img-thumbnail" alt="Sheep"/>
                                        </td>
                                        <td>Vans Sk8-Hi MTE Shoes</td>
                                        <td>89$</td>
                                        <td className="qty"><input type="text" className="form-control" id="input1"
                                                                   value="2"/></td>
                                        <td>178$</td>
                                        <td>
                                            <a href="#" className="btn btn-danger btn-sm">
                                                <i className="fa fa-times"/>
                                            </a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-end">
                                    <h5>Total: <span className="price text-success">89$</span></h5>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 d-flex justify-content-between">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-success">Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Cart;