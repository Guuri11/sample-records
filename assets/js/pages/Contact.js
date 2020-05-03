import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";

class Contact extends Component{

    render () {
        return(
            <div>
                <Title title={"SR - CONTACTO"}/>
                <Header active={"contact"}/>
            </div>
        )
    }
}

export default Contact;