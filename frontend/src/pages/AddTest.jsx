import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';
function AddTest() {
    const navigate = useNavigate();

    // 1. State for Form Data
    const [formData, setFormData] = useState({
        testName: '',   // Matches Java Entity: private String testName;
        category: '',
        description: ''
    });

    // 2. Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8080/api/tests', formData);
            
            // SWEET ALERT SUCCESS
            Swal.fire({
                title: 'Saved!',
                text: 'Lab Test added successfully.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Go to Tests List'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/tests');
                }
            });

        } catch (error) {
            console.error("Error adding test:", error);
            // SWEET ALERT ERROR
            Swal.fire('Error', 'Failed to add test.', 'error');
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="main_container">
                        
                        {/* Page Title & Breadcrumb */}
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4 className="text-primary">Add Test</h4>
                                    <p className="mb-0">Create new lab test entry</p>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><a href="#!">Tests</a></li>
                                    <li className="breadcrumb-item active"><Link to="/add-test">Add Test</Link></li>
                                </ol>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow mb-4">
                                    <div className="card-header">
                                        <h4 className="card-title">Test Information</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="basic-form">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    
                                                    {/* Test Name */}
                                                    <div className="col-xl-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Test Name</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                name="testName" // Must match state key
                                                                placeholder="e.g. Complete Blood Count (CBC)" 
                                                                required 
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Category */}
                                                    <div className="col-xl-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Category</label>
                                                            <select 
                                                                className="form-control form-select" 
                                                                name="category" 
                                                                required
                                                                onChange={handleChange}
                                                            >
                                                                <option value="">Select Category</option>
                                                                <option value="Blood">Blood Test</option>
                                                                <option value="Urine">Urine Analysis</option>
                                                                <option value="Radiology">Radiology (X-Ray/MRI/CT)</option>
                                                                <option value="Pathology">Pathology</option>
                                                                <option value="Microbiology">Microbiology</option>
                                                                <option value="Biochemistry">Biochemistry</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="col-xl-12">
                                                        <div className="form-group">
                                                            <label className="form-label">Description / Pre-requisites</label>
                                                            <textarea 
                                                                className="form-control" 
                                                                name="description" 
                                                                rows="4" 
                                                                placeholder="Enter details about the test or instructions (e.g., fasting required)..."
                                                                onChange={handleChange}
                                                            ></textarea>
                                                        </div>
                                                    </div>

                                                </div>
                                                
                                                <div className="form-group text-right">
                                                    <button type="submit" className="btn btn-primary float-end">Save Test</button>
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

export default AddTest;