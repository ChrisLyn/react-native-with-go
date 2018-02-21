import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Text, TextInput, View, Button } from 'react-native';
import { login, logout, signup } from '../../redux/actions/auth';
 
class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            route: 'Login',
            username: '',
            password: ''
        };
    }
 
    userLogin (e) {
        this.props.onLogin(this.state.username, this.state.password);
        e.preventDefault();
    }
 
    toggleRoute (e) {
        let alt = (this.state.route === 'Login') ? 'SignUp' : 'Login';
        this.setState({ route: alt });
        e.preventDefault();
    }
 
    render () {
        let alt = (this.state.route === 'Login') ? 'SignUp' : 'Login';
        return (
            <ScrollView style={{padding: 20}}>
                <Text style={{fontSize: 27}}>{this.state.route}</Text>
                <TextInput 
                    placeholder='Username'
                    autoCapitalize='none'
                    autoCorrect={false} 
                    autoFocus={true} 
                    keyboardType='email-address'
                    value={this.state.username} 
                    onChangeText={(text) => this.setState({ username: text })} />
                <TextInput 
                    placeholder='Password'
                    autoCapitalize='none'
                    autoCorrect={false} 
                    secureTextEntry={true} 
                    value={this.state.password} 
                    onChangeText={(text) => this.setState({ password: text })} />
                <View style={{margin: 7}}/>
                <Button onPress={(e) => this.userLogin(e)} title={this.state.route}/>
                <Text style={{fontSize: 16, color: 'blue'}} onPress={(e) => this.toggleRoute(e)}>{alt}</Text>
            </ScrollView>
        );
    }
}
 
 
const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
}
 
const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, password) => {
            fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            }).then((response) => response.json())
              .then((responseData, error) => {
                if (error) {
                    console.log(error);
                    dispatch(logout());
                }
                responseData && responseData.isAuthen ?
                    dispatch(login(username, password)) : dispatch(logout());
            }).done();
        },
        onSignUp: (username, password) => { dispatch(signup(username, password)); }
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(Login);