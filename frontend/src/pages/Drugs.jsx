import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Drugs() {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user ? user.role.toLowerCase() : 'patients';

    const [drugs, setDrugs] = useState([]);

    useEffect(() => {
        loadDrugs();
    }, []);

    const loadDrugs = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/drugs');
            setDrugs(result.data);
        } catch (error) { console.error(error); }
    };

    const deleteDrug = async (id) => {
        Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes' }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:8080/api/drugs/${id}`);
                loadDrugs();
                Swal.fire('Deleted!', '', 'success');
            }
        });
    }

    return (
        <Layout>
            <div className="warper container-fluid">
                <div className="all-patients main_container">
                    <div className="row page-titles mx-0"><div className="col-sm-6 p-md-0"><h4 className="text-primary">All Drugs</h4></div></div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card shadow mb-4">
                                <div className="card-header fix-card">
                                    <div className="row">
                                        <div className="col-8"><h4 className="card-title">Drugs List</h4></div>
                                        <div className="col-4">
                                            {role === 'admin' && <Link to="/add-drug" className="btn btn-primary float-end">Add Drug</Link>}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th><th>Drug Name</th><th>Category</th><th>Description</th>
                                                    {role === 'admin' && <th>Actions</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {drugs.map((drug, index) => (
                                                    <tr key={index}>
                                                        <td>{drug.id}</td><td>{drug.drugName}</td><td><span className="badge bg-primary">{drug.category}</span></td><td>{drug.description}</td>
                                                        {role === 'admin' && (
                                                            <td>
                                                                <Link to={`/edit-drug/${drug.id}`} className="btn btn-primary btn-sm me-1"><i className="fas fa-pencil-alt"></i></Link>
                                                                <button className="btn btn-danger btn-sm" onClick={() => deleteDrug(drug.id)}><i className="fas fa-trash"></i></button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                                {drugs.length === 0 && <tr><td colSpan={role==='admin'?5:4} className="text-center">No drugs found.</td></tr>}
                                            </tbody>
                                        </table>
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

export default Drugs;