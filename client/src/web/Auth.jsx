import React from 'react';
import axios from 'axios';
import querystring from 'querystring';

const SERVER_IP = '10.0.42.160';
//const SERVER_IP = 'localhost';

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggingIn: true,
            loggedIn: undefined
        };
        const query = querystring.parse(props.location.search);
        const code = query['?code'];
        this.sendCodeToServer(code);
    }

    sendCodeToServer(code) {
        axios.post(`http://${SERVER_IP}:5000/auth?code=${code}`)
             .then(() => {
                 this.setState({
                     loggingIn: false,
                     loggedIn: true
                 });
             })
             .catch(() => {
                 this.setState({
                     loggingIn: false,
                     loggedIn: false
                 });
             });
    }

    render() {
        if (this.state.loggingIn) {
            return (
                <h2>Logging in...</h2>
            );
        }
        return (
            <h2>
                { this.state.loggedIn ? 'Logged In!' : 'Login failed' }
            </h2>
        );
    }
}

export default Auth;
