import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropTypes from "prop-types";
import axios from "axios";

class Product extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        product: {}
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

    render() {
        return (
            <div>
                <Title title={"SR - INICIO"}/>
                <Header/>
                <h1>{this.state.product.name}</h1>
                <Footer/>
            </div>
        );
    }
}
export default Product;