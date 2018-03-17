import React from 'react';
import axios from 'axios';
import querystring from 'querystring';

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
        axios.post(`http://localhost:5000/auth?code=${code}`)
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
                <div>Logging in...</div>
            );
        }
        return (
            <div>
                { this.state.loggedIn ? 'Logged In!' : 'Login failed' }
            </div>
        );
    }
}

export default Auth;
