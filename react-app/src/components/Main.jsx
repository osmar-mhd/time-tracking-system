import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Only import Route and Routes
import Login from './Section/Login';
import Profile from './Section/Profile';
import Home from './Section/Home';
import '../assets/css/main.css';

const Main = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
}

export default Main;