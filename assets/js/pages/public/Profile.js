import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import Breadcumb from "../../components/public/Breadcumb";
import axios from "axios";
import {Link, Redirect, withRouter} from "react-router-dom";
import SimpleTooltip from "../../components/public/SimpleTooltip";

class Profile extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }


    state = {
        info: {},
        profile_img: '',
        header_img: '',
        comments: [],
        purchases: [],
        loading: true,
        data_submited: false,
        data_success: false,
        errors: [],
        active: 'info-user'
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            // Check if user is loggued
            if (sessionStorage.getItem('auth') === "true"){

                // Get info to the user
                const info = await axios.get(`/api/v1.0/user/profile/info`).catch(e=>{})
                if (info === undefined){
                    this.props.history.push({
                        pathname: '/login',
                        state: { redirect_message: "Para entrar a tu perfil necesitas iniciar sesión" }
                    });
                }
                // Get comments and purchases by the user filtering by his ID
                const [comments,purchases] = await Promise.all([
                    axios.get(`/api/v1.0/comment?user=${info.data.results[0].id}`).catch(e=>{}),
                    axios.get(`/api/v1.0/purchase?user=${info.data.results[0].id}`).catch(e=>{})
                ])

                this.setState({
                    info: info.data.results[0],
                    profile_img: info.data.results[0].profile_image,
                    header_img: info.data.results[0].header_image,
                    comments: comments ? comments.data.results:[],
                    purchases: purchases ? purchases.data.results:[],
                    loading: false })

            } else {
                this.props.history.push({
                    pathname: '/login',
                    state: { redirect_message: "Para entrar a tu perfil necesitas iniciar sesión" }
                });
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    _renderInfo = ({info}) => {

        return (
            <div className="col-12 col-md-8">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <h4>{info.name} {info.surname}</h4>
                                <hr/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group row">
                                    <label htmlFor="username" className="col-4 col-form-label">
                                        Nombre
                                    </label>
                                    <div className="col-8">
                                        {info.name}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="name" className="col-4 col-form-label">Apellidos</label>
                                    <div className="col-8">
                                        {info.surname}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="lastname" className="col-4 col-form-label">Email</label>
                                    <div className="col-8">
                                        {info.email}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="text" className="col-4 col-form-label">Dirección</label>
                                    <div className="col-8">
                                        {info.address}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="select" className="col-4 col-form-label">Población</label>
                                    <div className="col-8">
                                        {info.town}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="select" className="col-4 col-form-label">Código postal</label>
                                    <div className="col-8">
                                        {info.postal_code}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="email"
                                           className="col-4 col-form-label">Provincia</label>
                                    <div className="col-8">
                                        {info.city}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="website"
                                           className="col-4 col-form-label">Teléfono</label>
                                    <div className="col-8">
                                        {info.phone}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="publicinfo" className="col-4 col-form-label">Tarjeta de crédito</label>
                                    <div className="col-8">
                                        {info.credit_card}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    _renderUpdateInfo = ({info}) => {
        return (
            <div className="col-12 col-md-8">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <h4>{info.name} {info.surname}</h4>
                                <hr/>
                                {
                                    this.state.data_submited ?
                                        this.state.data_success ?
                                            <p className={"text-success"}>Perfil actualizado</p>
                                            :
                                            <p className={"text-danger"}>No se pudo actualizar el perfil</p>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <form onSubmit={this.handleUpdateInfo}>
                                    <div className="form-group row">
                                        <label htmlFor="name" className="col-4 col-form-label">
                                            Nombre
                                        </label>
                                        <div className="col-8">
                                            <input id="name" name="name" defaultValue={info.name}
                                                   className="form-control here" required={true}
                                                   type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="surname" className="col-4 col-form-label">Apellidos</label>
                                        <div className="col-8">
                                            <input id="surname" name="surname" defaultValue={info.surname}
                                                   className="form-control here"
                                                   type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="address" className="col-4 col-form-label">Dirección</label>
                                        <div className="col-8">
                                            <input id="address" name="address" defaultValue={info.address}
                                                   className="form-control here" 
                                                   type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="town" className="col-4 col-form-label">Población</label>
                                        <div className="col-8">
                                            <input id="town" name="town" defaultValue={info.town}
                                                   className="form-control here" 
                                                   type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="town" className="col-4 col-form-label">Código postal</label>
                                        <div className="col-8">
                                            <input id="postal_code" name="postal_code" defaultValue={info.postal_code}
                                                   className="form-control here"
                                                   type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="city"
                                               className="col-4 col-form-label">Provincia</label>
                                        <div className="col-8">
                                            <input id="city" name="city" defaultValue={info.city}
                                                   className="form-control here" 
                                                   type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="phone"
                                               className="col-4 col-form-label">Teléfono</label>
                                        <div className="col-8">
                                            <input id="phone" name="phone" defaultValue={info.phone}
                                                   className="form-control here" 
                                                   type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="credit_card" className="col-4 col-form-label">Tarjeta de crédito</label>
                                        <div className="col-8">
                                            <input id="credit_card" name="credit_card" defaultValue={info.credit_card}
                                                   className="form-control here" 
                                                   type="text"/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="offset-4 col-8">
                                            <button name="submit" type="submit"
                                                    className="btn btn-primary btn-success">Actualizar Perfil
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

    _renderPurchases = ({purchases}) => {
        return (
            <div className="col-12 col-md-8">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <h4>Compras</h4>
                                <hr/>
                            </div>
                        </div>
                        <div className="row">
                            {
                                purchases.length >0 ?
                                    <div className="col-md-12">
                                        {
                                            purchases.map((item,idx) => {
                                                return (
                                                    <div key={idx} className="form-group row">
                                                        <div className="col-8">
                                                            {
                                                                item.ticket === false ?
                                                                    <Link to={`/tienda/${item.product.id}`}>{idx+1}. {item.product.name}</Link>
                                                                    :
                                                                    <Link to={`/eventos/${item.ticket.event.id}`}>{idx+1}. {item.ticket.event.name}</Link>
                                                            }
                                                        </div>
                                                        <div className="col-4">
                                                            {item.final_price.toFixed(2)} €
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    :
                                    <div className="col-md-12">
                                        <p className={"text-info"}>No has realizado ninguna compra</p>
                                    </div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    _renderComments = ({comments}) => {
        return (
            <div className="col-12 col-md-8">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <h4>Comentarios</h4>
                                <hr/>
                            </div>
                        </div>
                        <div className="row">
                            {
                                this.state.errors.length > 0 ?
                                    <h3 className={"text-danger"}>{errors[0]}</h3>
                                    :
                                    null
                            }
                            {
                                comments.length > 0 ?
                                    <div className="col-md-12">
                                        {
                                            comments.map((comment,idx) => {
                                                let route, item;
                                                if (comment.event !==null){
                                                    route = `/eventos/${comment.event.id}`
                                                    item = comment.event.name;
                                                }
                                                else if (comment.product !== null){
                                                    route = `/tienda/${comment.product.id}`
                                                    item = comment.product.name;

                                                }
                                                else{
                                                    route = `/noticias/${comment.post.id}`
                                                    item = comment.post.title;
                                                }

                                                return (
                                                    <div key={idx} className="form-group row">
                                                        <p className="col-4">
                                                            <Link to={route}>{idx+1}.{item}</Link>
                                                        </p>
                                                        <div className="col-6">
                                                            {comment.comment}
                                                        </div>
                                                        <div className="col-2" onClick={this.handleDeleteComment.bind(this,idx)}>
                                                            <button className={"btn btn-danger btn-sm"} id={"delete-comment"}>
                                                                <i className="fa fa-times"/>
                                                            </button>
                                                            <SimpleTooltip target="delete-comment" >Eliminar comentario</SimpleTooltip>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <div className="col-md-12">
                                        <p className={"text-info"}>No has realizado ningún comentario</p>
                                    </div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    _renderChangePassword = () => {
        return (
            <div className="col-12 col-md-8">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <h4>Cambiar contraseña</h4>
                                <hr/>
                                {
                                    this.state.data_submited ?
                                        this.state.data_success ?
                                            <p className={"text-success"}>Perfil actualizado</p>
                                            :
                                            <p className={"text-danger"}>No se pudo actualizar el perfil</p>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        <div className="row ml-3">
                            <form onSubmit={this.handleChangePassword}>
                                <div className="form-group login-group">
                                    <label htmlFor="password">Contraseña actual</label>
                                    {
                                        this.state.errors.required_old_password ?
                                            <p className={"text-danger"}>{this.state.errors.required_old_password}</p>
                                            :
                                            null
                                    }
                                    {
                                        this.state.errors.old_password_fail ?
                                            <p className={"text-danger"}>{this.state.errors.old_password_fail}</p>
                                            :
                                            null
                                    }
                                    <input type="password" className="form-control" id="password"
                                           aria-describedby="password" name={"password"}/>
                                    <small id="emailHelp" className="form-text text-muted"><i
                                        className="fa fa-lock mr-2"/>Nunca compartiremos tu información privada.</small>
                                    <label htmlFor="new_password">Nueva contraseña</label>
                                    {
                                        this.state.errors.required_new_password ?
                                            <p className={"text-danger"}>{this.state.errors.required_new_password}</p>
                                            :
                                            null
                                    }
                                    {
                                        this.state.errors.new_password_fail ?
                                            <p className={"text-danger"}>{this.state.errors.new_password_fail}</p>
                                            :
                                            null
                                    }
                                    <input type="password" className="form-control" id="new_password"
                                           aria-describedby="new_password" name={"new_password"}/>
                                    <small id="new_password" className="form-text text-muted">
                                        Mínimo 6 carácteres</small>
                                    <label htmlFor="repeat_password">Repite la nueva contraseña</label>
                                    <input type="password" className="form-control" id="repeat_password"
                                           aria-describedby="repeat_password" name={"repeat_password"}/>
                                </div>
                                <div className="form-group row ml-1">
                                    <button name="submit" type="submit"
                                            className="btn btn-primary btn-success">Actualizar Contraseña
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>

        )
    }

    handleUpdateInfo = (e) => {
        e.preventDefault();

        // Get data
        const name = document.querySelector('#name').value;
        const surname = document.querySelector('#surname').value;
        const address = document.querySelector('#address').value;
        const town = document.querySelector('#town').value;
        const postal_code = document.querySelector('#postal_code').value;
        const city = document.querySelector('#city').value;
        const phone = document.querySelector('#phone').value;
        const credit_card = document.querySelector('#credit_card').value;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, surname: surname, address: address, town: town,postal_code:postal_code,
                city: city, phone: phone, credit_card: credit_card})
        };

        // Make the API call
        fetch("/api/v1.0/user/profile/edit/info", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    this.setState({ info:data.results[0], data_submited: true, data_success: true })
                }else
                    this.setState({ data_success: false, message: "No se pudo actualizar el perfil", data_submited: true })
            }).catch(e=>{});

    }

    handleChangePassword = (e) => {
        e.preventDefault();

        // Get data
        const password = document.querySelector('#password').value;
        const new_password = document.querySelector('#new_password').value;
        const repeat_password = document.querySelector('#repeat_password').value;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: password, new_password: new_password, repeat_password: repeat_password })
        };

        // Make the API call
        fetch("/api/v1.0/user/profile/change-password", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    this.setState( { data_submited: true, data_success: true } )
                } else{
                    this.setState({ data_success: false, message: "No se pudo actualizar la contraseña", data_submited: true,
                                            errors: data.errors})
                }
            }).catch(e=>{});
    }

    handleChangeProfileImage = (e) => {
        e.preventDefault();
        const image_profile = document.querySelector('#input-img-profile').files[0];

        if (image_profile !== undefined){
            const formData = new FormData();

            formData.append('img_profile',image_profile)
            // Make the API call
            axios.post("/api/v1.0/user/profile/change-profile-image", formData, {

            }).then(res => { // then print response status
                if (res.data.success){
                    this.setState({ profile_img: res.data.results.profile_image })
                }
            }).catch(e=>{})
        }
    }

    handleDeleteComment = (idx) => {
        const ans = confirm("¿Estás seguro de que quieres borrar el comentario?");
        let { comments } = this.state;
        if (ans){
            axios.delete(`/api/v1.0/comment/delete/${comments[idx].id}`).then(res => {
                if (res.data.success === true) {
                    comments.splice(idx, 1);
                    this.setState({ comments: comments });
                }
            }).catch(error => {
                   this.setState( { errors: ["No se pudo borrar el comentario"] } )
            });
        }
    }

    handleDeleteAccount = () => {
        const ans = confirm("¿Estás seguro de que quieres borrar tu cuenta? Todos tus datos se borrarán y no podrás recuperarlos.");

        if (ans) {
            axios.delete('/api/v1.0/user/deleteaccount').then(res => {
                if (res.data.success === true) {
                    sessionStorage.removeItem('auth');
                    sessionStorage.removeItem('is_admin');
                    this.props.history.push('/');
                }
            }).catch(error => {
                this.setState( { errors: ["No se pudo borrar la cuenta"] } )
            });
        }
    }

    render() {

        const { info ,loading, active, profile_img, header_img } = this.state;
        const menu_active = "list-group-item list-group-item-action menu-item-profile active active-sr";
        const menu_inactive = "list-group-item list-group-item-action menu-item-profile";
        const dropdown_active = "dropdown-item active";
        const dropdown_inactive = "dropdown-item";
        return (
            <div>
                <Title title={"SR - INICIO"}/>
                <Header/>
                { loading ? null : <Breadcumb profile={true} header_user={header_img}/> }

                {
                    loading ?
                        null
                        :
                        <div className="container mt-4 mb-4">
                            <div className="row">
                                <div className="col-12 col-md-3 row mr-54 center-box profile">
                                    <div className="list-group col-12 mb-3">
                                        <form onSubmit={this.handleChangeProfileImage}>
                                            <div className="image-upload">
                                                <label htmlFor="input-img-profile">
                                                    <img src={"/img/users/profile/"+profile_img} className="img-profile" id={"img-profile"} alt="Imagen no disponible"/>
                                                    <SimpleTooltip target={"img-profile"}>Pulsa para cambiar la foto de perfil</SimpleTooltip>
                                                </label>

                                                <input id="input-img-profile" type="file" name={"img-profile"} defaultValue={info.img_profile}/>
                                            </div>
                                            <button name="submit" type="submit"
                                                    className="btn btn-primary btn-success">Actualizar Foto Perfil
                                            </button>
                                        </form>
                                        <p className={active === "info-user" ? menu_active:menu_inactive}
                                            onClick={()=>{ this.setState( { active: "info-user" } ) }}>
                                            Datos personales
                                        </p>
                                        <p className={active === "purchases-user" ? menu_active:menu_inactive}
                                           onClick={()=>{ this.setState( { active: "purchases-user" } ) }}>
                                            Compras
                                        </p>
                                        <p className={active === "comments-user" ? menu_active:menu_inactive}
                                           onClick={()=>{ this.setState( { active: "comments-user" } ) }}>
                                            Comentarios
                                        </p>
                                        <div className="dropdown show">
                                            <p className=" list-group-item list-group-item-action dropdown-toggle menu-item-profile"
                                               role="button" id="conf-user" data-toggle="dropdown" aria-haspopup="true"
                                               aria-expanded="false">
                                                Ajustes
                                            </p>

                                            <div className="dropdown-menu" aria-labelledby="conf-user">
                                                <p className={active === "edit-info-user" ? dropdown_active:dropdown_inactive}
                                                   onClick={()=>{ this.setState( { active: "edit-info-user" } ) }}
                                                >Editar información</p>
                                                <p className={active === "change-password-user" ? dropdown_active:dropdown_inactive}
                                                   onClick={()=>{ this.setState( { active: "change-password-user" } ) }}
                                                >Cambiar contraseña</p>
                                                <p className={dropdown_inactive}
                                                   onClick={ this.handleDeleteAccount.bind(this) }
                                                >Eliminar cuenta</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    active === "info-user" ?
                                        this._renderInfo(this.state)
                                        :
                                        null
                                }

                                {
                                    active === "purchases-user" ?
                                        this._renderPurchases(this.state)
                                        :
                                        null
                                }

                                {
                                    active === "comments-user" ?
                                        this._renderComments(this.state)
                                        :
                                        null
                                }

                                {
                                    active === "edit-info-user" ?
                                        this._renderUpdateInfo(this.state)
                                        :
                                        null
                                }

                                {
                                    active === "change-password-user" ?
                                        this._renderChangePassword()
                                        :
                                        null
                                }
                            </div>
                        </div>
                }



                <Footer/>
            </div>
        );
    }
}
export default withRouter(Profile);