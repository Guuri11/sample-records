import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import PropTypes from 'prop-types';
import axios from "axios";
import {Link} from "react-router-dom";
import Comment from "../../components/public/Comment";
import CommentForm from "../../components/public/CommentForm";

class Post extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        post: {},
        day: '',
        month: '',
        year: '',
        comments:[],
        user_data: [],
        can_comment: false,
        loading: true,
        sending: false,
        comment_submited: false,
        comment_success: false
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
            this.getPost({ id });
            this.getComments({id});
            this.userCanComment();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getPost({ id }) {
        axios.get(`/api/v1.0/post/${id}`).then(res => {
            if (res.data.success === true) {
                const post = res.data.results;
                const day = new Date(post.created_at.date).getDate();
                const month = new Date(post.created_at.date).getMonth();
                const year = new Date(post.created_at.date).getFullYear();

                this.setState({post: post, day: day, month: month, year: year});
            }
        }).catch(error => {
            this.props.history.push('/error404');
        });
    }

    getComments({ id }) {
        axios.get(`/api/v1.0/comment/?post=${id}`).then(res => {
                if (res.data.success)
                    this.setState( { comments: res.data.results } )
        }).catch(e => {})
    }

    userCanComment () {
        // check that user is loggued and get data
        axios.get('/api/v1.0/user/datatocomment').then(res => {
            if (res.data.success)
                this.setState( { user_data: res.data.results, can_comment: true, loading: false } )
        }).catch(error => {
            this.setState( { can_comment : false, loading: false } );
        });
    }

    handleComment = (e) => {
        e.preventDefault();
        if (this.state.can_comment) {
            const comment = document.querySelector('#comment_user').value;
            const { user_data, post } = this.state;
            this.setState( { sending:true, } )
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: comment, user: user_data.email, post: post.id})
            };

            // Make the Post call
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

    // Delete comment input value
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


    render() {
        const { post,day,month,year, loading, comments, can_comment, user_data, comment_submited, comment_success } = this.state;

        return (
                <div>
                <Title title={"SR - "+post.title === undefined ? "NOTICIAS":post.title}/>
                <Header/>

                {/* POST CONTENT */}
                {
                    loading ?
                        <span/>
                        :
                        <div className="blog-area section-padding-100">
                            <div className="container">
                                <div className="row justify-content-center bg-white">
                                    <div className="col-12">
                                        <div className="single-blog-post mb-5">
                                            <div className="blog-post-thumb mt-3">
                                                <img src={post.img_name} alt="Imagen no disponible"/>
                                            </div>
                                            <div className="post-content">
                                                <h2 className="text-sr">{post.title}</h2>
                                                <hr/>
                                                <p className="">Publicado el {day+"/"+month+"/"+year}</p>
                                                <div className="post-meta d-flex mb-3">
                                                    <p className="tags">{comments.length} comentarios</p>
                                                </div>
                                                <div className="content">
                                                    <p>{post.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
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
                                                                <span className="dropdown">
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
                                    <div className="col-12 text-align-center mb-4">
                                        <Link to={'/noticias'}>
                                            <button className="btn btn-primary btn-primary-sr">Volver</button>
                                        </Link>
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
export default Post;