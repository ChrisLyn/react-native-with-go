import { LoginService } from '../../service/loginService';

const defaultState = {
    isLoggedIn: false,
    username: '',
    password: '',
    url: ''
};
 
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case 'LOGIN': 
            return Object.assign({}, state, { 
                isLoggedIn: true,
                username: action.username,
                password: action.password,
                url: ''
            });
        case 'LOGOUT':
            return Object.assign({}, state, { 
                isLoggedIn: false,
                username: '',
                password: '',
                url: ''
            });
        default:
            return state;
    }
}