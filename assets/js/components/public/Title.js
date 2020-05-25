import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import propTypes from 'prop-types';

class Title extends Component{

    render() {
        return (
            <div>
                <Helmet>
                    <title>{this.props.title}</title>
                </Helmet>
            </div>
        );
    }
}
Title.propTypes = {
    title: propTypes.string
}
Title.defaultProps = {
    title:'SAMPLE RECORDS'
}
export default Title;