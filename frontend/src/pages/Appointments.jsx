import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
function Appointments() {
    // 1. Get User Info
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Safety check
    const role = user ? user.role.toLowerCase() : 'patients';
    const userId = user ? user.id : 0;
    const userEmail = user ? user.email.toLowerCase().trim() : '';

    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/appointments');
            let data = result.data;

            // --- FILTERING LOGIC ---
            if (role === 'patients') {
                // Patient Match: Email
                data = data.filter(a => a.patient?.email?.toLowerCase().trim() === userEmail);
            } 
            else if (role === 'doctor') {
                // *** FIX: Match Doctor by User ID (Convert to String for safety) ***
                data = data.filter(a => {
                    const docUserId = a.doctor?.user?.id;
                    return String(docUserId) === String(userId);
                });
            }
            // Admin sees ALL

            setAppointments(data);
        } catch (error) {
            console.error("Error loading appointments:", error);
        }
    };

    const deleteAppointment = async (id) => {
        // PROFESSIONAL CONFIRMATION
        Swal.fire({
            title: 'Cancel Appointment?',
            text: "Are you sure you want to cancel this?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Red for cancel/delete
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Cancel it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api/appointments/${id}`);
                    
                    // SUCCESS ALERT
                    Swal.fire(
                        'Cancelled!',
                        'The appointment has been cancelled.',
                        'success'
                    );
                    loadAppointments(); // Refresh list
                } catch (error) {
                    // ERROR ALERT
                    Swal.fire(
                        'Error',
                        'Could not cancel appointment.',
                        'error'
                    );
                }
            }
        });
    };

    const filteredAppointments = appointments.filter((appt) => {
        const doctorName = appt.doctor?.user?.name?.toLowerCase() || '';
        const patientName = appt.patient?.fullName?.toLowerCase() || '';
        const notes = appt.notes?.toLowerCase() || '';
        const status = appt.status || '';

        const matchesSearch = doctorName.includes(searchTerm.toLowerCase()) || 
                              patientName.includes(searchTerm.toLowerCase()) || 
                              notes.includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === '' || filterStatus === 'Filter by Status' || status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="new_appointment main_container">
                        
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4 className="text-primary">
                                        {role === 'admin' ? "All Appointments" : "My Appointments"}
                                    </h4>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active"><Link to="/appointments">Appointments</Link></li>
                                </ol>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card shadow">
                                    <div className="card-header">
                                        <div className="row m-rl w-100">
                                            <div className="col-lg-3 col-sm-12">
                                                <div className="form-group">
                                                    <input 
                                                        className="form-control" 
                                                        type="search" 
                                                        placeholder="Search..." 
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-12">
                                                <div className="form-group">
                                                    <select 
                                                        className="form-control form-select"
                                                        onChange={(e) => setFilterStatus(e.target.value)}
                                                    >
                                                        <option value="">Filter by Status</option>
                                                        <option value="Scheduled">Scheduled</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                        <option value="No-Show">No-Show</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-sm-12">
                                                <div className="form-group">
                                                    <Link to="/add-appointment" className="btn btn-primary w-100 h-56">
                                                        Book New Appointment
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table id="example3" className="table table-striped display nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Doctor</th>
                                                        {role !== 'patients' && <th>Patient</th>}
                                                        <th>Status</th>
                                                        <th>Notes</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredAppointments.map((appt, index) => (
                                                        <tr key={index}>
                                                            <td>{appt.appointmentDate}</td>
                                                            <td>{appt.appointmentTime}</td>
                                                            <td>{appt.doctor?.user?.name || 'Unknown'}</td>
                                                            {role !== 'patients' && <td>{appt.patient?.fullName || 'Unknown'}</td>}
                                                            <td>
                                                                <span className={`badge ${
                                                                    appt.status === 'Completed' ? 'bg-success' : 
                                                                    appt.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                                                                }`}>
                                                                    {appt.status}
                                                                </span>
                                                            </td>
                                                            <td>{appt.notes}</td>
                                                            <td>
                                                                {(role === 'admin' || role === 'doctor') && (
                                                                    <Link to={`/edit-appointment/${appt.id}`} className="btn btn-primary btn-sm me-1">
                                                                        <i className="fas fa-pencil-alt"></i>
                                                                    </Link>
                                                                )}
                                                                
                                                                <button className="btn btn-danger btn-sm" onClick={() => deleteAppointment(appt.id)}>
    Cancel
</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {filteredAppointments.length === 0 && (
                                                        <tr>
                                                            <td colSpan="7" className="text-center">No appointments found.</td>
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

export default Appointments;