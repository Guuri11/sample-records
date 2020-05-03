import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";

class Events extends Component {
    render() {
        return (
            <div>
                <Title title={"SR - EVENTOS"}/>
                <Header active={"events"}/>
            </div>
        );
    }
}
export default Events;