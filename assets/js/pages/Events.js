import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Pagination from "react-js-pagination";
import Breadcrumb from "../components/Breadcumb";

class Events extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        success: false,
        loading: true,
        events: [],
        active_page : 1,
        events_per_page: 3,
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
            this.getEvents();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    /* API REQUEST TO GET THE ARTISTS DATA */

    getEvents() {
        axios.get(`/api/v1.0/event`).then(res => {
            if (res.data.success === true){
                this.setState( { events: res.data.results, loading: false } )
            } else {
                <Redirect to={'error404'}/>
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
                                            <a href="#" className="btn see-more-btn font-weight-bolder">Añadir carrito</a>
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
        const { events, active_page, events_per_page, loading } = this.state;

        return (
            <div className={"bg-sr"}>
                <Title title={"SR - EVENTOS"}/>
                <Header active={"events"}/>
                <Breadcrumb title={"EVENTOS"} p_text={"¿Están en tu ciudad? ¡Entonces no te los pierdas!"}/>

                {/* MAIN */}
                {
                    loading ?
                        <span/>
                        :
                        <div className="row">
                            <div className="col-12 col-md-9">
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

                            {/* TWEETS AND COMMENTS */}
                            <div className="col-12 col-md-3 event-extra section-padding-100">

                                <div className="twitter card center-box mb-5" style={{width: "18rem"}}>
                                    <div className="card-body">
                                        <h5 className="card-title">Twitter</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                        <p className="card-text">Some quick example text to build on the
                                            card title and make up the bulk of the card's content.</p>
                                        <a href="#" className="card-link">Card link</a>
                                        <a href="#" className="card-link">Another link</a>
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
export default Events;