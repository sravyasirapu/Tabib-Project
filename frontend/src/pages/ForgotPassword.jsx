import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function ForgotPassword() {
    const navigate = useNavigate();

    // State
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Check Passwords Match
        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: 'Mismatch',
                text: 'Passwords do not match!',
                icon: 'warning',
                confirmButtonColor: '#d33'
            });
            return;
        }

        try {
            // 2. Find User
            const result = await axios.get('http://localhost:8080/api/users');
            const users = result.data;
            const user = users.find(u => u.email === email);

            if (user) {
                // 3. Update Password
                const updatedUser = { ...user, password: newPassword };
                await axios.put(`http://localhost:8080/api/users/${user.id}`, updatedUser);

                // SWEET ALERT SUCCESS
                Swal.fire({
                    title: 'Success!',
                    text: 'Password reset successfully! Please login.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Go to Login'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login');
                    }
                });

            } else {
                // Email Not Found
                Swal.fire({
                    title: 'Not Found',
                    text: 'This email address does not exist in our system.',
                    icon: 'error',
                    confirmButtonColor: '#d33'
                });
            }

        } catch (err) {
            console.error("Error resetting password:", err);
            // Server Error
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
    };

    return (
        <div className="login-tabib">
            <div>
                <div className="text-center">
                    <Link className="logo" to="/">
                        <img className="img-fluid" src="/assets/images/logo.png" alt="logo" />
                    </Link>
                </div>
                <div className="login-main">
                    <form className="theme-form" onSubmit={handleSubmit}>
                        <h4>Reset Password</h4>
                        <p>Enter your email and new password</p>
                        
                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* Email Input */}
                        <div className="form-group m-b-10">
                            <label className="col-form-label">Email Address</label>
                            <input 
                                className="form-control" 
                                type="email" 
                                placeholder="Enter your registered email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* New Password */}
                        <div className="form-group m-b-10">
                            <label className="col-form-label">New Password</label>
                            <input 
                                className="form-control" 
                                type="password" 
                                placeholder="New Password" 
                                required 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group m-b-10">
                            <label className="col-form-label">Confirm Password</label>
                            <input 
                                className="form-control" 
                                type="password" 
                                placeholder="Confirm Password" 
                                required 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        
                        <div className="mt-3">
                            <button className="btn btn-primary w-100" type="submit">Reset Password</button>
                        </div>
                        
                        <div className="text-center mt-4">
                            <p className="mb-0">Remembered it? <Link className="text-primary" to="/login">Sign in</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;