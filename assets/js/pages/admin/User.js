import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import PropTypes from "prop-types";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class User extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        user: {},
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
            const {user} = this.props.match.params;
            this.getUser(user);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getUser( id ) {
        axios.get(`/api/v1.0/user/${id}`).then(res => {
            if (res.data.success === true) {
                const user = res.data.results;

                this.setState({user: user, loading: false});
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

    _renderInfo = (user) => {

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
                            {user.name}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="surname" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Apellidos
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {user.surname ? user.surname : ''}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="alias" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Email
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {user.email}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="role" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Roles
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {user.role.map(role => {
                                return role+" "
                            })}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="address" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Dirección
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {user.address ? user.address : 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="postal_code" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Código postal
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {user.postal_code ? user.postal_code : 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="town" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Población
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {user.town ? user.town : 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="city" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Ciudad
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {user.city ? user.city : 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="town" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Teléfono
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            {user.phone ? user.phone : 'No especificado'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="img" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                            Imágen de perfil
                        </label>
                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                            <img src={user.profile_image} alt={"Imagen no disponible"} width={75} className={"img img-fluid"}/>
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, user) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (user) => {

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
                                    <p className={"text-danger"}>{this.state.errors.user}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="name" name="name" defaultValue={user.name}
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
                                <input id="surname" name="surname" defaultValue={user.surname}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="email" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Email
                            </label>
                            {
                                this.state.errors.hasOwnProperty('email') ?
                                    <p className={"text-danger"}>{this.state.errors.email}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="email" name="email" defaultValue={user.email}
                                       className="form-control here"
                                       type="email"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="role" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Roles
                            </label>
                            {
                                this.state.errors.hasOwnProperty('role') ?
                                    <p className={"text-danger"}>{this.state.errors.role}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <select name={"role"} id={"role"} defaultValue={['ROLE_USER']} multiple={true}>
                                    <option value={'ROLE_USER'}>Usuario normal</option>
                                    <option value={'ROLE_ADMIN'}>Admin</option>
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
                                <input id="address" name="address" defaultValue={user.address !== null ? user.address:''}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="postal_code" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Código postal
                            </label>
                            {
                                this.state.errors.hasOwnProperty('postal_code') ?
                                    <p className={"text-danger"}>{this.state.errors.postal_code}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="postal_code" name="postal_code" defaultValue={user.postal_code !== null ? user.postal_code:''}
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
                                <input id="town" name="town" defaultValue={user.town !== null ? user.town:''}
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
                                <input id="city" name="city" defaultValue={user.city !== null ? user.city:''}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="phone" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                Teléfono
                            </label>
                            {
                                this.state.errors.hasOwnProperty('phone') ?
                                    <p className={"text-danger"}>{this.state.errors.phone}</p> : null
                            }
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                <input id="phone" name="phone" defaultValue={user.phone !== null ? user.phone:''}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="img" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                image
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
    handleDelete = (user) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {

            axios.delete(`/api/v1.0/user/delete/${user.id}`).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/usuarios/',
                            state: {delete_success: "Usuario eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar el usuario"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar el usuario"} } )
            });
        }
    }

    handleUpdate = (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const surname = document.querySelector('#surname').value;
        const email = document.querySelector('#email').value;
        const role = document.querySelector('#role').selectedOptions;
        const address = document.querySelector('#address').value;
        const postal_code = document.querySelector('#postal_code').value;
        const town = document.querySelector('#town').value;
        const city = document.querySelector('#city').value;
        const phone = document.querySelector('#phone').value;
        const img = document.querySelector('#img').files[0];
        const {user} = this.state;

        let arr_roles = [];

        // role variable cant be stringify: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
        // so we have to access in each option value manually an store in a different variable
        Object.keys(role).map( (option) => {
            arr_roles.push(role[option].value)
        } )

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, surname: surname, email: email, roles: arr_roles, address: address, postal_code: postal_code,
                                        town: town, city: city, phone: phone})
        };
        this.setState( { sending: true } )

        // If image is edited send it, if not only send the rest of data
        if (img !== undefined){
            const formData = new FormData();
            formData.append('img',img);

            // Make the API call
            fetch(`/api/v1.0/user/edit/${user.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ user:data.results })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{});

            // Make the API call
            axios.post(`/api/v1.0/user/upload-img/${user.id}`, formData, {})
                .then(res=> {
                    if (res.data.success){
                        this.setState({ user:res.data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: res.data.error.errors, submited: true, sending: false })
                } )
                .catch(e=>{
                    let {errors} = this.state;
                    errors.cant_upload_img = "No se ha podido subir la imagen";
                    this.setState({ success: false, errors: errors, submited: true, sending: false }) })

        } else {
            fetch(`/api/v1.0/user/edit/${user.id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success){
                        this.setState({ user:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                    }else
                        this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
                }).catch(e=>{});
        }

    }

    render() {
        const { user, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Usuario {user.email}</h1>
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
                                                        this._renderInfo(user) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(user) : null
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

export default User;