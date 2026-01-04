import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function AddAppointment() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role : 'patients';
    const userEmail = user ? user.email.toLowerCase().trim() : '';

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    
    const [formData, setFormData] = useState({
        doctor: { id: '' },
        patient: { id: '' },
        appointmentDate: '',
        appointmentTime: '',
        status: 'Scheduled',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [docRes, patRes] = await Promise.all([
                axios.get('http://localhost:8080/api/doctors'),
                axios.get('http://localhost:8080/api/patients')
            ]);
            setDoctors(docRes.data);
            setPatients(patRes.data);

            if (role === 'patients') {
                const myPatientProfile = patRes.data.find(p => p.email.toLowerCase().trim() === userEmail);
                if (myPatientProfile) {
                    setFormData(prev => ({ ...prev, patient: { id: myPatientProfile.id } }));
                }
            }
        } catch (error) { console.error("Error loading data", error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/appointments', formData);
            
            // SWEET ALERT SUCCESS
            Swal.fire({
                title: 'Booked!',
                text: 'Appointment has been scheduled.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => navigate('/appointments'));

        } catch (error) {
            Swal.fire('Error', 'Failed to book appointment.', 'error');
        }
    };
    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="row page-titles mx-0">
                        <div className="col-sm-6 p-md-0">
                            <h4 className="text-primary">Book Appointment</h4>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card shadow">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            
                                            {/* Select Doctor */}
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Select Doctor</label>
                                                    <select className="form-control form-select" required
                                                        onChange={(e) => setFormData({...formData, doctor: { id: e.target.value }})}>
                                                        <option value="">-- Choose Doctor --</option>
                                                        {doctors.map(doc => (
                                                            <option key={doc.id} value={doc.id}>
                                                                {doc.user?.name} - {doc.specialization}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Select Patient (CLEANER - NO IDs SHOWN) */}
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Select Patient</label>
                                                    <select 
                                                        className="form-control form-select" 
                                                        required
                                                        value={formData.patient.id} 
                                                        onChange={(e) => setFormData({...formData, patient: { id: e.target.value }})}
                                                        disabled={role === 'patients'} 
                                                    >
                                                        <option value="">-- Choose Patient --</option>
                                                        {patients.map(p => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.fullName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Date</label>
                                                    <input type="date" className="form-control" required
                                                        onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
                                                </div>
                                            </div>

                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Time</label>
                                                    <input type="time" className="form-control" required
                                                        onChange={(e) => setFormData({...formData, appointmentTime: e.target.value + ":00"})} />
                                                </div>
                                            </div>

                                            <div className="col-xl-12">
                                                <div className="form-group">
                                                    <label className="form-label">Reason / Symptoms</label>
                                                    <textarea className="form-control" rows="3"
                                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
                                                </div>
                                            </div>

                                        </div>
                                        <button type="submit" className="btn btn-primary float-end">Book Appointment</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AddAppointment;