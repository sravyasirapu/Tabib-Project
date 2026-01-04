import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Tests() {
    // 1. Get User Role
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role.toLowerCase() : 'patients';

    const [tests, setTests] = useState([]);

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/tests');
            setTests(result.data);
        } catch (error) {
            console.error("Error loading tests:", error);
        }
    };

    // --- SWEET ALERT DELETE FUNCTION ---
    const deleteTest = async (id) => {
        Swal.fire({
            title: 'Delete Test?',
            text: "Are you sure you want to remove this lab test?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api/tests/${id}`);
                    Swal.fire('Deleted!', 'Test has been removed.', 'success');
                    loadTests(); // Refresh the list
                } catch (error) {
                    Swal.fire('Error', 'Could not delete test.', 'error');
                }
            }
        });
    }

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="main_container">
                        
                        {/* Page Title & Breadcrumb */}
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4 className="text-primary">All Lab Tests</h4>
                                    <p className="mb-0">Manage Laboratory Inventory</p>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active"><Link to="/tests">All Tests</Link></li>
                                </ol>
                            </div>
                        </div>
                        
                        {/* Tests Table Card */}
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card shadow mb-4">
                                    <div className="card-header fix-card">
                                        <div className="row">
                                            <div className="col-8">
                                                <h4 className="card-title">Tests List</h4>
                                            </div>
                                            <div className="col-4">
                                                {/* ONLY ADMIN CAN ADD TESTS */}
                                                {role === 'admin' && (
                                                    <Link to="/add-test" className="btn btn-primary float-end">Add New Test</Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table id="example1" className="table table-striped display nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Test Name</th>
                                                        <th>Category</th>
                                                        <th>Description</th>
                                                        {/* ONLY ADMIN SEES ACTION HEADER */}
                                                        {role === 'admin' && <th>Actions</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* DYNAMIC ROWS */}
                                                    {tests.map((test, index) => (
                                                        <tr key={index}>
                                                            <td>{test.id}</td>
                                                            <td>{test.testName}</td>
                                                            <td>
                                                                <span className="badge bg-secondary">{test.category}</span>
                                                            </td>
                                                            <td>{test.description}</td>
                                                            
                                                            {/* ONLY ADMIN SEES BUTTONS */}
                                                            {role === 'admin' && (
                                                                <td>
                                                                    <Link to={`/edit-test/${test.id}`} className="btn btn-primary btn-sm me-1">
                                                                        <i className="fas fa-pencil-alt"></i>
                                                                    </Link>
                                                                    
                                                                    <button 
                                                                        className="btn btn-danger btn-sm" 
                                                                        onClick={() => deleteTest(test.id)}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}

                                                    {/* Empty State */}
                                                    {tests.length === 0 && (
                                                        <tr>
                                                            <td colSpan={role === 'admin' ? 5 : 4} className="text-center">
                                                                No tests found.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
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

export default Tests;