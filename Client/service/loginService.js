import React, { Component } from 'react';


export default class LoginService extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
        this.base_route = "localhost:8080";
    }

    login(username, password) {
        try {
            return fetch(`${base_route}/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });
        } catch (err) {
            console.log(err);
        }
    }
}