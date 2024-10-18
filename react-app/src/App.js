import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import './assets/css/styles.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Main />
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;