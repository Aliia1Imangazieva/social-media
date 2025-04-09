import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../../features/features";
import "./SignIn.style.scss";
import applogo from "../signin/asset/applogo.png";
function SignIn() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const onSubmit = async (data) => {
		try {
			const response = await fetch("http://49.13.31.246:9191/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			
			const result = await response.json();
			if (response.ok) {
				console.log(" Zugang ist erfolgreich!:", result);
				localStorage.setItem("token", result.token);
				dispatch(setToken({ token: result.token }));
				navigate("/feed");
			} else {
				console.error(" Anmeldefehler:", result);
				alert(result.message || "Autorisierungsfehler!");
			}
		} catch (error) {
			console.error("⚠️ Anforderungsfehler:", error);
			alert("Serververbindungsfehler!");
		}
	};
	
	return (
		<div className="signin-page">
			<form className="signin-form" onSubmit={handleSubmit(onSubmit)}>
			<div className='app-logo'>
            <img src={applogo} alt="app-logo" className='nav-app-icon' />
            </div>
				<label className="signin-label">
					<span className="signin-label-text">Login</span>
					<input
						className="signin"
						{...register("username", { required: "Geben Sie Benutzname", minLength: 4 })}
					/>
					{errors.username && <p className="signin-error">{errors.username.message}</p>}
				</label>
				<label className="signin-label">
					<span className="signin-label-text">Passwort</span>
					<input
						type="password"
						className="signin"
						{...register("password", { required: "Geben Sie Passwort", minLength: 4 })}
					/>
					{errors.password && <p className="signin-error">{errors.password.message}</p>}
				</label>
				<button type="submit" className="signin-button">
					Anmelden
				</button>
			</form>
			<button className="signin-switch-button" onClick={() => navigate("/signUp")}>
				<span className="no-account">Haben Sie kein Konto? </span> Registrieren
			</button>
		</div>
	);
}

export default SignIn;