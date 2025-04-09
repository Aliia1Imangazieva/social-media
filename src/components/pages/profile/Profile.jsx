import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../features/features";
import { useNavigate } from "react-router-dom";
import "./profile.style.scss";
import photo from "./asset/view.webp";
import Footer from "../../elements/footer/Footer";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth?.user?.token) || localStorage.getItem("token");
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        if (!token) {
            console.warn("Kein Token zur Autorisierung");
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
                dispatch(setUser({ user: data._id }));

                // После получения профиля загружаем посты пользователя
                fetchUserPosts(data._id);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, dispatch]);

    const fetchUserPosts = async (userId) => {
        if (!userId) return;
        try {
            const response = await fetch(`http://49.13.31.246:9191/posts?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token,
                },
            });

            if (!response.ok) throw new Error(`Fehler beim Beiträge aufladen: ${response.status}`);
            
            const data = await response.json();
            setUserPosts(data.reverse());
        } catch (err) {
            console.error("❌ Fehler beim Beiträge herunterladen:", err.message);
        }
    };

    if (loading) return <p>⏳ Wird geladen...</p>;
    if (error) return <p>❌ Fehler: {error}</p>;

    return (
        <div className="home">
            <div className="profile-card1">
                <div className="profile-cover">
                    <img src={photo} alt="Cover" className="profile-cover-img" />
                </div>
                <div className="profile-info">
                    <img
                        src={profileData?.avatar || "default-avatar.png"}
                        alt="avatar"
                        className="profile-avatar1"
                    />

                    <div className="profile-details">
                        {profileData && (
                            <div className="profile-stats">
                                <div><strong>{profileData?.posts_count || 0}</strong> Posten</div>
                                <div onClick={() => navigate("/followers")}><strong>{profileData?.followers || 0}</strong> folgen mir</div>
                                <div onClick={() => navigate("/following")}><strong>{profileData?.following || 0}</strong> folge ich</div>
                            </div>
                        )}
                        <p>Benutzername: @{profileData?.username || "Unbekannt"}</p>
                        <p>Name: {profileData?.fullName || "Nicht angegeben"}</p>
                        <p>Alter: {profileData?.age || "Nicht angegeben"}</p>
                        <p>Über mich: {profileData?.bio || "Keine Beschreibung"}</p>
                    </div>
                    <button className="edit-profile-btn" onClick={() => navigate("/redactprofile")}>
                        Profil bearbeiten
                    </button>
                </div>
            </div>
            
            <div className="one-user-posts">
                <h3>📌 Beiträge</h3>
                {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <div key={post._id} className="feed-post">
                            <div className="post-header">
                                <img
                                    src={profileData?.avatar || "/default-avatar.png"}
                                    alt="avatar"
                                    className="profile-avatar2"
                                />
                                <span className="author-name">{profileData?.fullName || profileData?.username || "Unbekannter Nutzer"}</span>
                            </div>
                            {post.title && <h3 className="post-title">{post.title}</h3>}
                            {post.description && <p className="post-description">{post.description}</p>}
                            {post.image && <img src={post.image} alt="Foto des Beitrags" className="post-media" />}
                            {post.video && (
                                <iframe
                                    title="videopost"
                                    src={post.video}
                                    className="post-video"
                                ></iframe>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-posts">❌ Sie haben noch keine Beiträge! </p>
                )}
            </div>

            <div className="footer">
                <Footer />
            </div>
        </div>
    );
};

export default Profile;