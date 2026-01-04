import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function EditDoctor() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Store User ID separately to update the User Table
    const [userId, setUserId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', photo: '', // User Fields
        specialization: '', qualification: '', experience: '', consultationFee: '', about: '', status: 'active' // Doctor Fields
    });

    const [imagePreview, setImagePreview] = useState(null);

    // 1. Convert Image to Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    // 2. Fetch Data
    useEffect(() => {
        loadDoctorData();
    }, []);

    const loadDoctorData = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/api/doctors/${id}`);
            const doc = result.data;
            
            setUserId(doc.user.id); // IMPORTANT: Save the User ID

            setFormData({
                name: doc.user.name,
                email: doc.user.email,
                phone: doc.user.phone,
                photo: doc.user.photo || '',
                status: doc.user.status,
                specialization: doc.specialization,
                qualification: doc.qualification,
                experience: doc.experience,
                consultationFee: doc.consultationFee,
                about: doc.about
            });

            if (doc.user.photo && doc.user.photo.length > 20) {
                setImagePreview(doc.user.photo);
            }
        } catch (error) {
            console.error("Error loading doctor:", error);
        }
    };

    // 3. Handle Image Change
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setImagePreview(base64);
            setFormData({ ...formData, photo: base64 }); // Update State
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Submit Updates
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // STEP A: Update USER Table (Name, Email, Photo)
            // We must update the User entity because that's where the Doctor's photo lives
            const userPayload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                photo: formData.photo, // <--- SENDING NEW PHOTO
                role: 'doctor',
                status: formData.status
                // Password usually ignored in update unless handled specifically
            };
            await axios.put(`http://localhost:8080/api/users/${userId}`, userPayload);

            // STEP B: Update DOCTOR Table (Specialization, Fees)
            const doctorPayload = {
                specialization: formData.specialization,
                qualification: formData.qualification,
                experience: formData.experience,
                consultationFee: formData.consultationFee,
                about: formData.about
            };
            await axios.put(`http://localhost:8080/api/doctors/${id}`, doctorPayload);

            Swal.fire({
                title: 'Updated!',
                text: 'Doctor details updated successfully.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => navigate('/doctors'));

        } catch (error) {
            Swal.fire('Error', 'Failed to update doctor.', 'error');
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0"><h4 className="text-primary">Edit Doctor</h4></div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card shadow">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        {/* IMAGE UPLOAD */}
                                        <div className="col-xl-4 text-center">
                                            <img 
                                                src={imagePreview || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                                                className="rounded-circle mb-3 border" 
                                                style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                                                alt="" 
                                            />
                                            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                                        </div>

                                        {/* FORM FIELDS */}
                                        <div className="col-xl-8">
                                            <div className="row">
                                                <div className="col-md-6 mb-3"><label className="form-label">Name</label><input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">Email</label><input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">Phone</label><input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">Status</label>
                                                    <select className="form-control form-select" name="status" value={formData.status} onChange={handleChange}>
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                                
                                                <div className="col-12"><hr/></div>

                                                <div className="col-md-6 mb-3"><label className="form-label">Specialization</label><input type="text" className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">Qualification</label><input type="text" className="form-control" name="qualification" value={formData.qualification} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">Fee ($)</label><input type="number" className="form-control" name="consultationFee" value={formData.consultationFee} onChange={handleChange} /></div>
                                                <div className="col-md-6 mb-3"><label className="form-label">Experience</label><input type="number" className="form-control" name="experience" value={formData.experience} onChange={handleChange} /></div>
                                            </div>
                                            <button type="submit" className="btn btn-primary float-end">Update Doctor</button>
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

export default EditDoctor;