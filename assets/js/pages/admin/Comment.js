import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../components/public/Loading";
import Header from "../../components/admin/Header";

class Comment extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        comment: {},
        users: [],
        relation: '',
        items_relation: [],
        loading: true,
        section: 'Mostrar',
        submited: false,
        success: false,
        sending: false,
        errors: {},
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted){
            const {comment} = this.props.match.params;
            this.getComment(comment)
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

    getComment( id ) {
        axios.get(`/api/v1.0/comment/${id}`).then(res => {
            if (res.data.success === true) {
                const comment = res.data.results;
                // Check from which entity comes the comment
                const relation = comment.product !== null ? "product":comment.event !== null ? "event": comment.post !== null ? "post":"purchase"
                this.setState({comment: comment, relation: relation, loading: false});
                this.getItemsRelation();
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    // Ex: If comment is from a post, get all posts so we can edit from which post is the comment
    getItemsRelation() {
        const {relation} = this.state;

        axios.get(`/api/v1.0/${relation}`).then(res => {
            if (res.data.success === true) {
                const items_relation = res.data.results;

                this.setState({items_relation: items_relation, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    getUsers() {
        axios.get(`/api/v1.0/user`).then(res => {
            if (res.data.success === true) {
                const users = res.data.results;

                this.setState({users: users, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    _renderInfo = (comment) => {
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
                        <label htmlFor="name" className="col-3 col-form-label font-weight-bolder">
                            Comentario
                        </label>
                        <div className="col-3">
                            {comment.comment}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="name" className="col-3 col-form-label font-weight-bolder">
                            Usuario
                        </label>
                        <div className="col-3">
                            {comment.user ? comment.user.name: 'Anónimo'}
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="name" className="col-3 col-form-label font-weight-bolder">
                            {
                                comment.product !== null ?
                                    "Producto"
                                    :
                                    comment.event !== null ?
                                        "Event"
                                        :
                                        comment.post !== null ?
                                            "Noticia"
                                            :
                                            "Compra"
                            }
                        </label>
                        <div className="col-3">
                            {
                                comment.product !== null ?
                                    comment.product.name
                                    :
                                    comment.event !== null ?
                                        comment.event.name
                                        :
                                        comment.post !== null ?
                                            comment.post.title
                                            :
                                            comment.purchase.serial_number
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, comment) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (comment,users, items_relation, relation) => {
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
                            <label htmlFor="comment" className="col-3 col-form-label font-weight-bolder">
                                Comentario
                            </label>
                            {
                                this.state.errors.hasOwnProperty('comment') ?
                                    <p className={"text-danger"}>{this.state.errors.comment}</p> : null
                            }
                            <div className="col-3">
                                <input id="comment" name="comment" defaultValue={comment.comment}
                                       className="form-control here"
                                       type="text"/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="artist" className="col-3 col-form-label font-weight-bolder">
                                Usuario
                            </label>
                            {
                                this.state.errors.hasOwnProperty('user') ?
                                    <p className={"text-danger"}>{this.state.errors.user}</p> : null
                            }
                            <div className="col-3">
                                <select name={"user"} id={"user"}>
                                    <option value={''}>Anónimo</option>
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
                            <label htmlFor="name" className="col-3 col-form-label font-weight-bolder">
                                {
                                    comment.product !== null ?
                                        "Producto"
                                        :
                                        comment.event !== null ?
                                            "Event"
                                            :
                                            comment.post !== null ?
                                                "Noticia"
                                                :
                                                "Compra"
                                }
                            </label>
                            <div className="col-3">
                                <select name={"item"} id={"item"}>
                                    {
                                        relation === "product" ?
                                            items_relation.map( (product, idx) => {
                                                return (
                                                    <option key={idx} defaultValue={product.id}>{product.name}</option>
                                                )
                                            } )
                                            :
                                            relation === "event" ?
                                                items_relation.map( (event, idx) => {
                                                    return (
                                                        <option key={idx} defaultValue={event.id}>{event.name}</option>
                                                    )
                                                } )
                                                :
                                                relation === "post" ?
                                                    items_relation.map( (post, idx) => {
                                                        return (
                                                            <option key={idx} defaultValue={post.id}>{post.name}</option>
                                                        )
                                                    } )
                                                    :
                                                    items_relation.map( (purchase, idx) => {
                                                        return (
                                                            <option key={idx} value={purchase.id}>{purchase.serial_number}</option>
                                                        )
                                                    } )
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-3">
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
    handleDelete = (comment) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {
            axios.delete(`/api/v1.0/comment/delete/${comment.id}`).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/comentarios',
                            state: {delete_success: "Comentario eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar el comentario"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar el comment"} } )
            });
        }
    }

    /* UPDATE CALL */
    handleUpdate = (e) => {
        e.preventDefault();

        const comment_value = document.querySelector('#comment').value;
        const user = document.querySelector('#user').value;
        const commented_on = document.querySelector('#item').value;
        const {comment, relation} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: comment_value, user: user,
                post: relation === "post" ? commented_on : null,
                product: relation === "product" ? commented_on : null,
                event: relation === "event" ? commented_on : null,
                purchase: relation === "purchase" ? commented_on : null
            })
        };
        this.setState( { sending: true } )

        // Make the API call
        fetch(`/api/v1.0/comment/edit/${comment.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    this.setState({ comment:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                }else
                    this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            }).catch(e=>{});

    }
    
    render() {
        const { comment, relation, users ,items_relation, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Comentario {comment.id}</h1>
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
                                                        this._renderInfo(comment) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(comment,users,items_relation,relation ) : null
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

export default Comment;