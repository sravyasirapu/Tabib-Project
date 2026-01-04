import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function EditTest() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get Test ID from URL

    // 1. State for Form Data
    const [formData, setFormData] = useState({
        testName: '',
        category: '',
        description: ''
    });

    // 2. Fetch Data on Load
    useEffect(() => {
        const loadTestData = async () => {
            try {
                const result = await axios.get(`http://localhost:8080/api/tests/${id}`);
                setFormData(result.data);
            } catch (error) {
                console.error("Error loading test data:", error);
                // SWEET ALERT ERROR
                Swal.fire('Error', 'Could not load test details.', 'error');
            }
        };
        loadTestData();
    }, [id]);

    // 3. Handle Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Submit Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/tests/${id}`, formData);
            
            // SWEET ALERT SUCCESS
            Swal.fire({
                title: 'Updated!',
                text: 'Test updated successfully!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                navigate('/tests');
            });

        } catch (error) {
            console.error("Error updating test:", error);
            // SWEET ALERT ERROR
            Swal.fire('Error', 'Failed to update test.', 'error');
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="main_container">
                        
                        {/* Page Title */}
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4 className="text-primary">Edit Test</h4>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/tests">Tests</Link></li>
                                    <li className="breadcrumb-item active">Edit</li>
                                </ol>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow mb-4">
                                    <div className="card-header">
                                        <h4 className="card-title">Update Information</h4>
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
                                                                name="testName"
                                                                value={formData.testName}
                                                                onChange={handleChange}
                                                                required 
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
                                                                value={formData.category}
                                                                onChange={handleChange}
                                                                required
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
                                                            <label className="form-label">Description</label>
                                                            <textarea 
                                                                className="form-control" 
                                                                name="description" 
                                                                rows="4" 
                                                                value={formData.description}
                                                                onChange={handleChange}
                                                            ></textarea>
                                                        </div>
                                                    </div>

                                                </div>
                                                
                                                <div className="form-group text-right">
                                                    <button type="submit" className="btn btn-primary float-end">Update Test</button>
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

export default EditTest;