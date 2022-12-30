import React, {createContext, useState } from 'react';

export const AuthContext = createContext({});

export const Auth = (props) => {

    const [logged, setLogged] = useState(false);

    const UpdateAuth = (isLogin) => {
        setLogged(isLogin)
    }
    
    return (
        <AuthContext.Provider value={{ logged, setLogged, UpdateAuth}}>
            {props?.children}
        </AuthContext.Provider>
    )
}

