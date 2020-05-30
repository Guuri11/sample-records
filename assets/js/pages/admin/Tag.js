import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import Header from "../../components/admin/Header";
import Loading from "../../components/public/Loading";

class Tag extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        tag: {},
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
            const {tag} = this.props.match.params;
            this.getTag(tag)
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

    getTag( id ) {
        axios.get(`/api/v1.0/tag/${id}`).then(res => {
            if (res.data.success === true) {
                const tag = res.data.results;

                this.setState({tag: tag, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/admin/error404');
        });
    }

    _renderInfo = (tag) => {
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
                            {tag.tag}
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
                                    className="btn btn-danger ml-2" onClick={ this.handleDelete.bind(this, tag) }>Borrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    _renderUpdateInfo = (tag) => {
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
                                        <label htmlFor="tag" className="col-12 col-sm-12 col-md-3 col-lg-3 col-form-label font-weight-bolder">
                                            Nombre
                                        </label>
                                        {
                                            this.state.errors.hasOwnProperty('tag') ?
                                                <p className={"text-danger"}>{this.state.errors.tag}</p> : null
                                        }
                                        <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                                            <input id="tag" name="tag" defaultValue={tag.tag}
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
    handleDelete = (tag) => {
        const ans = confirm("¿Estás seguro de que quieres eliminar el siguiente recurso? No podrás recuperarlo más tarde");

        if (ans) {
            axios.delete(`/api/v1.0/tag/delete/${tag.id}`).then(res => {
                if (res.data.success === true) {
                    this.props.history.push(
                        {
                            pathname: '/admin/noticias/tags',
                            state: {delete_success: "Tag eliminado"}
                        }
                    );
                }else {
                    this.setState( { errors: {cant_delete:"No se pudo borrar el tag"} } )
                }
            }).catch(error => {
                this.setState( { errors: {cant_delete:"No se pudo borrar el tag"} } )
            });
        }
    }

    /* UPDATE CALL */
    handleUpdate = (e) => {
        e.preventDefault();

        const tag_value = document.querySelector('#tag').value;
        const {tag} = this.state;

        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: tag_value })
        };
        this.setState( { sending: true } )

        // Make the API call
        fetch(`/api/v1.0/tag/edit/${tag.id}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success){
                    this.setState({ tag:data.results, submited: true, success: true, section: "Mostrar", sending: false })
                }else
                    this.setState({ success: false, errors: data.error.errors, submited: true, sending: false })
            }).catch(e=>{});

    }

    render() {

        const { tag, loading, section, errors } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Tag {tag.tag}</h1>
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
                                                        this._renderInfo(tag) : null
                                                }
                                                {
                                                    section === "Editar" ?
                                                        this._renderUpdateInfo(tag) : null
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

export default Tag;