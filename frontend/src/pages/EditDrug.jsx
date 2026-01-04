import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function EditDrug() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        drugName: '',
        category: '',
        description: ''
    });

    // FIX: Function is defined INSIDE useEffect to remove warning
    useEffect(() => {
        const loadDrugData = async () => {
            try {
                const result = await axios.get(`http://localhost:8080/api/drugs/${id}`);
                setFormData(result.data);
            } catch (error) {
                console.error("Error loading drug data:", error);
                // SWEET ALERT ERROR
                Swal.fire('Error', 'Could not load drug details.', 'error');
            }
        };
        loadDrugData();
    }, [id]); // Dependency array includes 'id'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/drugs/${id}`, formData);
            
            // SWEET ALERT SUCCESS
            Swal.fire({
                title: 'Updated!',
                text: 'Drug details updated successfully.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                navigate('/drugs');
            });

        } catch (error) {
            console.error("Error updating drug:", error);
            // SWEET ALERT ERROR
            Swal.fire('Error', 'Failed to update drug.', 'error');
        }
    };
    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="main_container">
                        
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4 className="text-primary">Edit Drug</h4>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/drugs">Drugs</Link></li>
                                    <li className="breadcrumb-item active">Edit</li>
                                </ol>
                            </div>
                        </div>

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
                                                    
                                                    <div className="col-xl-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Drug Name</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                name="drugName"
                                                                value={formData.drugName}
                                                                onChange={handleChange}
                                                                required 
                                                            />
                                                        </div>
                                                    </div>

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
                                                    <button type="submit" className="btn btn-primary float-end">Update Drug</button>
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

export default EditDrug;