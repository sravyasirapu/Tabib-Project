import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Register() {
    const navigate = useNavigate();

    // 1. State for Form Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        photo: 'default.jpg',
        role: 'patients', // Default to patient
        status: 'active'
    });

    // Handle Text Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle File Changes (Base64)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFormData({ ...formData, photo: base64 });
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    // --- UPDATED SUBMIT LOGIC ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // STEP 1: Create the User Account (Login Info)
            const userResponse = await axios.post('http://localhost:8080/api/users', formData);
            const createdUser = userResponse.data;

            // STEP 2: Automatically Create Profile based on Role
            if (formData.role === 'doctor') {
                const doctorPayload = {
                    user: { id: createdUser.id },
                    specialization: 'General',
                    qualification: '',
                    experience: 0,
                    consultationFee: 0.0,
                    about: 'New registered doctor'
                };
                await axios.post('http://localhost:8080/api/doctors', doctorPayload);
            
            } else if (formData.role === 'patients') {
                const patientPayload = {
                    fullName: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    photo: formData.photo,
                    gender: 'other',
                    dob: new Date().toISOString().split('T')[0],
                    address: '',
                    city: ''
                };
                await axios.post('http://localhost:8080/api/patients', patientPayload);
            }

            // SWEET ALERT SUCCESS
            Swal.fire({
                title: 'Welcome!',
                text: 'Account created successfully! Please Sign In.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });

        } catch (error) {
            console.error("Registration Error:", error);
            
            // SWEET ALERT ERROR
            Swal.fire({
                title: 'Registration Failed',
                text: 'Email might already exist or server is down.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
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
                        <h4>Create your account</h4>
                        <p>Enter your personal details to create account</p>
                        
                        <div className="form-group m-b-10">
                            <label className="col-form-label pt-0">Full Name</label>
                            <div className="form-group mb-0">
                                <input className="form-control" type="text" name="name" placeholder="John Doe" required onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group m-b-10">
                            <label className="col-form-label">Email Address</label>
                            <input className="form-control" type="email" name="email" placeholder="user@example.com" required onChange={handleChange} />
                        </div>

                        <div className="form-group m-b-10">
                            <label className="col-form-label">Password</label>
                            <div className="form-input position-relative">
                                <input className="form-control" type="password" name="password" placeholder="*********" required onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group m-b-10">
                            <label className="col-form-label">Phone Number</label>
                            <input className="form-control" type="text" name="phone" placeholder="+1 234 567 890" onChange={handleChange} />
                        </div>

                        <div className="form-group m-b-10">
                            <label className="col-form-label">Profile Photo</label>
                            <input className="form-control" type="file" name="photo" onChange={handleFileChange} />
                        </div>

                        <div className="form-group m-b-10">
                            <label className="col-form-label">Register As:</label>
                            <select className="form-control" name="role" onChange={handleChange}>
                                <option value="patients">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>

                        <div className="form-group mb-0">
                            <div className="checkbox p-0">
                                <input id="checkbox1" type="checkbox" required />
                                <label className="text-muted" htmlFor="checkbox1">Agree with <a className="ms-2 text-primary" href="#!">Privacy Policy</a></label>
                            </div>
                            <button className="btn btn-primary w-100" type="submit">Create Account</button>
                        </div>
                        
                        <p className="mt-4 mb-0">Already have an account?
                            <Link className="ms-2 text-primary" to="/login">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;