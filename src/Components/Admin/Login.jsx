import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import { AuthContext } from '../../contexts/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as Sentry from '@sentry/react';

const Login = () => {

    const { UpdateAuth } = useContext(AuthContext);

    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['email', 'password']);

    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [mount, setMount] = useState(false);

    const getUserCookies = () => {
        const email = cookies.email;
        const password = cookies.password;

        if (!email || !password) return;
        LoginAdmin(email, password);
    }

    useEffect(() => {
        if (mount) getUserCookies();
        else setMount(true);
    }, [mount]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const LoginAdmin = async (email, pass) => {

        try {
            if (!email || !pass) {
                toast.warn("Enter email and password", {
                    
                });
                return false
            }

            const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/login`, { email, password: pass }, {
                headers: { "Content-Type": "application/json" }
            });

            if (res.data.success) {
                setCookie('email', email, { path: '/', expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }); //2592000
                setCookie('password', pass, { path: '/', expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
                UpdateAuth(true);
                navigate("/table");
            }
            else {
                toast.success(res.data.msg);
                removeCookie("email");
                removeCookie("password");
                UpdateAuth(false);
            }
        }
        catch (error) {
            UpdateAuth(false);
            toast.error("Wrong Input Credentials", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    return (
        <div className="container bg-light d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <form className='shadow shadow-sm border p-3' style={{ minWidth: "50vw" }}>
                <h3 className='text-center'>Login</h3>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                    <input type="email" name='email' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChange} tabIndex={1} />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" name='password' className="form-control" id="exampleInputPassword1" onChange={handleChange} tabIndex={2} />
                </div>

                <button type="button" tabIndex={3} autoFocus
                    onClick={() => LoginAdmin(data.email, data.password)} className="btn btn-primary">Sign In
                </button>

                <ToastContainer />
            </form>
        </div>
    )
}

export default Sentry.withProfiler(Login);