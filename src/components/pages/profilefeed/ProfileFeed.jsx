import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {logoutUser, setUser} from "../../../features/features";
import {useNavigate} from "react-router-dom";
import "./profilefeed.style.scss";

const Profile = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {token} = useSelector((state) => state.user);
	const [profileData, setProfileData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		if (!token) {
			console.warn("Kein Token zur Autorisierung!");
			return;
		}
		
		const fetchProfile = async () => {
			setLoading(true);
			try {
				const response = await fetch("http://49.13.31.246:9191/me", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Fehler: ${response.status}`);
				const data = await response.json();
				setProfileData(data);
				dispatch(setUser({
					user: data._id,
					username: data.username,
				}));
			} catch (err) {
				setError(err.message);
				navigate("/");
			} finally {
				setLoading(false);
			}
		};
		
		fetchProfile();
	}, [token]);
	
	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/");
	};
	
	if (!token) return <div className="error-msg">Benutzer ist nicht autorisiert</div>;
	if (loading) return <div className="loading">Wird geladen...</div>;
	if (error) return <div className="error-msg">Fehler: {error}</div>;
	if (!profileData) return <div className="error-msg">Keine Daten des Benutzers</div>;
	
	return (
		<div className="profile-card">
			<div className="profile-header">
				<img src={profileData.avatar} alt="Avatar" className="profile-avatar"/>
				<h2>{profileData.fullName}</h2>
				<p className="profile-bio">{profileData.bio}</p>
			</div>
			<div className="profile-stats">
				<div><strong>{profileData.posts_count}</strong> Posten</div>
				<div onClick={() => navigate("/followers")}><strong>{profileData.followers}</strong> follgen mir</div>
				<div onClick={() => navigate("/following")}><strong>{profileData.following}</strong> follge ich</div>
			</div>
			<div className="profile-menu">
				<button onClick={() => navigate("/profile")}> Profil</button>
				<button onClick={() => navigate("/redactprofile")}> Einstellungen</button>
			</div>
			{/*<button className="profile-view-btn" onClick={() => navigate("/profile")}>View Profile</button>*/}
			<button className="logout-btn" onClick={handleLogout}>Abmelden</button>
			<p className="profile-footer">© {new Date().getFullYear()}. All rights reserved</p>
		</div>
	);
};

export default Profile;