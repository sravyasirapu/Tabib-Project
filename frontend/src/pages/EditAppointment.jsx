import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function EditAppointment() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get Appointment ID from URL

    const [formData, setFormData] = useState({
        appointmentDate: '',
        appointmentTime: '',
        status: '',
        notes: '',
        // We store these just for display (read-only)
        doctorName: '',
        patientName: ''
    });

    useEffect(() => {
        loadAppointment();
    }, []);

    const loadAppointment = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/api/appointments/${id}`);
            const data = result.data;
            
            setFormData({
                appointmentDate: data.appointmentDate,
                appointmentTime: data.appointmentTime, // Format is usually HH:mm:ss
                status: data.status,
                notes: data.notes,
                doctorName: data.doctor?.user?.name || "Unknown",
                patientName: data.patient?.fullName || "Unknown"
            });
       } catch (error) {
            console.error("Error loading appointment:", error);
            // SWEET ALERT ERROR
            Swal.fire('Error', 'Could not load appointment details.', 'error');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // We only send the fields allowed to be updated
            const payload = {
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime.length === 5 ? formData.appointmentTime + ":00" : formData.appointmentTime,
                status: formData.status,
                notes: formData.notes
            };

            await axios.put(`http://localhost:8080/api/appointments/${id}`, payload);
            
            // SWEET ALERT SUCCESS
            Swal.fire({
                title: 'Updated!',
                text: 'Appointment updated successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/appointments');
            });

        } catch (error) {
            console.error("Error updating appointment:", error);
            // SWEET ALERT ERROR
            Swal.fire('Error', 'Failed to update appointment.', 'error');
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="row page-titles mx-0">
                        <div className="col-sm-6 p-md-0">
                            <h4 className="text-primary">Edit Appointment</h4>
                        </div>
                        <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item"><Link to="/appointments">Appointments</Link></li>
                                <li className="breadcrumb-item active">Edit</li>
                            </ol>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card shadow">
                                <div className="card-header">
                                    <h4 className="card-title">Update Details</h4>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            
                                            {/* READ ONLY INFO */}
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Doctor</label>
                                                    <input type="text" className="form-control" value={formData.doctorName} disabled />
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Patient</label>
                                                    <input type="text" className="form-control" value={formData.patientName} disabled />
                                                </div>
                                            </div>

                                            {/* EDITABLE FIELDS */}
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Date</label>
                                                    <input 
                                                        type="date" 
                                                        className="form-control" 
                                                        name="appointmentDate"
                                                        value={formData.appointmentDate}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Time</label>
                                                    <input 
                                                        type="time" 
                                                        className="form-control" 
                                                        name="appointmentTime"
                                                        value={formData.appointmentTime}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-xl-6">
                                                <div className="form-group">
                                                    <label className="form-label">Status</label>
                                                    <select 
                                                        className="form-control form-select" 
                                                        name="status"
                                                        value={formData.status}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="Scheduled">Scheduled</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                        <option value="No-Show">No-Show</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-xl-12">
                                                <div className="form-group">
                                                    <label className="form-label">Notes</label>
                                                    <textarea 
                                                        className="form-control" 
                                                        name="notes"
                                                        rows="3" 
                                                        value={formData.notes}
                                                        onChange={handleChange}
                                                    ></textarea>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="form-group text-right">
                                            <button type="submit" className="btn btn-primary float-end">Update Appointment</button>
                                        </div>
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

export default EditAppointment;