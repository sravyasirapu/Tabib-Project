import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Patients() {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role.toLowerCase() : 'patients';

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/patients');
            setPatients(result.data);
        } catch (error) {
            console.error("Error loading patients:", error);
        }
    };

    const getPhoto = (patient) => {
        if (patient.photo && patient.photo.length > 50) return patient.photo;
        return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    };

    const deletePatient = async (id) => {
        Swal.fire({
            title: 'Delete Patient?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, Delete!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api/patients/${id}`);
                    Swal.fire('Deleted!', 'Patient removed.', 'success');
                    loadPatients();
                } catch (error) { Swal.fire('Error', 'Cannot delete.', 'error'); }
            }
        });
    }

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="row page-titles mx-0">
                        <div className="col-sm-6 p-md-0"><h4 className="text-primary">All Patients</h4></div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header fix-card">
                                    <div className="row">
                                        <div className="col-8"><h4 className="card-title"> Patients List </h4></div>
                                        <div className="col-4 float-end">
                                            {role === 'admin' && <Link to="/add-patient" className="btn btn-primary float-end">New Patient</Link>}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped display nowrap">
                                            <thead>
                                                <tr>
                                                    <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Gender</th><th>City</th>
                                                    {/* ONLY ADMIN SEES ACTION HEADER */}
                                                    {role === 'admin' && <th>Action</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patients.map((patient, index) => (
                                                    <tr key={index}>
                                                        <td>#{patient.id}</td>
                                                        <td><img src={getPhoto(patient)} className="rounded-circle mr-2" width="30" height="30" style={{objectFit:'cover'}} alt=""/>{patient.fullName}</td>
                                                        <td>{patient.email}</td><td>{patient.phone}</td><td>{patient.gender}</td><td>{patient.city}</td>
                                                        
                                                        {/* ONLY ADMIN SEES BUTTONS */}
                                                        {role === 'admin' && (
                                                            <td>
                                                                <Link to={`/edit-patient/${patient.id}`} className="btn btn-primary btn-sm me-1"><i className="fas fa-pencil-alt"></i></Link>
                                                                <button className="btn btn-danger btn-sm" onClick={() => deletePatient(patient.id)}><i className="fas fa-trash"></i></button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                                {patients.length === 0 && <tr><td colSpan={role==='admin'?7:6} className="text-center">No patients found.</td></tr>}
                                            </tbody>
                                        </table>
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

export default Patients;