import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Header from "../../components/admin/Header";
import Pagination from "react-js-pagination";

class Comments extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        loading: true,
        items: [],
        token: '',
        total_items: [],
        active_page : 1,
        items_per_page: 5,
        message: '',
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getToken();
            this.getComments();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getComments = () => {
        axios.get('/api/v1.0/comment').then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { items: res.data.results, total_items: res.data.results, loading: false } );
            } else {
                <Redirect to={'error404'}/>
            }

        }).catch()
    }

    getToken() {
        axios.get('/api/v1.0/user/token').then(res => {
            if (res.data.success === true) {
                const token = res.data.results;

                this.setState({token: token});
            }
        }).catch();
    }

    // Filter by search
    handleSearch = (e) => {
        // Get input value
        const search_request = e.target.value.toLowerCase();
        if (search_request !== ""){

            // Filter comments searching in his text and product/event/purchase/post name
            const search_results = this.state.items.filter( (comment) => {
                let comment_slug = comment.comment ;
                comment_slug = comment.product !== null ? comment_slug + comment.product.name : comment_slug;
                comment_slug = comment.event !== null ? comment_slug + comment.event.name : comment_slug;
                comment_slug = comment.post !== null ? comment_slug + comment.post.title : comment_slug;
                comment_slug = comment.purchase !== null ? comment_slug + comment.purchase.serial_number : comment_slug;
                return comment_slug.toLowerCase().indexOf(search_request) !== -1;
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
        const {token} = this.state;

        if (ans) {

            let {total_items} = this.state;

            axios.delete(`/api/v1.0/comment/delete/${id}`, {data: {token: token }}).then(res => {
                if (res.data.success === true) {
                    total_items = total_items.filter(function( item ) {
                        return item.id !== parseInt(id);
                    });
                    this.setState({ total_item: total_items, items: total_items ,message: 'Comentario eliminado' });
                }
            }).catch(error => {
                this.setState( { message: "No se pudo borrar el comentario" } )
            });
        }
    }



    render() {
        const { active_page, items_per_page, items, loading, message} = this.state;

        // Logic for pagination
        const indexLastEvent = active_page * items_per_page;
        const indexFirstEvent = indexLastEvent - items_per_page;
        const currentItems = items.slice(indexFirstEvent, indexLastEvent);

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Comentarios</h1>
                            </div>
                            {
                                loading ?
                                    null
                                    :
                                    <div className={"row"}>
                                        <div className="card shadow mb-4 w-100">
                                            <div className="card-header py-3">
                                                <h5 className="m-0 font-weight-bold text-sr">Todos los comentarios</h5>
                                                {
                                                    message !== '' ?
                                                        <h6 className={"text-info"}>{message}</h6>
                                                        :
                                                        null
                                                }
                                                {
                                                    // Delete message
                                                    this.props.location.state !== undefined ?
                                                        <h6 className={"text-info"}>{this.props.location.state.delete_success}</h6>
                                                        :
                                                        null
                                                }
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-4">
                                                            <div className="quantity_items" id="quantity_items">
                                                                <label>Mostrar
                                                                    <select name="quantity_items" aria-controls="dataTable"
                                                                            className="custom-select custom-select-sm form-control form-control-sm"
                                                                            onChange={this.handleItemsPerPage}>
                                                                        <option value={5}>5</option>
                                                                        <option value={10}>10</option>
                                                                        <option value={15}>15</option>
                                                                        <option value={20}>20</option>
                                                                    </select> comentarios
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-4">
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
                                                        <div className="col-sm-12 col-md-4">
                                                            <div id="dataTable_filter" className="dataTables_filter">
                                                                <label>Buscar:<input type="search"
                                                                                     className="form-control form-control-sm"
                                                                                     placeholder=""
                                                                                     aria-controls="dataTable"
                                                                                     onChange={this.handleSearch}/></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <table className="table table-bordered" id="dataTable" width={100}
                                                           cellSpacing="0">
                                                        <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Comentario</th>
                                                            <th>Product</th>
                                                            <th>Noticia</th>
                                                            <th>Evento</th>
                                                            <th>Compra</th>
                                                            <th>Creado el dia</th>
                                                            <th>Actualizado el dia</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                        </thead>
                                                        <tfoot>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Comentario</th>
                                                            <th>Product</th>
                                                            <th>Noticia</th>
                                                            <th>Evento</th>
                                                            <th>Compra</th>
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
                                                                        <td>{item.comment}</td>
                                                                        <td>{item.product !== null ?
                                                                            <Link to={`/admin/productos/${item.product.id}`}>{item.product.name}</Link> : ''}</td>
                                                                        <td>{item.post !== null ?
                                                                            <Link to={`/admin/noticias/${item.post.id}`}>{item.post.title}</Link> : ''}</td>
                                                                        <td>{item.event !== null ?
                                                                            <Link to={`/admin/eventos/${item.event.id}`}>{item.event.name} </Link> : ''}</td>
                                                                        <td>{item.purchase !== null ?
                                                                            <Link to={`/admin/ventas/${item.purchase.id}`}>{item.purchase.serial_number} </Link> : ''}</td>
                                                                        <td>{created_at_day+"-"+created_at_month+"-"+created_at_year}</td>
                                                                        <td>{updated_at_day+"-"+updated_at_month+"-"+updated_at_year}</td>

                                                                        <td>
                                                                            <Link to={`/admin/comentarios/${item.id}`} className={"font-weight-bolder"}>
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
                            }
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>

        )
    }
}

export default Comments;