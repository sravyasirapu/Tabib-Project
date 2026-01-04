import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
    const navigate = useNavigate();

    // 1. State for input fields
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    // 2. Handle Input Change
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // 3. Handle Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Fetch all users
            const result = await axios.get('http://localhost:8080/api/users');
            const users = result.data;

            // Check credentials
            const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

            if (user) {
                // Save Logic
                localStorage.setItem('user', JSON.stringify(user));
                
                // SWEET ALERT SUCCESS
                Swal.fire({
                    title: 'Login Successful!',
                    text: `Welcome back, ${user.name}`,
                    icon: 'success',
                    timer: 2000,       // Auto close after 2 seconds
                    showConfirmButton: false
                }).then(() => {
                    navigate('/'); // Redirect to Dashboard
                });

            } else {
                // SWEET ALERT ERROR (Invalid Details)
                Swal.fire({
                    title: 'Access Denied',
                    text: 'Invalid Email or Password',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
                setError('Invalid Email or Password'); // Keeps text error on screen too
            }

        } catch (err) {
            console.error(err);
            // SWEET ALERT ERROR (Server Issue)
            Swal.fire('Error', 'Server not responding', 'error');
            setError('Server error. Please try again later.');
        }
    };
    return (
        <div className="login-tabib">
            <div>
                <div className="text-center">
                    <Link className="logo" to="/">
                        <img className="img-fluid" src="/assets/images/logo.png" alt="login page" />
                    </Link>
                </div>
                <div className="login-main">
                    
                    <form className="theme-form" onSubmit={handleSubmit}>
                        <h4>Sign in to account</h4>
                        <p>Enter your email & password to login </p>
                        
                        {/* Error Message Display */}
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="form-group m-b-10">
                            <label className="col-form-label">Email Address</label>
                            <input 
                                className="form-control" 
                                type="email" 
                                name="email" 
                                placeholder="Tabib@gmail.com" 
                                required 
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group m-b-10">
                            <label className="col-form-label">Password</label>
                            <div className="form-input position-relative">
                                <input 
                                    className="form-control" 
                                    type="password" 
                                    name="password" 
                                    placeholder="*********" 
                                    required 
                                    onChange={handleChange}
                                />
                                <div className="show-hide"><span className="show"></span></div>
                            </div>
                        </div>
                        
                        <div className="form-group mb-0">
                            <div className="checkbox p-0">
                                <input id="checkbox1" type="checkbox" name="remember" />
                                <label className="text-muted" htmlFor="checkbox1">Remember password</label>
                            </div>
                            <Link className="link text-primary" to="/forgot-password">Forgot password?</Link>
                            <div className="mt-3">
                                <button className="btn btn-primary w-100" type="submit">Sign in</button>
                            </div>
                        </div>
                        
                        <p className="mt-4 mb-0">Don't have account?
                            <Link className="ms-2 text-primary text-center" to="/register">
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;