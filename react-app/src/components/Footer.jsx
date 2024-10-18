import React from 'react';
import '../assets/css/footer.css';

function Footer() {
    return (
        <footer>
            <h2>Connect with me:</h2>
            <ul className="connect-invisible"> 
                <li>
                    <a 
                        href="https://www.linkedin.com/in/osmar-viorato" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="Visit my LinkedIn profile">
                        <span>LinkedIn</span>
                    </a>
                </li>
                <li>
                    <a 
                        href="https://github.com/osmar-mhd" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="Visit my GitHub profile">
                        <span>GitHub</span>
                    </a>
                </li>
            </ul>
        </footer>
    );
}

export default Footer;