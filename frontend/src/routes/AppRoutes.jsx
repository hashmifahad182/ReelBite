import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import api from "../api/axios";
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import Welcome from '../pages/general/Welcome';
import AdminDashboard from '../pages/admin/AdminDashboard';

const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = useState('loading');

    useEffect(() => {
        api.get('/api/auth/verify', { withCredentials: true })
            .then(() => setAuth(true))
            .catch(() => setAuth(false));
    }, []);

    if (auth === 'loading') {
        return null;
    }

    return auth ? children : <Navigate to="/user/login" replace />;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/admin/pending-partners" element={<AdminDashboard />} />
                <Route path="/home" element={<ProtectedRoute><><Home /><BottomNav /></></ProtectedRoute>} />
                <Route path="/saved" element={<ProtectedRoute><><Saved /><BottomNav /></></ProtectedRoute>} />
                <Route path="/create-food" element={<ProtectedRoute><CreateFood /></ProtectedRoute>} />
                <Route path="/food-partner/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes