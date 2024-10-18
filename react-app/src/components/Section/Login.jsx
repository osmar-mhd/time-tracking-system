import React from 'react';
import '../../assets/css/login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: '', 
            password: '', 
            loading: false 
        };
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange1(event) {
        this.setState({ username: event.target.value });
    }

    handleChange2(event) {
        this.setState({ password: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();

        const { username, password } = this.state;

        if (!username || !password) {
            alert('Por favor, completa ambos campos.');
            return;
        }

        this.setState({ loading: true });

        const url = `http://localhost:8084/01proyectoFinal3CM15-emo/Login?username=${username}&password=${password}`;

        try {
            const response = await fetch(url);
            const data = await response.text();

            if (response.ok) {
                window.location.href = data;
            } else {
                alert('Error al iniciar sesión: ' + data);
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
            alert('Error de conexión. Inténtalo de nuevo más tarde.');
        } finally {
            this.setState({ loading: false });
        }
    }

    render() {
        return (
            <React.Fragment>
                <h1>Iniciar Sesión</h1>
                <form onSubmit={this.handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Usuario" 
                        value={this.state.username} 
                        onChange={this.handleChange1} 
                    /><br />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={this.state.password} 
                        onChange={this.handleChange2} 
                    /><br /><br />
                    <input 
                        type="submit" 
                        value={this.state.loading ? 'Cargando...' : 'Iniciar Sesión'} 
                        disabled={this.state.loading} 
                    />
                </form>
            </React.Fragment>
        );
    }
}

export default Login;
