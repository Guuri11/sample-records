import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class Purchase extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        purchase: {},
        users: [],
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
            const {purchase} = this.props.match.params;
            this.getPurchase(purchase)
            this.getUsers();
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

    getPurchase( id ) {
        axios.get(`/index.php/api/v1.0/purchase/${id}`).then(res => {
            if (res.data.success === true) {
                const purchase = res.data.results;
                this.setState({purchase: purchase, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    getUsers() {
        axios.get(`/index.php/api/v1.0/user`).then(res => {
            if (res.data.success === true) {
                const users = res.data.results;

                this.setState({users: users, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    _renderInfo = (purchase) => {

        const day = new Date(purchase.date.date).getDate();
        const month = new Date(purchase.date.date).getMonth();
        const year = new Date(purchase.date.date).getFullYear();

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
                            Nº de serie
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.serial_number}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="date" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Fecha de entrega
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {day+"-"+month+"-"+year}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="time" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Tiempo entre la compra y entrega
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.time !== null ? purchase.time.d+" dia/s y "+purchase.time.h+" hora/s aprox": 'Aún no especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="received" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Recibido
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.received ? "Sí": "No"}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="address" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Dirección
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.address}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="town" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Población
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.town !== null ? purchase.town: 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="city" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Ciudad
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.city !== null ? purchase.city: 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="country" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            País
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.country}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="final_price" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Precio final
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.final_price.toFixed(2)}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="name" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Usuario
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {purchase.user ? purchase.user.name: 'Anónimo'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="Comment" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Comentario
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {
                                purchase.comment !== null ? purchase.comment : 'No tiene'
                            }
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, purchase) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (purchase,users) => {

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
                            <label htmlFor="serial_number" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Nº de serie
                            </label>
                            {
                                this.state.errors.hasOwnProperty('serial_number') ?
                                    <p className={"text-danger"}>{this.state.errors.serial_number}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="serial_number" name="serial_number" defaultValue={purchase.serial_number}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="date" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Fecha de compra
                            </label>
                            {
                                this.state.errors.hasOwnProperty('date') ?
                                    <p className={"text-danger"}>{this.state.errors.date}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="date" name="date"
                                       className="form-control here"
                                       type="date"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="received" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Recibido
                            </label>
                            {
                                this.state.errors.hasOwnProperty('received') ?
                                    <p className={"text-danger"}>{this.state.errors.received}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select id={"received"} name={"received"} defaultValue={purchase.received ? "1":"0"}>
                                    <option value={"1"}>Sí</option>
                                    <option value={"0"}>No</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="address" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Dirección
                            </label>
                            {
                                this.state.errors.hasOwnProperty('address') ?
                                    <p className={"text-danger"}>{this.state.errors.address}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="address" name="address" defaultValue={purchase.address}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="town" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Población
                            </label>
                            {
                                this.state.errors.hasOwnProperty('town') ?
                                    <p className={"text-danger"}>{this.state.errors.town}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="town" name="town" defaultValue={purchase.town !== null ? purchase.town:''}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="city" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Ciudad
                            </label>
                            {
                                this.state.errors.hasOwnProperty('city') ?
                                    <p className={"text-danger"}>{this.state.errors.city}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="city" name="city" defaultValue={purchase.city !== null ? purchase.city:''}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="country" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                País
                            </label>
                            {
                                this.state.errors.hasOwnProperty('country') ?
                                    <p className={"text-danger"}>{this.state.errors.country}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="country" name="country" defaultValue={purchase.country}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="final_price" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Precio final
                            </label>
                            {
                                this.state.errors.hasOwnProperty('final_price') ?
                                    <p className={"text-danger"}>{this.state.errors.final_price}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="final_price" name="final_price" defaultValue={purchase.final_price.toFixed(2)}
                                       className="form-control here"
                                       type="number" step="0.01"/>
                            </div>
                        </div>


                        <div className="form-group row">
                            <label htmlFor="artist" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Usuario
                            </label>
                            {
                                this.state.errors.hasOwnProperty('user') ?
                                    <p className={"text-danger"}>{this.state.errors.user}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select name={"user"} id={"user"}>
                                    <option value={""}>Anónimo</option>
                                    {
                                        users.map( (user, idx) => {
                                            return (
                                                <option key={idx} value={user.id}>{user.name}</option>
                                            )
                                        } )
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="comment" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Comentario
                            </label>
                            {
                                this.state.errors.hasOwnProperty('comment') ?
                                    <p className={"text-danger"}>{this.state.errors.comment}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="comment" name="comment" defaultValue={purchase.comment !== null ? purchase.comment:''}
                                       className="form-control here"
                                       type="text"/>
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
    handleDelete = (purchase) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {
            axios.delete(`/index.php/api/v1.0/purchase/delete/${purchase.id}`).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/ventas',
                            state: {delete_success: "Venta eliminada"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar la venta"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar la venta"} } )
            });
        }
    }

    /* UPDATE CALL */
    handleUpdate = (e) => {
        e.preventDefault();

        const serial_number = document.querySelector('#serial_number').value;
        const date = document.querySelector('#date').value;
        const received = document.querySelector('#received').value;
        const address = document.querySelector('#address').value;
        const town = document.querySelector('#town').value;
        const city = document.querySelector('#city').value;
        const country = document.querySelector('#country').value;
        const final_price = document.querySelector('#final_price').value;
        const user = document.querySelector('#user').value;
        const comment = document.querySelector('#comment').value;
        const {purchase} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serial_number: serial_number, date: date, received: received, user: user,
                address: address, town: town, city: city, country: country, final_price: final_price, comment: comment
            })
        };
        this.setState( { sending: true } )

        // Make the API call
        fetch(`/index.php/api/v1.0/purchase/edit/${purchase.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    this.setState({ purchase:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                }else
                    this.setState({ success: false, errors: data.error.errors ? data.error.errors: data.error.code === 0 ? {serial_number:"Número de serie repetido"}:''
                        , submited: true, sending: false })
            }).catch(e=>{});

    }



    render() {
        const { purchase, users, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Venta {purchase.serial_number}</h1>
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
                                                        this._renderInfo(purchase) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(purchase,users ) : null
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

export default Purchase;