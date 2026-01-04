import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';
function AddDoctor() {
    const navigate = useNavigate();

    // 1. State for Form Data
    const [formData, setFormData] = useState({
        // User Info
        name: '',
        email: '',
        password: '',
        phone: '',
        photo: '', // This will store the Base64 string
        
        // Doctor Info
        specialization: '',
        qualification: '',
        experience: '',
        consultationFee: '',
        about: ''
    });

    const [imagePreview, setImagePreview] = useState(null);

    // 2. Helper: Convert File to Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    // 3. Handle Image Selection
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setImagePreview(base64); // Show preview immediately
            setFormData({ ...formData, photo: base64 }); // Save string to state
        }
    };

    // 4. Handle Text Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 5. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // STEP A: Create the USER Account
            const userPayload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: 'doctor',
                status: 'active',
                photo: formData.photo // Sends the Base64 string
            };

            const userResponse = await axios.post('http://localhost:8080/api/users', userPayload);
            const createdUserId = userResponse.data.id;

            // STEP B: Create the DOCTOR Profile
            const doctorPayload = {
                user: { id: createdUserId },
                specialization: formData.specialization,
                qualification: formData.qualification,
                experience: formData.experience,
                consultationFee: formData.consultationFee,
                about: formData.about
            };

            await axios.post('http://localhost:8080/api/doctors', doctorPayload);

             // NICE SUCCESS POPUP
            Swal.fire({
                title: 'Great Job!',
                text: 'Doctor added successfully to the database.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Go to List'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/doctors');
                }
            });

        } catch (error) {
            console.error("Error adding doctor:", error);
            alert("Failed to add doctor. Please check console.");
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                
                {/* Page Title */}
                <div className="new-patients main_container">
                    <div className="row page-titles mx-0">
                        <div className="col-sm-6 p-md-0">
                            <div className="welcome-text">
                                <h4 className="text-primary">Add New Doctor</h4>
                            </div>
                        </div>
                        <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active"><Link to="/add-doctor">Add new doctor</Link></li>
                            </ol>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card shadow">
                                <div className="card-header">
                                    <h4 className="card-title">Doctor Information</h4>
                                </div>
                                <div className="card-body">
                                    <div className="basic-form">
                                        <form onSubmit={handleSubmit}>
                                            
                                            {/* SECTION 1: USER ACCOUNT */}
                                            <div className="row">
                                                
                                                {/* PHOTO UPLOAD */}
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

                                                {/* TEXT FIELDS */}
                                                <div className="col-xl-8">
                                                    <div className="row">
                                                        <div className="col-xl-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Full Name</label>
                                                                <input type="text" className="form-control" name="name" 
                                                                    placeholder="Dr. John Doe" required onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Email</label>
                                                                <input type="email" className="form-control" name="email" 
                                                                    placeholder="doctor@hospital.com" required onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Password</label>
                                                                <input type="password" className="form-control" name="password" 
                                                                    placeholder="Set login password" required onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Phone</label>
                                                                <input type="text" className="form-control" name="phone" 
                                                                    placeholder="+123456789" onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <hr />

                                            {/* SECTION 2: DOCTOR DETAILS */}
                                            <h4 className="card-title mt-4 mb-3">Medical Details</h4>

                                            <div className="row">
                                                <div className="col-xl-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Specialization</label>
                                                        <input type="text" className="form-control" name="specialization" 
                                                            placeholder="e.g. Cardiologist" onChange={handleChange} />
                                                    </div>
                                                </div>
                                                <div className="col-xl-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Qualification</label>
                                                        <input type="text" className="form-control" name="qualification" 
                                                            placeholder="e.g. MBBS, MD" onChange={handleChange} />
                                                    </div>
                                                </div>
                                                <div className="col-xl-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Experience (Years)</label>
                                                        <input type="number" className="form-control" name="experience" 
                                                            placeholder="e.g. 5" onChange={handleChange} />
                                                    </div>
                                                </div>
                                                <div className="col-xl-6">
                                                    <div className="form-group">
                                                        <label className="form-label">Consultation Fee</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text">$</span>
                                                            <input type="number" className="form-control" name="consultationFee" 
                                                                placeholder="50.00" step="0.01" onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-12">
                                                    <div className="form-group">
                                                        <label className="form-label">About Doctor (Bio)</label>
                                                        <textarea className="form-control" name="about" rows="4" 
                                                            placeholder="Short biography..." onChange={handleChange}></textarea>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group text-right">
                                                <button type="submit" className="btn btn-primary float-end">Save Doctor</button>
                                            </div>
                                        </form>
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

export default AddDoctor;