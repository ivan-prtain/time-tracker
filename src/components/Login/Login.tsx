import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import 'primeicons/primeicons.css';
import { PrimeIcons } from 'primereact/api';

import "./Login.scss"

import React from 'react'


const Login = () => {

    const loginUser = async (email: string, password: string) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)

            if (response.user) {
                alert("Login successful")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")
        loginUser(email as string, password as string)
    }
    return (
        <div className="login">
            <div className="login-form-container">
                <h1>Login</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input placeholder="Email" type="email" name="email" required />
                    <input placeholder="Password" type="password" name="password" required />
                    <Button label="Login" type="submit" />
                </form>
            </div>
            <div className="login__register-link-container">
                <i className="pi pi-user-plus" style={{ fontSize: '2rem' }}></i>
                <div className="login__register-link">
                    <div>Need an account?</div>
                    <Link to={"/register"}>Register here</Link>
                </div>
            </div>
        </div>
    )
}

export default Login