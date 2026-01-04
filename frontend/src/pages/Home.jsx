import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

function Home() {
    const navigate = useNavigate();

    // 1. SECURITY CHECK: Check if user is logged in (Check both Local and Session storage)
    const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // State for storing Database Data
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, earnings: 0 });
    const [appointments, setAppointments] = useState([]); 
    const [doctors, setDoctors] = useState([]); 

    // 2. REDIRECT LOGIC: Run this immediately when page loads
    useEffect(() => {
        if (!user) {
            // If no user found, go to Login Page immediately
            navigate('/login');
        } else {
            // If user exists, fetch the dashboard data
            fetchDashboardData();
        }
    }, []);

    // If no user is present, show nothing (prevents home screen flicker)
    if (!user) {
        return null; 
    }

    // Safety variables for the UI
    const role = user.role ? user.role.toLowerCase() : 'patients'; 
    const userName = user.name || 'User';
    const userId = user.id || 0; 
    const userEmail = user.email ? user.email.toLowerCase().trim() : '';

    const fetchDashboardData = async () => {
        try {
            const [docRes, patRes, apptRes] = await Promise.all([
                axios.get('http://localhost:8080/api/doctors'),
                axios.get('http://localhost:8080/api/patients'),
                axios.get('http://localhost:8080/api/appointments')
            ]);

            // --- FILTERING LOGIC ---
            let allAppointments = apptRes.data.reverse(); 
            
            if (role === 'patients') {
                allAppointments = allAppointments.filter(appt => {
                    const ptEmail = appt.patient?.email ? appt.patient.email.toLowerCase().trim() : '';
                    return ptEmail === userEmail;
                });
            } 
            else if (role === 'doctor') {
                allAppointments = allAppointments.filter(appt => {
                    const docUserId = appt.doctor?.user?.id; 
                    return String(docUserId) === String(userId);
                });
            }

            setAppointments(allAppointments);
            setDoctors(docRes.data); 

            setStats({
                doctors: docRes.data.length,
                patients: patRes.data.length,
                appointments: allAppointments.length, 
                earnings: apptRes.data.length * 500 
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid"> 
                <div className="all-patients main_container">
                    
                    <div className="row page-titles mx-0">
                        <div className="col-lg-12 p-md-0">
                            <h4 className="text-primary">Welcome back, <span className="names">{userName}</span></h4>
                            <p className="mb-0">Hospital Management Dashboard</p>
                        </div>
                    </div>
                    
                    <div className="new-patients main_container">
                        <div className="row">
                            
                            <div className="col-sm-6 col-xl-3 col-lg-6">
                                <div className="widget card card-primary bg-card1">
                                    <div className="card-body">
                                        <div className="media text-center">
                                            <span><i className="fas fa-user-md fa-2x"></i></span>
                                            <div className="media-body">
                                                <span className="text-white">Total Doctors</span>
                                                <h3 className="mb-0 text-white">{stats.doctors}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 col-xl-3 col-lg-6">
                                <div className="widget card card-primary bg-card3">
                                    <div className="card-body">
                                        <div className="media text-center">
                                            <span><i className="fas fa-calendar-alt fa-2x"></i></span>
                                            <div className="media-body">
                                                <span className="text-white">
                                                    {role === 'admin' ? "Total Appointments" : "My Appointments"}
                                                </span>
                                                <h3 className="mb-0 text-white">{stats.appointments}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {role !== 'patients' && (
                                <div className="col-sm-6 col-xl-3 col-lg-6">
                                    <div className="widget card card-danger bg-card2">
                                        <div className="card-body">
                                            <div className="media text-center">
                                                <span><i className="fas fa-users fa-2x"></i></span>
                                                <div className="media-body">
                                                    <span className="text-white">Total Patients</span>
                                                    <h3 className="mb-0 text-white">{stats.patients}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {role === 'admin' && (
                                <div className="col-sm-6 col-xl-3 col-lg-6">
                                    <div className="widget card card-primary bg-card4">
                                        <div className="card-body">
                                            <div className="media text-center">
                                                <span><i className="fas fa-dollar-sign fa-2x"></i></span>
                                                <div className="media-body">
                                                    <span className="text-white">Earnings</span>
                                                    <h3 className="mb-0 text-white">${stats.earnings}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="card shadow">
                                    <div className="card-header">
                                        <h4 className="card-title">
                                            {role === 'admin' ? "All Upcoming Schedule" : "My Upcoming Schedule"}
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Date/Time</th>
                                                        {role !== 'patients' && <th>Patient</th>}
                                                        <th>Doctor</th>
                                                        <th>Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {appointments.filter(a => a.status === 'Scheduled').slice(0, 5).map((appt, index) => (
                                                        <tr key={index}>
                                                            <td className="text-primary">{appt.appointmentDate} <br/> <small>{appt.appointmentTime}</small></td>
                                                            {role !== 'patients' && <td>{appt.patient?.fullName}</td>}
                                                            <td>{appt.doctor?.user?.name || "Unknown"}</td>
                                                            <td>{appt.notes}</td>
                                                        </tr>
                                                    ))}
                                                    {appointments.filter(a => a.status === 'Scheduled').length === 0 && (
                                                        <tr><td colSpan="4" className="text-center">No upcoming appointments.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card shadow">
                                    <div className="card-header">
                                        <h4 className="card-title">Our Doctors</h4>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-group list-unstyled">
                                            {doctors.slice(0, 5).map((doc, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center media">
                                                    <div className="d-flex align-items-center">
                                                        <img src={doc.user?.photo || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} className="rounded-circle" style={{width: '40px', height: '40px'}} alt="" />
                                                        <div className="media-body ms-3">
                                                            <h4 className="mb-0">{doc.user?.name}</h4>
                                                            <span className="text-muted small">{doc.specialization}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow">
                                    <div className="card-header">
                                        <h4 className="card-title">
                                            {role === 'admin' ? "Recent Activity" : "My History"}
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-striped display nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Doctor</th>
                                                        {role !== 'patients' && <th>Patient</th>}
                                                        <th>Status</th>
                                                        {(role === 'admin' || role === 'doctor') && <th>Action</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {appointments.slice(0, 5).map((appt) => (
                                                        <tr key={appt.id}>
                                                            <td>{appt.appointmentDate}</td>
                                                            <td>{appt.appointmentTime}</td>
                                                            <td>{appt.doctor?.user?.name || "Unknown"}</td>
                                                            {role !== 'patients' && <td>{appt.patient?.fullName}</td>}
                                                            <td>
                                                                <span className={`badge ${
                                                                    appt.status === 'Completed' ? 'bg-success' : 
                                                                    appt.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'
                                                                }`}>
                                                                    {appt.status}
                                                                </span>
                                                            </td>
                                                            {(role === 'admin' || role === 'doctor') && (
                                                                <td>
                                                                    <Link to={`/edit-appointment/${appt.id}`} className="btn btn-primary btn-sm">
                                                                        <i className="fas fa-pencil-alt"></i>
                                                                    </Link>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
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

export default Home;