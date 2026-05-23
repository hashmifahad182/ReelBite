import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'
import '../../styles/admin-dashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [adminPassword, setAdminPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pendingPartners, setPendingPartners] = useState([]);
    const [allPartners, setAllPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    const [storedPassword, setStoredPassword] = useState('');

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (!adminPassword.trim()) {
            setMessage('Please enter admin password');
            return;
        }
        setIsAuthenticated(true);
        setStoredPassword(adminPassword);
        setAdminPassword('');
        fetchData(adminPassword);
    };

    const fetchData = async (password) => {
        setLoading(true);
        try {
            const [pendingRes, allRes] = await Promise.all([
                api.get('/api/admin/pending-partners', {
                    headers: { 'x-admin-password': password }
                }),
                api.get('/api/admin/all-partners', {
                    headers: { 'x-admin-password': password }
                })
            ]);
            setPendingPartners(pendingRes.data.partners);
            setAllPartners(allRes.data.partners);
            setMessage('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error fetching data');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (partnerId) => {
        try {
            await api.post(`/api/admin/approve-partner/${partnerId}`, {}, {
                headers: { 'x-admin-password': storedPassword }
            });
            setMessage(`Partner approved successfully`);
            setPendingPartners(pendingPartners.filter(p => p._id !== partnerId));
            setAllPartners(allPartners.map(p => 
                p._id === partnerId ? { ...p, isApproved: true } : p
            ));
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error approving partner');
        }
    };

    const handleReject = async (partnerId) => {
        if (!window.confirm('Are you sure you want to reject this registration?')) return;
        
        try {
            await api.delete(`/api/admin/reject-partner/${partnerId}`, {
                headers: { 'x-admin-password': storedPassword }
            });
            setMessage(`Partner rejected successfully`);
            setPendingPartners(pendingPartners.filter(p => p._id !== partnerId));
            setAllPartners(allPartners.filter(p => p._id !== partnerId));
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error rejecting partner');
        }
    };

    const handleDelete = async (partnerId, partnerName) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${partnerName}" and all associated data? This cannot be undone.`)) return;
        
        try {
            await api.delete(`/api/admin/delete-partner/${partnerId}`, {
                headers: { 'x-admin-password': storedPassword }
            });
            setMessage(`Business "${partnerName}" deleted successfully`);
            setPendingPartners(pendingPartners.filter(p => p._id !== partnerId));
            setAllPartners(allPartners.filter(p => p._id !== partnerId));
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error deleting partner');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-container">
                <div className="admin-login-box">
                    <h1>Admin Control Panel</h1>
                    <p>Enter your admin password to manage food partner registrations</p>
                    
                    <form onSubmit={handleAdminLogin}>
                        <div className="form-group">
                            <label>Admin Password</label>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                placeholder="Enter admin password"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn-primary">
                            Access Admin Panel
                        </button>
                    </form>

                    {message && <p className="message error">{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Partner Management</h1>
                <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="btn-logout"
                >
                    Logout
                </button>
            </div>

            {message && (
                <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}

            <div className="admin-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Approvals ({pendingPartners.length})
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Businesses ({allPartners.length})
                </button>
            </div>

            <div className="pending-list">
                {loading ? (
                    <p>Loading...</p>
                ) : activeTab === 'pending' ? (
                    pendingPartners.length === 0 ? (
                        <p className="no-items">No pending registrations</p>
                    ) : (
                        pendingPartners.map(partner => (
                            <div key={partner._id} className="partner-card">
                                <div className="partner-info">
                                    <h3>{partner.name}</h3>
                                    <p><strong>Contact:</strong> {partner.contactName}</p>
                                    <p><strong>Email:</strong> {partner.email}</p>
                                    <p><strong>Phone:</strong> {partner.phone}</p>
                                    <p><strong>Address:</strong> {partner.address}</p>
                                    <p className="registered-date">
                                        <strong>Applied:</strong> {new Date(partner.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="partner-actions">
                                    <button 
                                        onClick={() => handleApprove(partner._id)}
                                        className="btn-approve"
                                    >
                                        ✓ Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(partner._id)}
                                        className="btn-reject"
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    allPartners.length === 0 ? (
                        <p className="no-items">No registered businesses</p>
                    ) : (
                        allPartners.map(partner => (
                            <div key={partner._id} className="partner-card">
                                <div className="partner-info">
                                    <div className="partner-header">
                                        <h3>{partner.name}</h3>
                                        <span className={`status-badge ${partner.isApproved ? 'approved' : 'pending'}`}>
                                            {partner.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>
                                    <p><strong>Contact:</strong> {partner.contactName}</p>
                                    <p><strong>Email:</strong> {partner.email}</p>
                                    <p><strong>Phone:</strong> {partner.phone}</p>
                                    <p><strong>Address:</strong> {partner.address}</p>
                                    <p className="registered-date">
                                        <strong>Registered:</strong> {new Date(partner.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="partner-actions">
                                    {!partner.isApproved && (
                                        <button 
                                            onClick={() => handleApprove(partner._id)}
                                            className="btn-approve"
                                        >
                                            ✓ Approve
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(partner._id, partner.name)}
                                        className="btn-delete"
                                    >
                                        🗑 Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
}

