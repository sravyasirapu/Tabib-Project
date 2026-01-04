import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function AddPrescription() {
    const navigate = useNavigate();
    
    // Get User Info
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role.toLowerCase() : '';
    const userId = user ? user.id : 0;

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({ appointmentId: '', doctorId: '', patientId: '', diagnosis: '', nextVisit: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptRes, docRes, patRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/appointments'),
                    axios.get('http://localhost:8080/api/doctors'),
                    axios.get('http://localhost:8080/api/patients')
                ]);

                let appts = apptRes.data;

                // --- FILTER LOGIC FOR DOCTOR ---
                if (role === 'doctor') {
                    // Only show appointments where the Doctor's User ID matches the Logged In ID
                    appts = appts.filter(a => a.doctor?.user?.id === userId);
                }

                setAppointments(appts);
                setDoctors(docRes.data);
                setPatients(patRes.data);
            } catch (error) { console.error("Error loading data", error); }
        };
        fetchData();
    }, [role, userId]);

    const handleAppointmentChange = (e) => {
        const appId = e.target.value;
        setFormData({ ...formData, appointmentId: appId });
        const selectedAppt = appointments.find(a => a.id.toString() === appId);
        if (selectedAppt) {
            setFormData(prev => ({
                ...prev, appointmentId: appId, doctorId: selectedAppt.doctor?.id || '', patientId: selectedAppt.patient?.id || ''
            }));
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/prescriptions', {
                appointment: { id: formData.appointmentId },
                doctor: { id: formData.doctorId },
                patient: { id: formData.patientId },
                diagnosis: formData.diagnosis,
                nextVisit: formData.nextVisit
            });
            Swal.fire({ title: 'Saved!', text: 'Prescription created.', icon: 'success', timer: 2000, showConfirmButton: false }).then(() => navigate('/prescriptions'));
        } catch (error) { Swal.fire('Error', 'Failed to save.', 'error'); }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="row page-titles mx-0"><div className="col-sm-6 p-md-0"><h4 className="text-primary">New Prescription</h4></div></div>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow mb-4">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-4 col-12"><div className="form-group"><label className="form-label">Select Appointment</label>
                                                <select className="form-control form-select" name="appointmentId" value={formData.appointmentId} onChange={handleAppointmentChange} required>
                                                    <option value="">Select Appointment...</option>
                                                    {appointments.map(appt => (<option key={appt.id} value={appt.id}>{appt.appointmentDate} - {appt.patient?.fullName}</option>))}
                                                </select>
                                            </div></div>
                                            <div className="col-lg-4 col-12"><div className="form-group"><label className="form-label">Doctor</label><select className="form-control form-select" disabled value={formData.doctorId}><option value="">Auto</option>{doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.user?.name}</option>)}</select></div></div>
                                            <div className="col-lg-4 col-12"><div className="form-group"><label className="form-label">Patient</label><select className="form-control form-select" disabled value={formData.patientId}><option value="">Auto</option>{patients.map(pat => <option key={pat.id} value={pat.id}>{pat.fullName}</option>)}</select></div></div>
                                            <div className="col-lg-12 col-12"><div className="form-group"><label className="form-label">Next Visit</label><input type="date" className="form-control" name="nextVisit" value={formData.nextVisit} onChange={handleChange} /></div></div>
                                            <div className="col-lg-12 col-12"><div className="form-group"><label className="form-label">Diagnosis & Medicines</label><textarea className="form-control" name="diagnosis" rows="4" value={formData.diagnosis} onChange={handleChange}></textarea></div></div>
                                            <div className="col-12 mt-3"><button type="submit" className="btn btn-primary float-end">Create Prescription</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default AddPrescription;