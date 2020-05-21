import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from "./pages/admin/Home";
import Artists from "./pages/admin/Artists";
import Blog from "./pages/admin/Blog";
import Events from "./pages/admin/Events";
import Event from "./pages/admin/Event";
import Error404 from "./pages/admin/Error404";
import Logout from "./pages/admin/Logout";
import Albums from "./pages/admin/Albums";
import Album from "./pages/admin/Album";
import Artist from "./pages/admin/Artist";
import Song from "./pages/admin/Song";
import Songs from "./pages/admin/Songs";
import Comment from "./pages/admin/Comment";
import Comments from "./pages/admin/Comments";
import Purchase from "./pages/admin/Purchase";
import Purchases from "./pages/admin/Purchases";
import Ticket from "./pages/admin/Ticket";
import Tickets from "./pages/admin/Tickets";
import Tag from "./pages/admin/Tag";
import Tags from "./pages/admin/Tags";
import Post from "./pages/admin/Post";
import Category from "./pages/admin/Category";
import Categories from "./pages/admin/Categories";
import Product from "./pages/admin/Product";
import Products from "./pages/admin/Products";
import User from "./pages/admin/User";
import Users from "./pages/admin/Users";

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path='/admin' component={Home}/>
            <Route exact path="/admin/albums/:album" component={Album}/>
            <Route path="/admin/albums" component={Albums}/>
            <Route exact path="/admin/artistas/:artist" component={Artist}/>
            <Route path="/admin/artistas" component={Artists}/>
            <Route exact path="/admin/canciones/:song" component={Song}/>
            <Route path="/admin/canciones" component={Songs}/>
            <Route path="/admin/categorias" component={Categories}/>
            <Route exact path="/admin/comentarios/:comment" component={Comment}/>
            <Route path="/admin/comentarios" component={Comments}/>
            <Route exact path="/admin/ventas/:purchase" component={Purchase}/>
            <Route path="/admin/ventas" component={Purchases}/>
            <Route exact path="/admin/eventos/entradas/:ticket" component={Ticket}/>
            <Route path="/admin/eventos/entradas" component={Tickets}/>
            <Route exact path="/admin/eventos/:event" component={Event}/>
            <Route path="/admin/eventos" component={Events}/>
            <Route path="/admin/logout" component={Logout}/>
            <Route exact path="/admin/noticias/tags/:tag" component={Tag}/>
            <Route path="/admin/noticias/tags" component={Tags}/>
            <Route exact path="/admin/noticias/:noticias" component={Post}/>
            <Route path="/admin/noticias" component={Blog}/>
            <Route exact path="/admin/productos/categorias/:category" component={Category}/>
            <Route exact path="/admin/productos/:product" component={Product}/>
            <Route path="/admin/productos" component={Products}/>
            <Route exact path="/admin/usuarios/:user" component={User}/>
            <Route path="/admin/usuarios" component={Users}/>
            <Route path="/error404" component={Error404} />
            <Route component={Error404} />
        </Switch>
    </Router>
    ,document.getElementById('root-adminsr'));