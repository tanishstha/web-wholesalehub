import React, {createContext, useContext, useState, useEffect} from 'react';
import { ACTIVE_KEY, KEYS } from '../key/config';
import { jwtVerify } from 'jose';
// import useFormItemStatus from 'antd/es/form/hooks/useFormItemStatus';
import { useNotification } from './NotificationContext';


// create authentication context
const AuthContext = createContext();

// Your secret key for token verification

//provide auth context
export const AuthProvider = ({children}) => {

    // const [authToken, setAuthTokenState] = useFormItemStatus(localStorage.getItem('authToken'));

    // const setAuthToken = (token) => {

    // }

    const {showNotification} = useNotification();
    const [isAuthenticated, setisAuthenticated] = useState(!!localStorage.getItem('authToken'));

    //function to validate the token
    const validateToken = async() => {
        const token = localStorage.getItem('authToken');

        if(!token) {
            console.log('no toke found in localstorage');
            setisAuthenticated(false);
            return false;
        }

        try {
            const {payload} = await jwtVerify(token, KEYS[ACTIVE_KEY]);

            //check if token is expired
            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();

            if(currentTime >= expirationTime) {
                console.log('token has expired');
                setisAuthenticated(false);
                localStorage.removeItem('authToken');
                return false;
            }

            console.log('token is valid');
            setisAuthenticated(true);
            return true;
            
        } catch(err) {
            console.error('error varifying token' + err);
            setisAuthenticated(false);
            localStorage.removeItem('authToken');
            return false;
        }
    }

    //automatically validate token on app load
    useEffect(() => {
        validateToken()
    }, [])

    const logout = () => {
        localStorage.removeItem('authToken');
        setisAuthenticated(false);
        showNotification('Logged Out Successfully', 'success');
        // navigate('..');
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, setisAuthenticated, validateToken, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

// custom hook to use context
export const useAuth = () => useContext(AuthContext);

//check login status in components
const Dashboard = () => {
    const {isAuthenticated} = useAuth();
    
    return isAuthenticated ? <div>Welcome back!</div> : <div>Please log in.</div>
}


