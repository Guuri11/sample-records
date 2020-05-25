import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "./pages/public/Home";
import Contact from "./pages/public/Contact";
import Error404 from './pages/public/Error404';
import '../css/app.css';
import Post from "./pages/public/Post";
import Blog from "./pages/public/Blog";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import Logout from "./pages/public/Logout";
import Events from "./pages/public/Events";
import Event from "./pages/public/Event";
import Shop from "./pages/public/Shop";
import Product from "./pages/public/Product";
import Profile from "./pages/public/Profile";
import Artist from "./pages/public/Artist";
import Artists from "./pages/public/Artists";
import Checkout from "./pages/public/Checkout";
import SRMusic from "./pages/public/SRMusic";
import Search from "./pages/public/Search";

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/artistas/:artist" component={Artist}/>
            <Route path="/artistas" component={Artists}/>
            <Route exact path="/noticias" component={Blog}/>
            <Route path="/checkout" component={Checkout}/>
            <Route path="/contacto" component={Contact}/>
            <Route exact path="/eventos/:id" component={Event}/>
            <Route path="/eventos" component={Events}/>
            <Route exact path='/' component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={Logout}/>
            <Route exact path="/noticias/:id" component={Post}/>
            <Route exact path="/tienda/:id" component={Product}/>
            <Route path="/perfil" component={Profile}/>
            <Route path="/registrarse" component={Register}/>
            <Route path="/tienda" component={Shop}/>
            <Route path="/sr-music" component={SRMusic}/>
            <Route path="/search" component={Search}/>
            <Route path="/error404" component={Error404} />
            <Route component={Error404} />
        </Switch>
    </Router>
    ,document.getElementById('root'));