import React, { useState } from 'react';
import { Button } from '@mui/material';
import './signUp.style.scss';
import { useNavigate } from 'react-router-dom';
import applogo from "../signin/asset/applogo.png";

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirm_Password] = useState('');

    const handleSignIn = () => {
        navigate('/signin');
    };

    const handleSignUp = async () => {
        if (password !== confirm_password) {
            alert("Die Passwörter stimmen nicht überein! (Пароли не совпадают!)");
            return;
        }
        try {
            const response = await fetch(
                "http://49.13.31.246:9191/signup", 
                { method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    confirm_password,
                }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(`Server returned an unexpected format (status ${response.status})`);
            }

            const result = await response.json();
            if (response.ok) {
                console.log("Registrierung ist erfolgreich!",result);
                localStorage.setItem("token", result.token);
                alert("Registrierung erfolgreich! Jetzt anmelden.");
                navigate('/signin');
                } else {
                    console.error('Registrierungsfehler:', result);
                }
                }catch(error) {
                    console.error('Anforderungsfehler:', error.message);
                alert( "Fehler bei der Serververbindung.");
                }
    };

    return (
        <div className="register-container">
            <div className='app-logo'>
            <img src={applogo} alt="app-logo" className='nav-app-icon' />
            </div>
            <h2 className="register-title">Registrierung</h2>


            <input
                className="register-input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="register-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="register-input"
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className="register-input"
                type="confirm_password"
                placeholder="Passwort wiederholen"
                value={confirm_password}
                onChange={(e) => setConfirm_Password(e.target.value)}
            />

            <Button
                sx={{ marginTop: 2, marginBottom: 2, width: '80%', marginLeft: '4%' }}
                variant="contained"
                onClick={handleSignUp}
            >
                Registrieren
            </Button>
            <p className="register-footer">
                Haben Sie ein Konto?{' '}
                <button className="incitingText" onClick={handleSignIn}>
                    Anmelden
                </button>
            </p>
            <p className="signup-footer">© {new Date().getFullYear()}. All rights reserved</p>
        </div>
    );
};

export default SignUp;