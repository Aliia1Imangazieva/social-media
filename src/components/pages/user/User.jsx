import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from '../../pages/post/image/avatar.png';
import "./user.style.scss";

const User = () => {
    const { token, username } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [following, setFollowing] = useState(new Set()); // Список подписок
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError("❌ Fehler, Token ist nicht gefunden!");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [usersRes, followingRes] = await Promise.all([
                    fetch("http://49.13.31.246:9191/users", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": token,
                        },
                    }),
                    fetch(`http://49.13.31.246:9191/followings/${username}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "x-access-token": token,
                        },
                    }),
                ]);

                if (!usersRes.ok) throw new Error(`Fehler beim Benutzer aufladen: ${usersRes.status}`);
                if (!followingRes.ok) throw new Error("Fehler beim Followers aufladen");

                const usersData = await usersRes.json();
                const followingData = await followingRes.json();

                setUsers(usersData.filter(user => user.username !== username));

                if (followingData && Array.isArray(followingData.following)) {
                    setFollowing(new Set(followingData.following.map(u => u.username)));
                } else {
                    setFollowing(new Set()); 
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, username]);
    const toggleFollow = async (userToFollow) => {
        const isFollowing = following.has(userToFollow);
        const action = isFollowing ? "unfollow" : "follow";

        try {
            const response = await fetch(`http://49.13.31.246:9191/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
                body: JSON.stringify({ username: userToFollow }),
            });

            if (!response.ok) throw new Error(`Fehler beim ${isFollowing ? "unfollow" : "follow"}`);

            setFollowing((prev) => {
                const updatedSet = new Set(prev);
                isFollowing ? updatedSet.delete(userToFollow) : updatedSet.add(userToFollow);
                return updatedSet;
            });
        } catch (err) {
            console.error(`❌ Fehler beim ${isFollowing ? "unfollow" : "follow"}:`, err.message);
        }
    };

    // ✅ UI обработка ошибок и загрузки
    if (loading) return <div className="loading">Wird geladen...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    return (
        <div className="user-list-container">
            <h2 className="user-title">Alle Benutzer</h2>
            <div className="user-list">
                {users.map((userItem) => (
                    <div key={userItem._id} className="user-item">
                        <div className="user-info" onClick={() => navigate(`/userprofile/${userItem.username}`)}>
                            <img src={userItem.avatar || avatar} alt="Avatar" className="user-avatar" />
                            <h4>{userItem.fullName || "Kein Name"}</h4>
                            <p>@{userItem.username}</p>
                        </div>

                        <button
                            className={`follow-btn ${following.has(userItem.username) ? "following" : ""}`}
                            onClick={() => toggleFollow(userItem.username)}
                        >
                            {following.has(userItem.username) ? "Unfollgen" : "Follgen"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default User;