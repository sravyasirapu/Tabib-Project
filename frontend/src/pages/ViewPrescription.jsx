import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';

function ViewPrescription() {
    const { id } = useParams(); // Get ID from URL
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await axios.get(`http://localhost:8080/api/prescriptions/${id}`);
                setData(result.data);
            } catch (error) {
                console.error("Error loading prescription:", error);
            }
        };
        loadData();
    }, [id]);

    if (!data) {
        return <Layout><div className="p-4 text-center">Loading...</div></Layout>;
    }

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    
                    {/* Breadcrumb */}
                    <div className="row page-titles mx-0">
                        <div className="col-sm-6 p-md-0">
                            <h4 className="text-primary">Prescription Details</h4>
                        </div>
                        <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item"><Link to="/prescri
                                ptions">Prescriptions</Link></li>
                                <li className="breadcrumb-item active">View</li>
                            </ol>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card shadow">
                                <div className="card-header text-end">
                                    <h4 className="card-title float-start">Prescription #{data.id}</h4>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                                        <i className="fas fa-print"></i> Print
                                    </button>
                                </div>
                                <div className="card-body">
                                    
                                    {/* HEADER INFO */}
                                    <div className="row mb-5">
                                        <div className="col-md-6">
                                            <h5 className="text-primary mb-2">Doctor Details:</h5>
                                            <strong>{data.doctor?.user?.name || "Unknown Doctor"}</strong><br />
                                            <span className="text-muted">{data.doctor?.specialization}</span><br />
                                            <span className="text-muted">{data.doctor?.user?.email}</span>
                                        </div>
                                        <div className="col-md-6 text-end">
                                            <h5 className="text-primary mb-2">Patient Details:</h5>
                                            <strong>{data.patient?.fullName || "Unknown Patient"}</strong><br />
                                            <span className="text-muted">ID: {data.patient?.id}</span><br />
                                            <span className="text-muted">{data.patient?.phone}</span><br />
                                            <span className="text-muted">{data.patient?.city}</span>
                                        </div>
                                    </div>

                                    <hr />

                                    {/* DIAGNOSIS SECTION */}
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <h5 className="text-primary">Doctor's Instructions & Medicines</h5>
                                            <div className="p-3 bg-light rounded border">
                                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {data.diagnosis}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DETAILS GRID */}
                                    <div className="row mt-4">
                                        <div className="col-md-4">
                                            <label className="text-muted small">Appointment ID</label>
                                            <h6>#{data.appointment?.id || '-'}</h6>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="text-muted small">Visit Date</label>
                                            <h6>{data.appointment?.appointmentDate || '-'}</h6>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="text-muted small text-danger">Next Visit Date</label>
                                            <h6 className="text-danger font-weight-bold">{data.nextVisit || 'Not Scheduled'}</h6>
                                        </div>
                                    </div>

                                    <div className="row mt-5">
                                        <div className="col-12 text-center text-muted">
                                            <hr />
                                            <small>Tabib Hospital Management System</small>
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

export default ViewPrescription;