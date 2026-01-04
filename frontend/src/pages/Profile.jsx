import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Swal from 'sweetalert2';

function Profile() {
    const navigate = useNavigate();
    
    // 1. Basic User Data (For Everyone)
    const [userData, setUserData] = useState({
        id: '', name: '', email: '', password: '', phone: '', photo: '', role: '', status: ''
    });

    // 2. Doctor Specific Data
    const [docData, setDocData] = useState({
        id: '', specialization: '', qualification: '', experience: 0, consultationFee: 0, about: ''
    });

    // 3. Patient Specific Data
    const [patData, setPatData] = useState({
        id: '', address: '', city: '', dob: '', gender: 'male'
    });

    const [imagePreview, setImagePreview] = useState(null);

    // --- MAIN LOAD LOGIC (Moved inside useEffect to fix warnings) ---
    useEffect(() => {
        const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
        const localUser = userString ? JSON.parse(userString) : null;

        if (!localUser) { 
            navigate('/login'); 
            return; 
        }

        const fetchData = async () => {
            try {
                const userId = localUser.id;
                const role = localUser.role;

                // A. Fetch User Details (Login Info)
                const userRes = await axios.get(`http://localhost:8080/api/users/${userId}`);
                setUserData(userRes.data);
                
                // Set Photo Preview
                if (userRes.data.photo && userRes.data.photo.length > 20) {
                    setImagePreview(userRes.data.photo);
                }

                // B. If DOCTOR -> Fetch Doctor Details (Linked by User ID)
                if (role === 'doctor') {
                    const allDocs = await axios.get('http://localhost:8080/api/doctors');
                    const myDoc = allDocs.data.find(d => d.user.id === userId);
                    if (myDoc) {
                        setDocData(myDoc);
                    }
                }

                // C. If PATIENT -> Fetch Patient Details (Linked by EMAIL)
                if (role === 'patients') {
                    const allPats = await axios.get('http://localhost:8080/api/patients');
                    // We match using Email because Patients table doesn't have user_id
                    // Use the email from the fetched user data to be safe
                    const myPat = allPats.data.find(p => p.email.toLowerCase() === userRes.data.email.toLowerCase());
                    if (myPat) {
                        setPatData(myPat);
                    }
                }

            } catch (error) {
                console.error("Error loading profile:", error);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]); 

    // Handle Changes
    const handleUserChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });
    const handleDocChange = (e) => setDocData({ ...docData, [e.target.name]: e.target.value });
    const handlePatChange = (e) => setPatData({ ...patData, [e.target.name]: e.target.value });

    // Handle Image
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImagePreview(reader.result);
                setUserData({ ...userData, photo: reader.result });
            };
        }
    };

    // Submit Updates
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Update User Table (Name, Phone, Photo, Password)
            await axios.put(`http://localhost:8080/api/users/${userData.id}`, userData);
            
            // 2. If Doctor -> Update Doctors Table
            if (userData.role === 'doctor' && docData.id) {
                await axios.put(`http://localhost:8080/api/doctors/${docData.id}`, docData);
            }

            // 3. If Patient -> Update Patients Table (Keep Name/Email synced)
            if (userData.role === 'patients' && patData.id) {
                const updatedPatient = {
                    ...patData,
                    fullName: userData.name, // Sync Name
                    email: userData.email,   // Sync Email
                    phone: userData.phone,   // Sync Phone
                    photo: userData.photo    // Sync Photo
                };
                await axios.put(`http://localhost:8080/api/patients/${patData.id}`, updatedPatient);
            }

            // Update LocalStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            Swal.fire({
                title: 'Success!',
                text: 'Profile Updated Successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => window.location.reload());

        } catch (error) {
            Swal.fire('Error', 'Failed to update profile.', 'error');
        }
    };

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="row page-titles mx-0">
                        <div className="col-sm-6 p-md-0"><h4 className="text-primary">My Profile</h4></div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card shadow">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            {/* PHOTO SECTION */}
                                            <div className="col-xl-4 text-center">
                                                <img 
                                                    src={imagePreview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                                    className="rounded-circle mb-3 border" 
                                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                                                    alt="" 
                                                />
                                                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                                                <h5 className="text-primary mt-3">{userData.name}</h5>
                                                <span className="badge bg-primary">{(userData.role || '').toUpperCase()}</span>
                                            </div>

                                            {/* DATA SECTION */}
                                            <div className="col-xl-8">
                                                <div className="row">
                                                    {/* COMMON FIELDS */}
                                                    <div className="col-md-6 mb-3"><label className="form-label">Full Name</label><input type="text" className="form-control" name="name" value={userData.name} onChange={handleUserChange} /></div>
                                                    <div className="col-md-6 mb-3"><label className="form-label">Email</label><input type="email" className="form-control" name="email" value={userData.email} onChange={handleUserChange} /></div>
                                                    <div className="col-md-6 mb-3"><label className="form-label">Phone</label><input type="text" className="form-control" name="phone" value={userData.phone} onChange={handleUserChange} /></div>
                                                    <div className="col-md-6 mb-3"><label className="form-label">Password</label><input type="text" className="form-control" name="password" value={userData.password} onChange={handleUserChange} /></div>

                                                    {/* DOCTOR FIELDS */}
                                                    {userData.role === 'doctor' && (
                                                        <>
                                                            <div className="col-12"><hr/><h6 className="text-primary">Medical Details</h6></div>
                                                            <div className="col-md-6 mb-3"><label className="form-label">Specialization</label><input type="text" className="form-control" name="specialization" value={docData.specialization} onChange={handleDocChange} /></div>
                                                            <div className="col-md-6 mb-3"><label className="form-label">Qualification</label><input type="text" className="form-control" name="qualification" value={docData.qualification} onChange={handleDocChange} /></div>
                                                            <div className="col-md-6 mb-3"><label className="form-label">Experience (Yrs)</label><input type="number" className="form-control" name="experience" value={docData.experience} onChange={handleDocChange} /></div>
                                                            <div className="col-md-6 mb-3"><label className="form-label">Consultation Fee</label><input type="number" className="form-control" name="consultationFee" value={docData.consultationFee} onChange={handleDocChange} /></div>
                                                            <div className="col-md-12 mb-3"><label className="form-label">About Me</label><textarea className="form-control" name="about" rows="3" value={docData.about} onChange={handleDocChange}></textarea></div>
                                                        </>
                                                    )}

                                                    {/* PATIENT FIELDS (Address, City, etc.) */}
                                                    {userData.role === 'patients' && (
                                                        <>
                                                            <div className="col-12"><hr/><h6 className="text-primary">Patient Details</h6></div>
                                                            <div className="col-md-6 mb-3"><label className="form-label">Date of Birth</label><input type="date" className="form-control" name="dob" value={patData.dob || ''} onChange={handlePatChange} /></div>
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label">Gender</label>
                                                                <select className="form-control form-select" name="gender" value={patData.gender || 'male'} onChange={handlePatChange}>
                                                                    <option value="male">Male</option>
                                                                    <option value="female">Female</option>
                                                                    <option value="other">Other</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-md-6 mb-3"><label className="form-label">City</label><input type="text" className="form-control" name="city" value={patData.city || ''} onChange={handlePatChange} /></div>
                                                            <div className="col-md-12 mb-3"><label className="form-label">Address</label><textarea className="form-control" name="address" rows="3" value={patData.address || ''} onChange={handlePatChange}></textarea></div>
                                                        </>
                                                    )}
                                                </div>
                                                <button type="submit" className="btn btn-primary float-end">Update Profile</button>
                                            </div>
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

export default Profile;