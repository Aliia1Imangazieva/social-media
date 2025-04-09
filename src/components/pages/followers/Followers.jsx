import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./followers.style.scss";
import avatar from '../post/image/avatar.png';

const Followers = () => {
    const { token, username } = useSelector((state) => state.user);
    const [followers, setFollowers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await fetch(`http://49.13.31.246:9191/followers/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error(`Fehler: ${response.status}`);

                let data = await response.json();
                console.log("Ответ от сервера (followers):", data);

                if (data && Array.isArray(data.followers)) {
                    setFollowers(data.followers);
                } else {
                    setFollowers([]); // wenn keine followers gibt
                }
            } catch (err) {
                console.error("Fehler beim Foolowers aufladen:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, [token, username]);

	const fetchUserDetails = async (user) => {
        try {
            const response = await fetch(`http://49.13.31.246:9191/user/${user.username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });
            if (!response.ok) throw new Error("Fehler beim Profil aufladen");

            const data = await response.json();
            setSelectedUser(data);
        } catch (error) {
            console.error("Fehler beim Profil aufladen:", error);
        }
    };
	const handleUserClick = async (user) => {
		navigate(`/userprofile/${user.username}`);
		await fetchUserDetails(user);
};
    if (loading) return <div className="followers-loading">Wird geladen...</div>;
    if (error) return <div className="followers-error">{error}</div>;

    return (
        <div className="followers-container">
            <h2>📌 Follgen mir</h2>
            <div className="followers-list">
                {followers.length > 0 ? (
                    followers.map((follower) => (
                        <div 
                            key={follower._id} 
                            className="follower-card" 
                            onClick={() => handleUserClick(follower)} 
                        >
                            <img src={follower.avatar || avatar} alt="avatar" className="follower-avatar" />
                            <div className="follower-info">
                                <p>@{follower.username}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="followers-empty">❌ Sie haben noch kein Follower</p>
                )}
            </div>
			{selectedUser && (
                <div className="user-card">
                    <img src={selectedUser.avatar || "https://via.placeholder.com/100"} alt="Avatar" />
                    <h3>{selectedUser.fullName} (@{selectedUser.username})</h3>
                    <p><strong>Alter:</strong> {selectedUser.age}</p>
                    <p><strong>Über mich:</strong> {selectedUser.bio}</p>
                    <p><strong>Konto:</strong> {selectedUser.balance} 💰</p>
                    <p><strong>Beiträge:</strong> {selectedUser.posts_count}</p>
                    <p><strong>Follgen mir:</strong> {selectedUser.followers}</p>
                    <p><strong>Follge ich:</strong> {selectedUser.following}</p>
                    <button onClick={() => setSelectedUser(null)}>❌ Schließen</button>
                </div>
            )}
        </div>
    );
};

export default Followers;