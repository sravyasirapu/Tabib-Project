import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';
function AddDrug() {
    const navigate = useNavigate();

    // 1. State for Form Data (Matches Java Entity: drugName, category, description)
    const [formData, setFormData] = useState({
        drugName: '',
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
            await axios.post('http://localhost:8080/api/drugs', formData);
            
            // SWEET ALERT SUCCESS
            Swal.fire({
                title: 'Added!',
                text: 'Drug added successfully to inventory.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Go to Drugs List'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/drugs');
                }
            });

        } catch (error) {
            console.error("Error adding drug:", error);
            // SWEET ALERT ERROR
            Swal.fire('Error', 'Failed to add drug. Please try again.', 'error');
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
                                    <h4 className="text-primary">Add Drug</h4>
                                    <p className="mb-0">Create new medicine entry</p>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active"><Link to="/add-drug">Add Drug</Link></li>
                                </ol>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow mb-4">
                                    <div className="card-header">
                                        <h4 className="card-title">Drug Information</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="basic-form">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    
                                                    {/* Drug Name */}
                                                    <div className="col-xl-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Drug Name</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                name="drugName" // Must match Java Entity field
                                                                placeholder="e.g. Paracetamol 500mg" 
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
                                                                <option value="Antibiotic">Antibiotic</option>
                                                                <option value="Analgesic">Analgesic (Painkiller)</option>
                                                                <option value="Antipyretic">Antipyretic</option>
                                                                <option value="Antiseptic">Antiseptic</option>
                                                                <option value="Syrup">Syrup</option>
                                                                <option value="Tablet">Tablet</option>
                                                                <option value="Injection">Injection</option>
                                                                <option value="Supplement">Supplement</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="col-xl-12">
                                                        <div className="form-group">
                                                            <label className="form-label">Description</label>
                                                            <textarea 
                                                                className="form-control" 
                                                                name="description" 
                                                                rows="4" 
                                                                placeholder="Enter drug details, side effects..."
                                                                onChange={handleChange}
                                                            ></textarea>
                                                        </div>
                                                    </div>

                                                </div>
                                                
                                                <div className="form-group text-right">
                                                    <button type="submit" className="btn btn-primary float-end">Save Drug</button>
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

export default AddDrug;