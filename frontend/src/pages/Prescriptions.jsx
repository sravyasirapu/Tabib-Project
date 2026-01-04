import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Prescriptions() {
    // 1. Get User Info
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role : 'patients';
    const userEmail = user ? user.email : '';

    // 2. State to hold list
    const [prescriptions, setPrescriptions] = useState([]);

    // 3. Fetch Data on Load
    useEffect(() => {
        loadPrescriptions();
    }, []);

    const loadPrescriptions = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/prescriptions');
            
            // --- SMART FILTERING LOGIC ---
            if (role === 'patients') {
                // If Patient: Only show prescriptions where patient email matches logged-in email
                const myPrescriptions = result.data.filter(p => p.patient?.email === userEmail);
                setPrescriptions(myPrescriptions);
            } else {
                // If Admin/Doctor: Show EVERYTHING
                setPrescriptions(result.data);
            }

        } catch (error) {
            console.error("Error loading prescriptions:", error);
        }
    };

    // 4. Delete Function (Only for Admin/Doctor)
    // 4. Delete Function (With SweetAlert)
    const deletePrescription = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api/prescriptions/${id}`);
                    
                    // SUCCESS POPUP
                    Swal.fire(
                        'Deleted!',
                        'The prescription has been deleted.',
                        'success'
                    );
                    loadPrescriptions(); // Refresh list
                } catch (error) {
                    // ERROR POPUP
                    Swal.fire(
                        'Error',
                        'Could not delete prescription.',
                        'error'
                    );
                }
            }
        });
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="all_prescriptions main_container">
                        
                        {/* Page Title & Breadcrumb */}
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4 className="text-primary">
                                        {role === 'patients' ? "My Prescriptions" : "All Prescriptions"}
                                    </h4>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active"><Link to="/prescriptions">Prescriptions</Link></li>
                                </ol>
                            </div>
                        </div>

                        {/* Prescriptions Table */}
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card shadow">
                                    <div className="card-header fix-card">
                                        <div className="row">
                                            <div className="col-8">
                                                <h4 className="card-title"> Prescription List </h4>
                                            </div>
                                            <div className="col-4">
                                                {/* ONLY ADMIN/DOCTOR CAN ADD */}
                                                {(role === 'admin' || role === 'doctor') && (
                                                    <Link to="/new-prescription" className="btn btn-primary float-end">New Prescription</Link>
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
                                                        <th>Date</th>
                                                        <th>Doctor</th>
                                                        {/* Patient doesn't need to see their own name column, but keeping it is fine */}
                                                        <th>Patient</th>
                                                        <th>Medicines / Diagnosis</th>
                                                        <th>Next Visit</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* DYNAMIC ROWS */}
                                                    {prescriptions.map((p, index) => (
                                                        <tr key={index}>
                                                            <td>#{p.id}</td>
                                                            <td>
                                                                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                                                            </td>
                                                            <td>{p.doctor?.user?.name || 'Unknown'}</td>
                                                            <td>{p.patient?.fullName || 'Unknown'}</td>
                                                            {/* Limit diagnosis text length */}
                                                            <td>
                                                                {p.diagnosis.length > 20 ? p.diagnosis.substring(0, 20) + '...' : p.diagnosis}
                                                            </td>
                                                            <td>{p.nextVisit}</td>
                                                            <td>
                                                                {/* View Button (Everyone needs this) */}
                                                                <Link to={`/view-prescription/${p.id}`} className="btn btn-info btn-sm me-1">
                                                                    <i className="fas fa-eye"></i>
                                                                </Link>
                                                                
                                                                {/* Delete Button (HIDDEN FOR PATIENTS) */}
                                                                {(role === 'admin' || role === 'doctor') && (
                                                                    <button 
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => deletePrescription(p.id)}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {prescriptions.length === 0 && (
                                                        <tr>
                                                            <td colSpan="7" className="text-center">No prescriptions found.</td>
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

export default Prescriptions;