import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function AddPatient() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        gender: 'male',
        city: '',
        address: '',
        photo: '' 
    });

    const [imagePreview, setImagePreview] = useState(null);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setImagePreview(base64);
            setFormData({ ...formData, photo: base64 });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/patients', formData);
            
            // SWEET ALERT SUCCESS
            Swal.fire({
                title: 'Success!',
                text: 'Patient registered successfully.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Go to List'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/patients');
                }
            });

        } catch (error) {
            Swal.fire('Error', 'Failed to register patient.', 'error');
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="new-patients main_container">
                        
                        {/* Page Title */}
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4 className="text-primary">New Patient</h4>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active"><Link to="/add-patient">New Patient</Link></li>
                                </ol>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow">
                                    <div className="card-header">
                                        <h4 className="card-title">Personal Information</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="basic-form">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    
                                                    {/* LEFT COLUMN: IMAGE UPLOAD (Fixed) */}
{/* LEFT COLUMN: IMAGE UPLOAD */}
<div className="col-xl-4">
    <div className="form-group row widget-3">
        <div className="col-lg-12">
            <div className="form-input">
                <label className="labeltest" htmlFor="file-ip-1">
                    <span> Drop image here or click to upload. </span>
                </label>
                
                <input 
                    type="file" 
                    id="file-ip-1" 
                    accept="image/*"
                    onChange={handleImageChange}
                />
                
                 <div className="preview">
                                                                    <img 
                                                                        id="file-ip-1-preview" 
                                                                        src={imagePreview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}  
                                                                        alt="img" 
                                                                        style={{ 
                                                                            display: imagePreview ? 'block' : 'none', 
                                                                            width: '150px', 
                                                                            height: '150px', 
                                                                            objectFit: 'cover' 
                                                                        }}
                                                                    />
                                                                </div>
            </div>
        </div>
    </div>
</div>

                                                    {/* RIGHT COLUMN: DETAILS */}
                                                    <div className="col-xl-8">
                                                        <div className="row">
                                                            <div className="col-lg-6">
                                                                <div className="form-group">
                                                                    <label className="form-label">Full Name</label>
                                                                    <input type="text" className="form-control" name="fullName" placeholder="Enter full name" required onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="form-group">
                                                                    <label className="form-label">Email</label>
                                                                    <input type="email" className="form-control" name="email" placeholder="Email" onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="form-group">
                                                                    <label className="form-label">Phone Number</label>
                                                                    <input type="text" className="form-control" name="phone" placeholder="Phone" onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="form-group">
                                                                    <label className="form-label">Date of Birth</label>
                                                                    <input type="date" className="form-control" name="dob" onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="form-group">
                                                                    <label className="form-label">Gender</label>
                                                                    <select className="form-control form-select" name="gender" onChange={handleChange}>
                                                                        <option value="male">Male</option>
                                                                        <option value="female">Female</option>
                                                                        <option value="other">Other</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="form-group">
                                                                    <label className="form-label">City</label>
                                                                    <input type="text" className="form-control" name="city" placeholder="City" onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <div className="form-group">
                                                                    <label className="form-label">Address</label>
                                                                    <textarea className="form-control" name="address" rows="3" placeholder="Address" onChange={handleChange}></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="form-group text-right">
                                                            <button type="submit" className="btn btn-primary float-end">Save Patient</button>
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AddPatient;