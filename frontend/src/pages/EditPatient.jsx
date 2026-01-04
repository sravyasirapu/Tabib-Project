import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function EditPatient() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', dob: '', gender: '', city: '', address: '', photo: ''
    });

    const [imagePreview, setImagePreview] = useState(null);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    useEffect(() => {
        const loadPatientData = async () => {
            try {
                const result = await axios.get(`http://localhost:8080/api/patients/${id}`);
                setFormData(result.data);
                if (result.data.photo && result.data.photo.length > 20) {
                    setImagePreview(result.data.photo);
                }
            } catch (error) {
                console.error("Error loading patient:", error);
            }
        };
        loadPatientData();
    }, [id]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setImagePreview(base64);
            setFormData({ ...formData, photo: base64 });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update Patient Table (This contains the photo for Patients)
            await axios.put(`http://localhost:8080/api/patients/${id}`, formData);
            
            // OPTIONAL: Try to sync with Users table if email matches (Good practice)
            try {
                const allUsers = await axios.get('http://localhost:8080/api/users');
                const matchingUser = allUsers.data.find(u => u.email === formData.email);
                if (matchingUser) {
                    const userUpdate = { ...matchingUser, photo: formData.photo, name: formData.fullName, phone: formData.phone };
                    await axios.put(`http://localhost:8080/api/users/${matchingUser.id}`, userUpdate);
                }
            } catch (err) {
                console.log("Could not sync with Users table (Minor issue)");
            }

            Swal.fire({
                title: 'Success!',
                text: 'Patient updated successfully.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => navigate('/patients'));

        } catch (error) {
            Swal.fire('Error', 'Failed to update patient.', 'error');
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0"><h4 className="text-primary">Edit Patient</h4></div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card shadow">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-xl-4 text-center">
                                            <img 
                                                src={imagePreview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                                className="rounded-circle mb-3 border" 
                                                style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                                                alt="" 
                                            />
                                            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                                        </div>

                                        <div className="col-xl-8">
                                            <div className="row">
                                                <div className="col-md-6 mb-3"><label className="form-label">Full Name</label><input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">Email</label><input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">Phone</label><input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">DOB</label><input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">City</label><input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} /></div>
                                                <div className="col-md-12 mb-3"><label className="form-label">Address</label><textarea className="form-control" name="address" rows="3" value={formData.address} onChange={handleChange}></textarea></div>
                                            </div>
                                            <button type="submit" className="btn btn-primary float-end">Update Patient</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default EditPatient;