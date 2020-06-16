import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Pagination from "react-js-pagination";
import Breadcrumb from "../../components/public/Breadcumb";
import { TwitterTweetEmbed } from 'react-twitter-embed';

class Events extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        success: false,
        loading: true,
        events: [],
        tweets: [],
        active_page : 1,
        events_per_page: 9,
        comments:[],
        user_data: [],
        can_comment: false,
        sending: false,
        comment_submited: false,
        comment_success: false
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getTweets();
            this.getEvents();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    /* API REQUEST TO GET THE ARTISTS DATA */

    getEvents() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth()+1;
        const day = now.getDate();
        const now_formated = year+"-"+month+"-"+day;
        axios.get(`/api/v1.0/event?until=${now_formated}`).then(res => {
            if (res.data.success === true){
                this.setState( { events: res.data.results, loading: false } )
            } else {
                <Redirect to={'error404'}/>
            }

        })
    }

    getTweets() {
        axios.get('/api/v1.0/twitter/events-tweets').then(res => {
            if (res.data.success === true){
                this.setState( { tweets: res.data.results } )
            } else {
                this.setState( { tweets: [] } )
            }
        })
    }

    /* SET CURRENT PAGE */
    handlePageChange(pageNumber) {
        this.setState({active_page: pageNumber});
    }

    renderEvents = ({events, active_page, events_per_page}) => {

        // Logic for displaying posts
        const indexLastEvent = active_page * events_per_page;
        const indexFirstEvent = indexLastEvent - events_per_page;
        const currentEvents = events.slice(indexFirstEvent, indexLastEvent);

        return (
            <div className="row">
                {
                    events.length === 0 ?
                        <h2>No hay resultados 😭</h2>
                        :
                        currentEvents.map((event, idx) => {

                            // Format date
                            const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
                            const day = new Date(event.date.date).getDate();
                            const month = new Date(event.date.date).getMonth();
                            const year = new Date(event.date.date).getFullYear();

                            return (
                                <div key={idx} className="col-12 col-md-6 col-lg-4">
                                    <div className="single-event-area mb-3">
                                        <div className="event-thumbnail">
                                            <img src={event.img_name} alt="Imagen no disponible"/>
                                        </div>
                                        <div className="event-text">
                                            <h4>{event.name}</h4>
                                            <div className="event-meta-data">
                                                <a href="#" className="event-place">{event.city}</a>
                                                <a href="#" className="event-place">{event.place}</a>
                                                <a href="#" className="event-date">{months[month]} {day}, {year}</a>
                                            </div>
                                            <Link to={`/eventos/${event.id}`} className={"btn see-more-btn event-cart-text"}>Ver evento</Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        )

    }

    render() {
        const { events, tweets, active_page, events_per_page, loading } = this.state;

        return (
            <div>
                <Title title={"SR - EVENTOS"}/>
                <Header active={"events"}/>
                <Breadcrumb title={"EVENTOS"} p_text={"¿Están en tu ciudad? ¡Entonces no te los pierdas!"}/>

                {/* MAIN */}
                {
                    loading ?
                        <span/>
                        :
                        <div className="row">
                            <div className={tweets.length > 0 ? "col-12 col-sm-9": "col-12"}>
                                <section className="events-area section-padding-100">
                                    <div className="container">

                                        {/* EVENTS */}
                                        {this.renderEvents(this.state)}

                                        <div className="row ">
                                            <div className="col-12">
                                                <Pagination
                                                    activePage={active_page}
                                                    itemsCountPerPage={events_per_page}
                                                    totalItemsCount={events.length}
                                                    pageRangeDisplayed={5}
                                                    onChange={this.handlePageChange.bind(this)}
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            {
                                tweets.length > 0 ?
                                    <div className="col-12 col-sm-3 section-padding-100 pr-5">
                                        {
                                            tweets.length > 0 ?
                                                tweets.map(tweet => {
                                                    return (
                                                        <div key={tweet}>
                                                            <TwitterTweetEmbed tweetId={tweet}/>
                                                        </div>
                                                    )
                                                })
                                                :
                                                null
                                        }
                                    </div>
                                    :
                                    null
                            }
                        </div>
                }
                <Footer/>
            </div>
        );
    }
}
export default Events;