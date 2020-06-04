import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import PropTypes from "prop-types";
import axios from "axios";
import _ from "lodash";
import CommentForm from "../../components/public/CommentForm";
import Comment from "../../components/public/Comment";
import { withRouter } from 'react-router-dom';

class Product extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        product: {},
        comments:[],
        token: '',
        user_data: [],
        can_comment: false,
        sending: false,
        comment_submited: false,
        comment_success: false,
        saved_at_cart: false
    }

    static propTypes = {
        match: PropTypes.shape({
            params:PropTypes.object,
            isExact:PropTypes.bool,
            path:PropTypes.string,
            url: PropTypes.string
        })
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted){
            const {id} = this.props.match.params;
            this.getProduct({id});
            this.getComments({id});
            this.userCanComment();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getProduct({ id }) {
        axios.get(`/api/v1.0/product/${id}`).then(res => {
            if (res.data.success === true) {
                this.setState({product: res.data.results})
            }
        }).catch(error => {
            this.props.history.push('/error404');
        });
    }

    // CSRF Token
    getToken() {
        axios.get('/api/v1.0/user/token').then(res => {
            if (res.data.success === true) {
                const token = res.data.results;

                this.setState({token: token});
            }
        }).catch();
    }


    // Api call to get all the comments
    getComments({ id }) {
        axios.get(`/api/v1.0/comment/?product=${id}`).then(res => {
            this.setState( { comments: res.data.results } )
        }).catch( e => {
            console.warn('No hay comentarios');
        })
    }

    // Check if user can comment
    userCanComment () {
        // check that user is loggued and get data
        axios.get('/api/v1.0/user/datatocomment').then(res => {
            if (res.data.success)
                this.setState( { user_data: res.data.results, can_comment: true, loading: false } )
        }).catch(error => {
            this.setState( { can_comment : false, loading: false } );
        });
    }

    // Send comment
    handleComment = (e) => {
        e.preventDefault();
        if (this.state.can_comment) {
            const comment = document.querySelector('#comment_user').value;
            const {token} = this.state;

            const { user_data, product } = this.state;
            this.setState( { sending:true, } )
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: comment, user: user_data.email, product: product.id, token: token})
            };

            // Make the Event call
            fetch("/api/v1.0/comment/new", requestOptions)
                .then(response => response.json())
                .then(data => {
                    const {id} = this.props.match.params;
                    this.getComments({id});
                    document.querySelector('#comment_user').value = '';
                    this.setState({ sending: false, comment_submited: true, comment_success: true })
                });

        } else {
            document.querySelector('#comment_user').value = '';
            this.setState({ comment_submited: true, comment_success: false })
        }
    }

    // Delete comment input
    handleDelete = () => {
        document.querySelector('#comment_user').value = '';
    }

    /* Sort comments by ID */
    orderCommentsByNewest = () => {
        const newest_comments = this.state.comments.sort( function compare( a, b ) {
            if ( a.id > b.id ){
                return -1;
            }
            if ( a.id < b.id ){
                return 1;
            }
            return 0;
        } );
        this.setState( { comments : newest_comments } );
    }

    orderCommentsByOldest = () => {
        const oldest_comments = this.state.comments.sort( function compare( a, b ) {
            if ( a.id < b.id ){
                return -1;
            }
            if ( a.id > b.id ){
                return 1;
            }
            return 0;
        });
        this.setState( { comments : oldest_comments } );
    }

    handleAddCart = () => {

        // This is item has all the information about the product
        const { product } = this.state;
        // This one will save only relevant information
        const item = { id: product.id, name: product.name, img:product.img_name, price: product.price , type: "product" }

        // Get cart items
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (cart === null){
            localStorage.setItem('cart', JSON.stringify([item]));
        } else {
            cart.push(item);

            // This will delete duplicate items from cart
            cart = _.uniqWith(cart, _.isEqual);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        this.setState( { saved_at_cart : true })
    }

    handleBuyItem = () => {
        // This is item has all the information about the product
        const { product } = this.state;
        // This one will save only relevant information
        const item = { id: product.id, name: product.name, img:product.img_name, price: product.price , type: "product" }

        // Get cart items
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (cart === null){
            localStorage.setItem('cart', JSON.stringify([item]));
        } else {
            cart.push(item);

            // This will delete duplicate items from cart
            cart = _.uniqWith(cart, _.isEqual);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        this.props.history.push('/checkout');
    }



    render() {

        const { product, loading, comments, can_comment, user_data, comment_submited, comment_success, saved_at_cart } = this.state;

        return (
            <div>
                <Title title={"SR - INICIO"}/>
                <Header/>
                {
                    loading ?
                        null
                        :
                        <div className="container justify-content-center product box-rounded mx-auto vertical-center mb-2">
                            <div className="row wow fadeIn">
                                <div className="col-md-6 mb-4">
                                    <img src={product.img_name} className="img-fluid frame mt-15" alt="Imagen no disponible"/>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="p-4">
                                        <h1>{product.name}</h1>
                                        <hr/>
                                        <h3 className="text-sr">{product.price}€</h3>
                                        <p className="lead font-weight-bold">Descripción</p>
                                        <p>{product.description}</p>
                                        <p><span className={"font-weight-bold"}>Stock:</span> {product.stock}</p>
                                        {
                                            product.size !== null ?
                                                <p><span className={"font-weight-bold"}>Talla:</span> {product.size}</p>
                                                :
                                                null
                                        }
                                        <button className="btn btn-primary btn-md my-0 p btn-primary-sr ml-5"
                                                type="submit" onClick={this.handleBuyItem}>Comprar
                                            <span className="fa fa-shopping-bag"/>
                                        </button>
                                        <button className="btn btn-primary btn-md my-0 p btn-primary-sr ml-3"
                                                type="submit" onClick={this.handleAddCart}>Añadir al carrito
                                            <span className="fa fa-shopping-cart"/>
                                        </button>
                                        {
                                            saved_at_cart ?
                                                <p className="text-success">Producto guardado!</p>
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                                <div className="col-12 mt-3">
                                    <div className="accordions mb-5" id="accordion" role="tablist"
                                         aria-multiselectable="true">
                                        <div className="panel single-accordion">
                                            <h6>
                                                <a role="button" aria-expanded="true" aria-controls="collapseThree"
                                                   className="collapsed" data-parent="#accordion" data-toggle="collapse"
                                                   href="#collapseThree">
                                                    Comentarios
                                                    <span className="accor-open"><i className="fa fa-plus"
                                                                                    aria-hidden="true"/></span>
                                                    <span className="accor-close"><i className="fa fa-minus"
                                                                                     aria-hidden="true"/></span>
                                                </a>
                                            </h6>
                                            <div id="collapseThree" className="accordion-content collapse">
                                                <div className="col-12">
                                                    <div className="comments">
                                                        <div className="comments-details">
                                                                <span
                                                                    className="total-comments comments-sort">{comments.length} comentarios</span>
                                                            <span className="dropdown ml-5">
                                                                    <button type="button" className="btn dropdown-toggle"
                                                                            data-toggle="dropdown">Ordenar por <span
                                                                        className="caret"/></button>
                                                                    <div className="dropdown-menu">
                                                                        <p className="dropdown-item" onClick={this.orderCommentsByNewest}>Últimos</p>
                                                                        <p className="dropdown-item" onClick={this.orderCommentsByOldest}>Antiguos</p>
                                                                    </div>
                                                                </span>
                                                        </div>
                                                        <CommentForm
                                                            auth={can_comment}
                                                            img={user_data.img_profile}
                                                            handleComment={this.handleComment}
                                                            handleDelete={this.handleDelete}
                                                            submited={comment_submited}
                                                            success={comment_success}
                                                        />

                                                        {/* COMMENTS */}
                                                        <div className="comments-box text-align-left">
                                                            {
                                                                comments.map((comment,idx)=>{
                                                                    return (
                                                                        <Comment key={idx}
                                                                                 img={comment.user.img_profile}
                                                                                 name={comment.user.name}
                                                                                 surname={comment.user.surname}
                                                                                 comment={comment.comment}
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                <Footer/>
            </div>
        );
    }
}
export default withRouter(Product);