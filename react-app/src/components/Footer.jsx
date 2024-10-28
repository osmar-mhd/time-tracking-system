import React from 'react';
import '../assets/css/footer.css';

function Footer() {
    return (
        <footer>
            <h2>Footer</h2>
            <ul className="connect-invisible"> 
                <li>
                    <a 
                        href="https://www.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="Visit my LinkedIn profile">
                        <span>PAG 1</span>
                    </a>
                </li>
                <li>
                    <a 
                        href="https://www.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title="Visit my GitHub profile">
                        <span>PAG 2</span>
                    </a>
                </li>
            </ul>
        </footer>
    );
}

export default Footer;