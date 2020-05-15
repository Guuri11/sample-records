import React, { Component } from 'react';
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Pagination from "react-js-pagination";

class Shop extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        success: false,
        loading: true,
        products: [],
        active_page : 1,
        products_per_page: 2

    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getProducts();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    /* API REQUEST TO GET THE BLOG DATA */

    getProducts() {
        axios.get(`/api/v1.0/product`).then(res => {
            if (res.data.success === true){
                this.setState( { products: res.data.results, loading: false } );
            } else {
                <Redirect to={'error404'}/>
            }
        })
    }

    /* SET CURRENT PAGE */
    handlePageChange(pageNumber) {
        this.setState({active_page: pageNumber});
    }

    render() {
        const { products, active_page, products_per_page } = this.state;

        // Logic for displaying products
        const indexLastProduct = active_page * products_per_page;
        const indexFirstProduct = indexLastProduct - products_per_page;
        const currentProducts = products.slice(indexFirstProduct, indexLastProduct);

        const renderProducts = currentProducts.map((product, idx) => {
            return (
                <div key={idx}>
                    <Link to={`/tienda/${product.id}`}>{product.name}</Link>
                </div>
            )
        })

        return (
            <div>
                <Title title={"SR - TIENDA"}/>
                <Header active={"shop"}/>
                    <ul>
                        {renderProducts ? renderProducts:''}
                    </ul>
                <div>
                    <Pagination
                        activePage={active_page}
                        itemsCountPerPage={products_per_page}
                        totalItemsCount={products.length}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange.bind(this)}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </div>
                <Footer/>
            </div>
        );
    }
}
export default Shop;