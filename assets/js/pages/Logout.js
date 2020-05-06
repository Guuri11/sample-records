import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import axios from 'axios';
import Loading from "../components/Loading";

class Logout extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
       this.handleLogout();
    }

    handleLogout = () => {
        axios.get(`/api/v1.0/user/logout`).then(()=>{
            this.props.history.push('/');
            let user = document.querySelector('.js-user-rating');
            user.setAttribute('data-is-authenticated','false');
        })
    }

    render() {
        return (
            <div className="container text-align-center certer-sr">
                <h3>¡Adios! <span role="img" aria-label="smile">😊</span></h3>
                <Loading/>
            </div>
        );
    }
}
export default withRouter(Logout);