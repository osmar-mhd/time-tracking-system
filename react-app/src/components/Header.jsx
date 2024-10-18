import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/header.css';

function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/" title="Home">
                            <i className="material-icons">home</i>
                            <span>Inicio</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" title="Login">
                            <i className="material-icons">login</i>
                            <span>Iniciar Sesión</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" title="Profile">
                            <i className="material-icons">person</i>
                            <span>Perfil</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;