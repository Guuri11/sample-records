import React, { Component } from 'react';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/admin/Footer";
import axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Header from "../../components/admin/Header";
import Card from "../../components/admin/Card";

class Home extends Component{

    constructor(props) {
        super(props);
        this._isMounted = false;
    }

    state = {
        loading: true,
        monthly_earns: 0,
        last_purchases: [],
        columns : ['#',"Nº Serie","Fecha de entrega","Entregado","Precio €","Cliente","Producto/Ticket","Fecha de compra"],
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getLastPurchases();
            this.getMonthlyEarns();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getLastPurchases = () => {
        axios.get('/index.php/api/v1.0/purchase/?last=6').then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { last_purchases: res.data.results } );
            } else {
                <Redirect to={'error404'}/>
            }

        })
    }

    getMonthlyEarns = () => {
        axios.get('/index.php/api/v1.0/purchase/monthlyearns').then(res => {
            if (res.data.success === true){
                this._isMounted && this.setState( { monthly_earns: res.data.results.toFixed(2), loading: false } );
            } else {
                <Redirect to={'error404'}/>
            }

        })
    }

    render () {

        const { loading, monthly_earns, last_purchases, columns } = this.state;

        return(
            <div id="wrapper">
                <Navbar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id={"content"}>
                        <Header/>
                        <div className="container-fluid">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Inicio</h1>
                            </div>
                            {
                                loading ?
                                    null
                                    :
                                    <div className={"row"}>
                                        <Card title={"Ganancias del mes"} data={monthly_earns+" €"} icon={"fa fa-euro"}/>

                                        <div className="card shadow mb-4 w-100">
                                            <div className="card-header py-3">
                                                <h4 className="m-0 font-weight-bold text-sr">Últimas compras</h4>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <table className="table table-bordered" id="dataTable" width="100%"
                                                           cellSpacing="0">
                                                        <thead>
                                                        <tr>
                                                            {
                                                                columns.map( (column, idx) => {
                                                                    return (
                                                                        <th key={idx}>{column}</th>
                                                                    )
                                                                })
                                                            }
                                                        </tr>
                                                        </thead>
                                                        <tfoot>
                                                        </tfoot>
                                                        <tbody>
                                                        {
                                                            last_purchases.map( ( purchase,idx ) =>{
                                                                    return (
                                                                        <tr key={idx}>
                                                                            <td>
                                                                                <Link to={`/admin/ventas/${purchase.id}`} className={"text-info"}>
                                                                                {idx+1}
                                                                                </Link>
                                                                            </td>
                                                                            { Object.keys(purchase).map( (purchase_key, idx) => {
                                                                                switch (purchase_key) {
                                                                                    case "user": case "product":
                                                                                        if (purchase[purchase_key])
                                                                                            return <td key={idx}>{purchase[purchase_key].name}</td>;
                                                                                        else
                                                                                            break;
                                                                                    case "ticket":
                                                                                        if (purchase[purchase_key])
                                                                                            return <td key={idx}>{purchase[purchase_key].event.name}</td>;
                                                                                        else
                                                                                            break;
                                                                                    case "created_at": case "date":
                                                                                        const day = new Date(purchase[purchase_key].date).getDate();
                                                                                        const month = new Date(purchase[purchase_key].date).getMonth();
                                                                                        const year = new Date(purchase[purchase_key].date).getFullYear();

                                                                                        return <td key={idx}>{day+"-"+month+"-"+year}</td>;
                                                                                    case "received":
                                                                                        return <td key={idx}>{purchase[purchase_key] ? "Sí":"No"}</td>
                                                                                    case "serial_number":
                                                                                        return <td key={idx}>{purchase[purchase_key]}</td>
                                                                                    case "final_price":
                                                                                        return <td key={idx}>{purchase[purchase_key].toFixed(2)}</td>
                                                                                }
                                                                            }) }
                                                                        </tr>
                                                                    )
                                                                })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
    )
    }
}

export default Home;