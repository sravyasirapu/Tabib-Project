import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function DoctorSchedule() {
    // 1. State
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    
    // Initial empty schedule structure
    const initialSchedule = {
        Mon: { start: '', end: '', id: null },
        Tue: { start: '', end: '', id: null },
        Wed: { start: '', end: '', id: null },
        Thu: { start: '', end: '', id: null },
        Fri: { start: '', end: '', id: null },
        Sat: { start: '', end: '', id: null },
        Sun: { start: '', end: '', id: null },
    };

    const [schedule, setSchedule] = useState(initialSchedule);

    // 2. Load Doctors on Mount
    useEffect(() => {
        axios.get('http://localhost:8080/api/doctors')
            .then(res => setDoctors(res.data))
            .catch(err => console.error(err));
    }, []);

    // 3. Load Schedule when Doctor is selected
    const handleDoctorChange = async (e) => {
        const docId = e.target.value;
        setSelectedDoctorId(docId);
        setSchedule(initialSchedule); // Reset first

        if (docId) {
            try {
                // Fetch existing schedule from backend
                const res = await axios.get(`http://localhost:8080/api/doctor_availability/doctor/${docId}`);
                const data = res.data;

                // Map backend data to our state structure
                const newSchedule = { ...initialSchedule };
                data.forEach(item => {
                    if (newSchedule[item.dayOfWeek]) {
                        newSchedule[item.dayOfWeek] = {
                            start: item.startTime, // HH:mm:ss
                            end: item.endTime,     // HH:mm:ss
                            id: item.id            // Keep track of ID for updates
                        };
                    }
                });
                setSchedule(newSchedule);
            } catch (error) {
                console.error("Error loading schedule:", error);
            }
        }
    };

    // 4. Handle Input Change
    const handleTimeChange = (day, type, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [type]: value
            }
        }));
    };

    // 5. Submit Schedule
    // 5. Submit Schedule
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation Alert
        if (!selectedDoctorId) {
            Swal.fire({
                title: 'Missing Info',
                text: 'Please select a doctor first.',
                icon: 'warning',
                confirmButtonColor: '#f0ad4e'
            });
            return;
        }

        try {
            const promises = Object.keys(schedule).map(day => {
                const dayData = schedule[day];
                
                // Only save if times are entered
                if (dayData.start && dayData.end) {
                    const payload = {
                        doctor: { id: selectedDoctorId },
                        dayOfWeek: day,
                        startTime: dayData.start.length === 5 ? dayData.start + ":00" : dayData.start,
                        endTime: dayData.end.length === 5 ? dayData.end + ":00" : dayData.end
                    };
                    return axios.post('http://localhost:8080/api/doctor_availability', payload);
                }
                return null;
            });

            await Promise.all(promises);
            
            // SUCCESS ALERT
            Swal.fire({
                title: 'Success!',
                text: 'Doctor schedule updated successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error("Error saving schedule:", error);
            
            // ERROR ALERT
            Swal.fire('Error', 'Failed to save schedule. Please try again.', 'error');
        }
    };

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="doctorino_settings main_container">
                        
                        <div className="row page-titles mx-0">
                            <div className="col-sm-6 p-md-0">
                                <div className="welcome-text">
                                    <h4 className="text-primary">Doctor Settings</h4>
                                </div>
                            </div>
                            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item active">Doctor Schedule</li>
                                </ol>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow mb-4">
                                    <div className="card-header">
                                        <h4 className="card-title"> Doctor Availability Schedule </h4>
                                    </div>
                                    <div className="card-body">
                                        
                                        {/* 1. SELECT DOCTOR */}
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label">Select Doctor to Configure:</label>
                                                <select className="form-control form-select" onChange={handleDoctorChange}>
                                                    <option value="">-- Select Doctor --</option>
                                                    {doctors.map(doc => (
                                                        <option key={doc.id} value={doc.id}>
                                                            {doc.user?.name} ({doc.specialization})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <hr />

                                        {/* 2. SCHEDULE FORM */}
                                        <form onSubmit={handleSubmit}>
                                            {daysOfWeek.map(day => (
                                                <div className="row align-items-center mb-3" key={day}>
                                                    <label className="col-sm-3 col-form-label fw-bold">{day}</label>
                                                    <div className="col-sm-4">
                                                        <div className="form-group mb-0">
                                                            <label className="small text-muted">Start Time</label>
                                                            <input 
                                                                type="time" 
                                                                className="form-control" 
                                                                value={schedule[day].start}
                                                                onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <div className="form-group mb-0">
                                                            <label className="small text-muted">End Time</label>
                                                            <input 
                                                                type="time" 
                                                                className="form-control" 
                                                                value={schedule[day].end}
                                                                onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="row mt-4">
                                                <div className="col-sm-12">
                                                    <div className="form-group">
                                                        <button type="submit" className="btn btn-primary float-end">Update Schedule</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

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

export default DoctorSchedule;