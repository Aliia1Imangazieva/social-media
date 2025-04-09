import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import avatar from "../post/image/avatar.png";
import "./search.style.scss";
import Footer from "../../elements/footer/Footer";
const Search = () => {
	const [results, setResults] = useState([]); 
	const [following, setFollowing] = useState(new Set()); 
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	
	const { token, username } = useSelector((state) => state.user);
	const location = useLocation();
	const navigate = useNavigate();
	
	const params = new URLSearchParams(location.search);
	const query = params.get("query")?.toLowerCase() || ""; //  register ignorieren
	
	useEffect(() => {
		if (!token) return;
		
		const fetchFollowing = async () => {
			try {
				const response = await axios.get(`http://49.13.31.246:9191/followings/${username}`, {
					headers: { "x-access-token": token },
				});
				const followingSet = new Set(response.data.following.map((u) => u.username));
				setFollowing(followingSet);
			} catch (err) {
				console.error("Fehler beim Folloings aufladen:", err);
			}
		};
		
		fetchFollowing();
	}, [token, username]);
	
	useEffect(() => {
		if (!query) {
			setResults([]);
			return;
		}
		
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`http://49.13.31.246:9191/users`, {
					headers: { "x-access-token": token },
				});
				
				//  `fullName`und `username` filtern 
				const filteredUsers = response.data.filter((user) =>
					user.fullName.toLowerCase().includes(query) || user.username.toLowerCase().includes(query)
				);
				
				setResults(filteredUsers);
			} catch (err) {
				console.error("Fehler beim Suchen:", err);
				setResults([]);
			} finally {
				setLoading(false);
			}
		};
		
		fetchUsers();
	}, [query, token]);
	
	
	const handleUserClick = (user) => {
		navigate(`/userprofile/${user.username}`);
	};
	
	return (
		<div className="container">
			<div className="first-side">
			<button className="one-user-back-btn" onClick={() => navigate(-1)}>⬅ Zurück</button>
			<div className="search-container">
				<h2> Sucherergebnisse : {query}</h2>
				{loading && <p>Wird geladen...</p>}
				{error && <p className="error-msg">{error}</p>}
				{!loading && results.length === 0 && <p>⚠️ Nichts gefunden</p>}
				
				<ul className="search-results">
					{results.map((user) => (
						<li key={user._id} onClick={() => handleUserClick(user)}>
							<img src={user.avatar || avatar} alt="Avatar" />
							{user.fullName} (@{user.username})
						</li>
					))}
				</ul>
				
			</div>
			</div>
			<div className="footer">
				<Footer />
			</div>
		</div>
	);
};

export default Search;