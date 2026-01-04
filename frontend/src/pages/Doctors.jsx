import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Doctors() {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role.toLowerCase() : 'patients'; 

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/doctors');
            setDoctors(result.data);
        } catch (error) {
            console.error("Error loading doctors:", error);
        }
    };

    const deleteDoctor = (id) => {
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
                    await axios.delete(`http://localhost:8080/api/doctors/${id}`);
                    Swal.fire('Deleted!', 'Doctor removed.', 'success');
                    loadDoctors(); 
                } catch (error) {
                    Swal.fire('Error!', 'Could not delete.', 'error');
                }
            }
        });
    }

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    
                    {/* 1. HEADER SECTION */}
                    <div className="row page-titles mx-0">
                        <div className="col-sm-6 p-md-0">
                            <div className="welcome-text">
                                <h4 className="text-primary">Doctors List</h4>
                            </div>
                        </div>
                        <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active"><Link to="/doctors">Doctors</Link></li>
                            </ol>
                        </div>
                    </div>
                    
                    {/* 2. ACTION BAR (Add Button) */}
                    <div className="row mb-4">
                        <div className="col-12">
                            {role === 'admin' && (
                                <Link to="/add-doctor" className="btn btn-primary btn-sm float-end shadow-sm">
                                    <i className="fas fa-plus me-2"></i> Add New Doctor
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* 3. DOCTOR CARDS GRID */}
                    <div className="row">
                        {doctors.map((doc, index) => (
                            // GRID COLUMN SETTING
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
                                
                                {/* INDIVIDUAL CARD START */}
                                <div className="card shadow-sm border-0 h-100" style={{transition: '0.3s', borderRadius: '15px'}}>
                                    <div className="card-body text-center p-3 d-flex flex-column">
                                        
                                        {/* PHOTO */}
                                        <div className="mx-auto mt-2 mb-3" style={{width: '80px', height: '80px'}}>
                                            <img 
                                                src={doc.user?.photo && doc.user.photo.length > 50 
                                                    ? doc.user.photo 
                                                    : "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                                                className="rounded-circle shadow-sm" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', border: '3px solid #f8f9fa' }} 
                                                alt="Doc" 
                                            />
                                        </div>

                                        {/* INFO */}
                                        <h5 className="mb-1 text-dark font-weight-bold">
                                            {doc.user ? doc.user.name : 'Unknown'}
                                        </h5>
                                        <div className="mb-3">
                                            <span className="badge bg-light text-primary">{doc.specialization}</span>
                                        </div>
                                        
                                        {/* STATS */}
                                        <div className="row text-center border-top border-bottom py-2 mb-3 mt-auto bg-light bg-opacity-25">
                                            <div className="col-4 border-end">
                                                <h6 className="mb-0 font-weight-bold small">{doc.experience} Yr</h6>
                                                <small className="text-muted" style={{fontSize: '10px'}}>EXP</small>
                                            </div>
                                            <div className="col-4 border-end">
                                                <h6 className="mb-0 font-weight-bold small">${doc.consultationFee}</h6>
                                                <small className="text-muted" style={{fontSize: '10px'}}>FEE</small>
                                            </div>
                                            <div className="col-4">
                                                <h6 className="mb-0 font-weight-bold small">{doc.qualification}</h6>
                                                <small className="text-muted" style={{fontSize: '10px'}}>DEG</small>
                                            </div>
                                        </div>

                                        {/* BUTTONS LOGIC */}
                                        {role === 'admin' ? (
                                            <div className="d-flex justify-content-center gap-2">
                                                <Link to={`/edit-doctor/${doc.id}`} className="btn btn-light btn-sm text-primary border" style={{fontSize: '12px', flex: 1}}>
                                                    <i className="fas fa-pen"></i> Edit
                                                </Link>
                                                <button className="btn btn-light btn-sm text-danger border" style={{fontSize: '12px', flex: 1}} onClick={() => deleteDoctor(doc.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        ) : role === 'patients' ? (
                                            <div className="d-flex justify-content-center">
                                                <Link to="/add-appointment" className="btn btn-outline-primary btn-sm w-100" style={{fontSize: '12px'}}>
                                                    Book Appointment
                                                </Link>
                                            </div>
                                        ) : null}

                                    </div>
                                </div>
                                {/* INDIVIDUAL CARD END */}

                            </div>
                        ))}

                        {/* EMPTY STATE */}
                        {doctors.length === 0 && (
                            <div className="col-12 text-center p-5">
                                <h5 className="text-muted">No doctors found.</h5>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Doctors;