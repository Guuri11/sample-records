import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import PropTypes from 'prop-types';
import axios from "axios";
import Comment from "../../components/public/Comment";
import CommentForm from "../../components/public/CommentForm";
import _ from 'lodash';
import chunk from 'lodash/chunk';
import {Link, withRouter} from "react-router-dom";

class Event extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        event: {},
        day: '',
        month: '',
        year: '',
        comments:[],
        user_data: [],
        can_comment: false,
        loading: true,
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
            this.getEvent({ id });
            this.getComments({id});
            this.userCanComment();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Api call to get the event
    getEvent({ id }) {
        axios.get(`/api/v1.0/event/${id}`).then(res => {
            if (res.data.success === true) {
                const event = res.data.results;
                const day = new Date(event.date.date).getDate();
                const month = new Date(event.date.date).getMonth();
                const year = new Date(event.date.date).getFullYear();

                this.setState({event: event, day: day, month: month, year: year, loading: false});
            }
        }).catch(error => {
            this.props.history.push('/error404');
        });
    }

    // Api call to get all the comments
    getComments({ id }) {
        axios.get(`/api/v1.0/comment/?event=${id}`).then(res => {
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
            const { user_data, event } = this.state;
            this.setState( { sending:true, } )
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: comment, user: user_data.email, event: event.id})
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

    // Add the event to the cart
    handleAddCart = () => {

        // This is item has all the information about the product
        const { event } = this.state;
        // This one will save only relevant information
        const item = { id: event.id, name: event.name, img:event.img_name, price: event.ticket_price , type: "event" }

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
        const { event } = this.state;
        // This one will save only relevant information
        const item = { id: event.id, name: event.name, img:event.img_name, price: 10.99 , type: "event" }

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
        const { event,day,month,year, loading, comments, can_comment, user_data, comment_submited, comment_success, saved_at_cart } = this.state;
        const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        return (
            <div>
                <Title title={"SR - "+event.name === undefined ? "EVENTO":event.name}/>
                <Header/>

                {/* EVENT CONTENT */}
                {
                    loading ?
                        null
                        :
                        <div className={"container"}>
                            <section className="mt-3">
                                <h1>{event.name}  <Link to={'/eventos'} className="event-back">(Volver)</Link></h1>
                                <div className="row event">
                                    <article className="card fl-left">
                                        <section className="date">
                                            <time dateTime="23th feb">
                                                <span>{day}</span><span>{months[month]}</span>
                                            </time>
                                        </section>
                                        <section className="card-cont">
                                            {
                                                saved_at_cart ?
                                                    <p className="text-success">Evento guardado!</p>
                                                    :
                                                    null
                                            }
                                            <small>{event.artist.alias}</small>
                                            <h3>En directo en {event.city}</h3>
                                            <h4 className={"text-info"}>{event.ticket_price} €</h4>
                                            <div className="even-date">
                                                <i className="fa fa-calendar"/>
                                                <time>
                                                    <span>{day} de {months[month]} {year}</span>
                                                </time>
                                            </div>
                                            <div className="even-info">
                                                <i className="fa fa-map-marker"/>
                                                <p>{event.place}</p>
                                            </div>
                                            <button style={{right: 100}} onClick={this.handleAddCart}>+Carrito</button>
                                            <button onClick={this.handleBuyItem}>Comprar</button>
                                        </section>
                                    </article>

                                </div>
                            </section>
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
                                                    <div className="comments-box">
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

                }
                <Footer/>
            </div>
        );
    }
}
export default withRouter(Event);