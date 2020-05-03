import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Error404 from './pages/Error404';
import '../css/app.css';
import Post from "./pages/Post";
import Blog from "./pages/Blog";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Events from "./pages/Events";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Artist from "./pages/Artist";
import Artists from "./pages/Artists";
import Checkout from "./pages/Checkout";
import SRMusic from "./pages/SRMusic";

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/admin" component={Admin}/>
            <Route path="/artista" component={Artist}/>
            <Route path="/artistas" component={Artists}/>
            <Route path="/noticias" component={Blog}/>
            <Route path="/checkout" component={Checkout}/>
            <Route path="/contacto" component={Contact}/>
            <Route path="/eventos" component={Events}/>
            <Route exact path='/' component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/noticia" component={Post}/>
            <Route path="/product" component={Product}/>
            <Route path="/perfil" component={Profile}/>
            <Route path="/registrar" component={Register}/>
            <Route path="/tienda" component={Shop}/>
            <Route path="/sr-music" component={SRMusic}/>
            <Route component={Error404} />
        </Switch>
    </Router>
    ,document.getElementById('root'));