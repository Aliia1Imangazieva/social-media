import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from '../post/image/avatar.png';
import "./following.style.scss";

const Following = () => {
    const { token, username } = useSelector((state) => state.user);
    const [followings, setFollowings] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchFollowings = async () => {
            try {
                console.log(`Anforderung zum follgen: ${username}`);
                const response = await fetch(`http://49.13.31.246:9191/followings/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });

                if (!response.ok) throw new Error(`Fehler: ${response.status}`);

                let data = await response.json();
                console.log("Antwort von Server (followings):", data);

                if (data && Array.isArray(data.following)) {
                    console.log("Gefundene Benutzer, die ich follge:", data.following);
                    setFollowings(data.following);
                } else {
                    console.warn("⚠️ Der Server hat falsche Daten zurückgegeben oder es gibt keine Followings .");
                    setFollowings([]);
                }
            } catch (err) {
                console.error("Fehler beim Abrufen von Followers:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowings();
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

    if (loading) return <div className="loader"> Followers werden aufgeladen...</div>;
    if (error) return <div className="error-box">❌ {error}</div>;

    return (
        <div className="following-list-container">
            <h2>📌 Follge ich</h2>
            <div className="following-list">
                {followings.length > 0 ? (
                    followings.map((following) => (
                        <div key={following._id} className="following-item" onClick={() => handleUserClick(following)}>
                            <img src={following.avatar || avatar} alt="avatar" className="following-avatar" />
                            <div className="follower-info">
                                <p>@{following.username}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-followings">Sie haben noch keinen gefollgt!</p>
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

export default Following;