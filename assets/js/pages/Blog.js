import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Pagination from "react-js-pagination";
import Breadcumb from "../components/Breadcumb";
import CheckBox from "../components/Checkbox";

class Blog extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        success: false,
        loading: true,
        total_posts: [],
        posts: [],
        tags: [],
        artists: [],
        active_page : 1,
        posts_per_page: 2,
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getPosts();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    /* API REQUEST TO GET THE BLOG DATA */

    getPosts() {
        axios.get(`/api/v1.0/post`).then(res => {
            if (res.data.success === true){
                const posts = res.data.results;
                // Get tags from the posts collection
                let tags = posts.map(post => post.tags.map(tag=> tag.tag));
                tags = tags.flat();
                tags = [...new Set(tags)];

                // Get artists from posts collection
                let artists_alias = posts.map(post => post.artist.alias);
                artists_alias = [...new Set(artists_alias)];

                this.setState( { total_posts: posts, posts: posts, tags: tags, artists: artists_alias, loading:false } );
            } else {
                <Redirect to={'error404'}/>
            }

        })
    }

    /* SET CURRENT PAGE */
    handlePageChange(pageNumber) {
        this.setState({active_page: pageNumber});
    }



    /* RENDER POSTS */
    renderPosts = ({posts, active_page, posts_per_page}) => {
        // Logic for displaying posts
        const indexLastPost = active_page * posts_per_page;
        const indexFirstPost = indexLastPost - posts_per_page;
        const currentPosts = posts.slice(indexFirstPost, indexLastPost);

        return (
            <div  className="col-12 col-lg-9">
                {
                    posts.length === 0 ?
                        <h2>No hay resultados 😭</h2>
                        :
                        currentPosts.map((post, idx) => {
                            const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
                            const day = new Date(post.created_at.date).getDate();
                            const month = new Date(post.created_at.date).getMonth();
                            const year = new Date(post.created_at.date).getFullYear();
                            return (
                                <div key={idx} className="single-blog-post mb-5">
                                    <div className="blog-post-thumb">
                                        <Link to={`/noticia/${post.id}`}>
                                            <img src={post.img_name} alt={"Imagen no disponible"}/>
                                        </Link>
                                        <div className="post-date">
                                            <span>{day}</span>
                                            <span>{months[month]+" ‘"+year.toString().substr(-2)}</span>
                                        </div>
                                    </div>

                                    <div className="blog-content">
                                        <Link to={`/noticia/${post.id}`} className={"post-title"}>{post.title}</Link>
                                        <p>{post.description}</p>
                                        <Link to={`/noticia/${post.id}`}>
                                            <button className="btn btn-primary btn-primary-sr mt-2">Ver</button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                }
                <Pagination
                    activePage={active_page}
                    itemsCountPerPage={posts_per_page}
                    totalItemsCount={posts.length}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                    itemClass="page-item"
                    linkClass="page-link"
                />
            </div>
        )
    }

    /* RENDER WIDGET TAGS */
    renderTags = ({tags}) => {

        return (
            <div className="single-widget-area mb-3 bg-white">
                <div className="widget-title">
                    <h5>Tags</h5>
                </div>
                <div className="widget-content">
                    <ul>
                        {tags.map((tag, idx) => {
                            return (
                                <CheckBox
                                    key={idx}
                                    id={idx}
                                    handleCheckChieldElement={this.handleCheck}
                                    checked={false}
                                    classCheckBox={"blog-checkbox tag-checkbox"}
                                    value={tag.charAt(0).toUpperCase() + tag.slice(1)}
                                    />
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    handleCheck = () => {

        // Set the current posts all the posts to filter later
        let posts = this.state.total_posts;

        // Get tag checkboxes and check if there is any selected
        const tags_checkbox = document.querySelectorAll('.tag-checkbox')
        const artists_checkbox = document.querySelectorAll('.artist-checkbox')

        // Get inputs tags non-checked
        let empty = [].filter.call( tags_checkbox, function(el ) {
            return !el.checked
        });
        const tags_checked = !(tags_checkbox.length === empty.length);

        // Get inputs artists non-checked
        // Get inputs tags non-checked
        empty = [].filter.call( artists_checkbox, function( el ) {
            return !el.checked
        });
        const artists_checked = !(artists_checkbox.length === empty.length);


        if (tags_checked || artists_checked){
            // Check if post has tag checked
            let matchTag = [];
            posts.forEach(post => {

                // Filter by artists
                if (artists_checked && !tags_checked){
                    artists_checkbox.forEach(checkbox => {
                        if ( checkbox.classList[1] === 'artist-checkbox' && checkbox.checked && post.artist.alias.toLowerCase() === checkbox.defaultValue.toLowerCase() )
                            matchTag.push(post);
                    })
                } else if (tags_checked && !artists_checked){   // Filter by tags
                    post.tags.forEach(tag => {
                        tags_checkbox.forEach(checkbox => {
                            if ( checkbox.classList[1] === 'tag-checkbox' && checkbox.checked && tag.tag === checkbox.defaultValue.toLowerCase() )
                                matchTag.push(post);
                        })
                    })
                } else {
                    // Filter by both
                    post.tags.forEach(tag => {
                        tags_checkbox.forEach(tag_checkbox => {
                            artists_checkbox.forEach( artist_checkbox => {
                                if ( (tag_checkbox.checked && tag.tag === tag_checkbox.defaultValue.toLowerCase())
                                && (artist_checkbox.checked && post.artist.alias.toLowerCase() === artist_checkbox.defaultValue.toLowerCase()))
                                    matchTag.push(post);
                            } )
                        })
                    })
                }

            })

            // Filter array getting unique values.
            posts = [...new Set(matchTag)];
        }

        this.setState({posts: posts, active_page: 1})
    }

    /* RENDER WIDGET ARTISTS */
    renderArtists = ({artists}) => {

        return (
            <div className="single-widget-area mb-3 bg-white">
                <div className="widget-title">
                    <h5>Artistas</h5>
                </div>
                <div className="widget-content">
                    <ul>
                        {artists.map((artist_alias, idx) => {
                            return (
                                <CheckBox
                                    key={idx}
                                    id={idx}
                                    handleCheckChieldElement={this.handleCheck}
                                    checked={false}
                                    classCheckBox={"blog-checkbox artist-checkbox"}
                                    value={artist_alias.charAt(0).toUpperCase() + artist_alias.slice(1)}
                                />
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    render() {

        return (
            <div>
                <Title title={"SR - NOTICIAS"}/>
                <Header active={"news"}/>
                <Breadcumb title={"Noticias"} upgradeable={false} />

                {/* MAIN */}
                {
                    this.state.loading ?
                        <span/>
                        :
                        <div className="section-padding-100">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12 col-lg-3">
                                        <div className="blog-sidebar-area">

                                            {/* RENDER WIDGETS */}
                                            {this.renderTags(this.state)}
                                            {this.renderArtists(this.state)}

                                        </div>
                                    </div>
                                    {/* POSTS */}
                                    {this.renderPosts(this.state)}
                                </div>
                            </div>
                        </div>
                }
                <Footer/>
            </div>
        );
    }
}
export default Blog;