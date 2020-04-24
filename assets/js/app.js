import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import '../css/app.css';
import { Security, LoginCallback } from '@okta/okta-react';

const config = {
    issuer: 'https://dev-837444.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/implicit/callback',
    clientId: '0oaa2rqjwqSSAxR8w4x6',
    pkce: true
};


ReactDOM.render(
    <Router>
        <Security {...config}>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/implicit/callback' component={LoginCallback}/>
        </Security>
    </Router>,
    document.getElementById('root'));