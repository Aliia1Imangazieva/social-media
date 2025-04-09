import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./redact.profile.scss";
import Footer from "../../elements/footer/Footer";

const RedactProfile = () => {
	const { token } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [postData, setPostData] = useState({
		username: "",
		avatar: "",
		age: "",
		bio: "",
		fullName: "",
		balance: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [photoInputType, setPhotoInputType] = useState("url");
	
	
	useEffect(() => {
		if (!token) {
			setError("Fehler. Kein Token gefunden");
			return;
		}
		const fetchProfileData = async () => {
			try {
				const response = await fetch("http://49.13.31.246:9191/me", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Fehler beim Laden: ${response.status}`);
				
				const data = await response.json();
				setPostData({
					username: data.username || "",
					avatar: data.avatar || "",
					age: data.age || "",
					bio: data.bio || "",
					fullName: data.fullName || "",
					balance: data.balance || "",
					email: data.email || "",
				});
			} catch (err) {
				setError(err.message);
			}
		};
		
		fetchProfileData();
	}, [token]);
	
	const handleChange = (e) => {
		setPostData({
			...postData,
			[e.target.name]: e.target.value,
		});
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!token) {
			setError("Fehler bei der Autorisierung. Kein Token gefunden");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("http://49.13.31.246:9191/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify(postData),
			});
			if (!response.ok) {
				throw new Error(`Fehler: ${response.status}`);
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
			navigate("/feed");
		}
	};
	
	const deleteProfile = async () => {
		const isConfirmed = window.confirm("Wollen Sie wirklich das Konto löschen? Das Konto wird komplett gelöscht!");
		
		if (!isConfirmed) return; 
		try {
			await fetch("http://49.13.31.246:9191/me", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			
			navigate("/signIn");
		} catch (err) {
			setError(err.message);
		}
	};
	
	return (
		<div className="conteiner">
			<div className="editProfile">
				<button className="delete-profile-btn" onClick={deleteProfile}>
					Konto deaktivieren
				</button>
				<h1>Profil redaktieren</h1>
				<form onSubmit={handleSubmit} className="edit-profile-form">
					<div className="form-group">
						<label htmlFor="username">Nickname:</label>
						<input
							type="text"
							id="username"
							name="username"
							value={postData.username}
							onChange={handleChange}
							placeholder="Geben Sie neuen Nickname"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="fullName">Vollname:</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							value={postData.fullName}
							onChange={handleChange}
							placeholder="Schreiben Sie Vollname"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="age">Alter:</label>
						<input
							type="number"
							id="age"
							name="age"
							value={postData.age}
							onChange={handleChange}
							placeholder="Geben Sie Alter"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="bio">Über mich:</label>
						<input
							type="text"
							id="bio"
							name="bio"
							value={postData.bio}
							onChange={handleChange}
							placeholder="Schreiben Sie über sich"
						/>
					</div>
					
					<div className="form-group">
						<label htmlFor="balance">Konto:</label>
						<input
							type="number"
							id="balance"
							name="balance"
							value={postData.balance}
							onChange={handleChange}
							placeholder="Zahlen Sie Geld auf das Konto ein "
						/>
					</div>
					<div className="form-group">
						<label>Avatar:</label>
						<div className="media-choice">
							<label>
								<input
									type="radio"
									name="photoInputType"
									value="upload"
									checked={photoInputType === "upload"}
									onChange={() => setPhotoInputType("upload")}
								/>
								Bild herunterladen
							</label>
							<label>
								<input
									type="radio"
									name="photoInputType"
									value="url"
									checked={photoInputType === "url"}
									onChange={() => setPhotoInputType("url")}
								/>
								URL eingeben
							</label>
						</div>
						{photoInputType === "upload" ? (
							<input type="file" accept="image/*" />
						) : (
							<input
								type="text"
								name="avatar"
								value={postData.avatar}
								onChange={handleChange}
								placeholder="Geben Sie URL des Bildes"
							/>
						)}
					</div>
					
					<button className='save_profile' type="submit" disabled={loading}>
						{loading ? "Wird gesendet..." : "Änderungen speichern"}
					</button>
				</form>
				
				<button className="back-to-profile-btn" onClick={() => navigate("/feed")}>
					 Züruck zum Übersicht
				</button>
				
				{error && <div className="error-msg">❌ Fehler: {error}</div>}
			</div>
			<div className="footer">
						<Footer />
			</div>
		</div>
	);
};

export default RedactProfile;