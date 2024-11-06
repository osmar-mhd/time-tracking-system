import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Section/Home';
import '../assets/css/main.css';

const Main = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default Main;