import React, { Component } from 'react';
import Title from "../../components/public/Title";
import Header from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Pagination from "react-js-pagination";
import Breadcumb from "../../components/public/Breadcumb";
import CheckBox from "../../components/public/Checkbox";

class Shop extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        success: false,
        loading: true,
        total_products: [],
        products: [],
        artists_alias: [],
        categories: [],
        active_page : 1,
        products_per_page: 6

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
        axios.get(`/index.php/api/v1.0/product?available=1`).then(res => {
            if (res.data.success === true){

                const products = res.data.results;

                // Get categories from posts collection
                let categories = products.map(product => product.category.name ? product.category.name:null);
                categories = [...new Set(categories)];


                // Get artists from posts collection
                let artists_alias = products.map(product => product.artist ? product.artist.alias:null);
                artists_alias = [...new Set(artists_alias)];

                artists_alias = artists_alias.filter( (artist) => {
                    return artist != null;
                } )

                this.setState( { total_products: products, products: products, categories: categories, artists_alias: artists_alias,loading: false } );
            } else {
                <Redirect to={'error404'}/>
            }
        })
    }

    renderProducts = (products) => {
        return (
            products.map(( product,idx ) => {
                return (
                    <div key={idx} className="col-12 col-xs-1 col-md-2 col-lg-4">
                        <div className="single-shop-product mb-5 wow fadeInUp" data-wow-delay="100ms">
                            <div className="shop-product-thumb mt-2">
                                <Link to={`/tienda/${product.id}`}>
                                    <img src={product.img_name} className="img-shop-product w-100" alt="Imagen no disponible"/>
                                </Link>
                                <div className="product-price">
                                    <span>{product.price}€</span>
                                </div>
                            </div>

                            <div className="product-content">
                                <Link to={`/tienda/${product.id}`} className={"product-title"}>{product.name}</Link>
                                <div className="product-meta d-flex mb-2">
                                    <p className="post-author">Stock: {product.stock}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } )
        )
    }

    renderCategories = (categories) => {
        return (
            <div className="single-widget-area mb-2 bg-white">
                <div className="widget-title">
                    <h5>Categorias</h5>
                </div>
                <div className="widget-content">
                    <ul>
                        {categories.map((category, idx) => {
                            return (
                                <CheckBox
                                    key={idx}
                                    id={idx}
                                    handleCheckChieldElement={this.handleCheck}
                                    checked={false}
                                    classCheckBox={"shop-checkbox category-checkbox"}
                                    value={category.charAt(0).toUpperCase() + category.slice(1)}
                                />
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    renderArtists = (artists) => {
        return (
            <div className="single-widget-area mb-2 bg-white">
                <div className="widget-title">
                    <h5>Artistas</h5>
                </div>
                <div className="widget-content">
                    <ul>
                        {artists.map((artist, idx) => {
                            return (
                                <CheckBox
                                    key={idx}
                                    id={idx}
                                    handleCheckChieldElement={this.handleCheck}
                                    checked={false}
                                    classCheckBox={"shop-checkbox artist-checkbox"}
                                    value={artist.charAt(0).toUpperCase() + artist.slice(1)}
                                />
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    /* SET CURRENT PAGE */
    handlePageChange(pageNumber) {
        this.setState({active_page: pageNumber});
    }

    /* FILTER BY CATEGORIES AND ARTISTS */
    handleCheck = () => {

        // Set the current posts all the posts to filter later
        let products = this.state.total_products;

        // Get tag checkboxes and check if there is any selected
        const categories_checkbox = document.querySelectorAll('.category-checkbox')
        const artists_checkbox = document.querySelectorAll('.artist-checkbox')

        // Get inputs tags non-checked
        let empty = [].filter.call( categories_checkbox, function(el ) {
            return !el.checked
        });
        const categories_checked = !(categories_checkbox.length === empty.length);

        // Get inputs artists non-checked
        // Get inputs tags non-checked
        empty = [].filter.call( artists_checkbox, function( el ) {
            return !el.checked
        });
        const artists_checked = !(artists_checkbox.length === empty.length);


        if (categories_checked || artists_checked){
            // Check if product has category checked
            let matchCategory = [];
            products.forEach(product => {

                // Filter by artists
                if (artists_checked && !categories_checked){
                    artists_checkbox.forEach(checkbox => {
                        if ( product.artist !== null && checkbox.classList[1] === 'artist-checkbox' && checkbox.checked &&
                            product.artist.alias.toLowerCase() === checkbox.defaultValue.toLowerCase() )
                            matchCategory.push(product);
                    })
                } else if (categories_checked && !artists_checked){   // Filter by tags
                    categories_checkbox.forEach(checkbox => {
                        if ( checkbox.classList[1] === 'category-checkbox' && checkbox.checked && product.category.name.toLowerCase() === checkbox.defaultValue.toLowerCase() )
                            matchCategory.push(product);
                    })
                } else {
                    // Filter by both
                    categories_checkbox.forEach(category_checkbox => {
                        artists_checkbox.forEach( artist_checkbox => {
                            if ( (category_checkbox.checked && product.category.name.toLowerCase() === category_checkbox.defaultValue.toLowerCase())
                                && (artist_checkbox.checked && product.artist.alias.toLowerCase() === artist_checkbox.defaultValue.toLowerCase()))
                                matchCategory.push(product);
                        } )
                    })
                }

            })

            // Filter array getting unique values.
            products = [...new Set(matchCategory)];
        }

        this.setState({products: products, active_page: 1})
    }

    orderByMoreExpensive = () => {
        const more_expensive = this.state.products.sort( function compare( a, b ) {
            if ( a.price > b.price ){
                return -1;
            }
            if ( a.price < b.price ){
                return 1;
            }
            return 0;
        } );
        this.setState( { products : more_expensive } );
    }
    orderByCheapest = () => {
        const cheapest = this.state.products.sort( function compare( a, b ) {
            if ( a.price < b.price ){
                return -1;
            }
            if ( a.price > b.price ){
                return 1;
            }
            return 0;
        } );
        this.setState( { products : cheapest } );
    }

    // Filter by search
    handleSearch = (e) => {
        this.setState( { products: this.state.total_products } )
        // Get input value
        const search_request = e.target.value.toLowerCase();
        if (search_request !== ""){

            // Filter products searching in his name, artist alias and category
            const search_resuts = this.state.products.filter( (product) => {
                let product_slug = product.name + product.category.name;
                product_slug = product.artist !== null ? product_slug+product.artist.alias:product_slug+"";
                return product_slug.toLowerCase().indexOf(search_request) !== -1;
            } )
            this.setState( {products: search_resuts} )
        } else {
            // if search value is empty reset products
            this.setState( { products: this.state.total_products } )
        }

    }

    render() {
        const { loading, categories, artists_alias, products, active_page, products_per_page } = this.state;

        // Logic for displaying products
        const indexLastProduct = active_page * products_per_page;
        const indexFirstProduct = indexLastProduct - products_per_page;
        const currentProducts = products.slice(indexFirstProduct, indexLastProduct);

        return (
            <div>
                <Title title={"SR - TIENDA"}/>
                <Header active={"shop"}/>
                <Breadcumb title={"TIENDA"} />

                {/* MAIN */}
                {
                    loading ?
                        null
                        :
                        <div className="shop-area section-padding-100">
                            <div className="container container-shop">
                                <div className="row">
                                    <div className="col-12 col-lg-3">
                                        <div className="filters-sidebar-area">
                                            {/* WIDGETS */}
                                            { this.renderCategories(categories) }
                                            { this.renderArtists(artists_alias) }
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-9 row justify-content-center">
                                        <div className="col-12 row mb-3">
                                            {/* SEARCH */}
                                            <div className="col-12 col-lg-6">
                                                <input className="form-control form-control-sm mr-3 w-75" type="text"
                                                       placeholder="Buscar"
                                                       aria-label="Search"
                                                        onChange={this.handleSearch}/>
                                            </div>
                                            {/* SET ORDER */}
                                            <div className="col-12 col-lg-6 mb-3">
                                                <div className="dropdown ml-3">
                                                    <button type="button" className="btn btn-primary btn-primary-sr dropdown-toggle"
                                                            data-toggle="dropdown">
                                                        Ordenar
                                                    </button>
                                                    <div className="dropdown-menu">
                                                        <p className="dropdown-item pointer" onClick={this.orderByMoreExpensive}>Más caros primeros</p>
                                                        <p className="dropdown-item pointer" onClick={this.orderByCheapest}>Más caros baratos</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {
                                            this.renderProducts(currentProducts)
                                        }

                                        <div className="col-12 row mb-3">
                                            <div className="col-12 justify-content-center">
                                                <Pagination
                                                    activePage={active_page}
                                                    itemsCountPerPage={products_per_page}
                                                    totalItemsCount={products.length}
                                                    pageRangeDisplayed={5}
                                                    onChange={this.handlePageChange.bind(this)}
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                    innerClass={"pagination justify-content-center"}
                                                />
                                            </div>
                                        </div>
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
export default Shop;