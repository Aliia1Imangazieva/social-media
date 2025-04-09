import { IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from '../../../features/features';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import photo from "../nav/asset/feed.svg";
import './nav.style.scss';
import SupportIcon from '@mui/icons-material/Support';
import SubjectIcon from '@mui/icons-material/Subject';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
const Nav = () => {

    const [showPopover, setShowPopover] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");


    const user = useSelector((state) => state.auth?.user) || {};
    const token = user?.token || localStorage.getItem("token");

    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    const togglePopover = () => {
        setShowPopover(!showPopover);
    };

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
                        "x-access-token": token
                    }
                });
                if (!response.ok) throw new Error(`Fehler: ${response.status}`);

                const data = await response.json();
                setProfileData(data);
                dispatch(setUser({ user: data }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/signin");
    };

    if (!token) return <div className="error-msg">Benutzer ist nicht autorisiert</div>;
    if (loading) return <div className="loading">Wird geladen...</div>;
    if (error) return <div className="error-msg">Fehler: {error}</div>;
    if (!profileData) return <div className="error-msg">Es gibt keine Daten</div>;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(""); // macht alles weg nach der Eingabe
        }
    };
    return (
        <nav className='nav-header'>
            <div className='feed-search'>
                <img src={photo} alt="Logo" id="Logo" className='nav-feed-icon' onClick={() => navigate("/feed")} />
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder=" Suche..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </form>
            </div>

            <div className='icons'>
                <IconButton>
                    <EditIcon sx={{ color: "#0077ff" }} onClick={() => navigate("/redactprofile")} />
                </IconButton>
                <IconButton>
                    <AddPhotoAlternateIcon sx={{ color: "#0077ff" }} onClick={() => navigate("/newpost")} />
                </IconButton>
                <IconButton onClick={togglePopover}>
                    <Avatar src={profileData?.avatar || "/default-avatar.png"} />
                </IconButton>

                {showPopover && (
                    <div className='popover'>
                        <div className='profile'>
                            <IconButton className='avatar-pic'>
                                <Avatar src={profileData.avatar || "/default-avatar.png"} />
                            </IconButton>
                            <p>@<strong>{profileData.username || "Benutzer"}</strong></p>
                            <p>{profileData.fullName || "nicht eingegeben"}</p>
                        </div>

                        <Link to="/redactprofile" className='setting-link'>
                            <SettingsIcon></SettingsIcon>
                            Einstellungen & Datenschutz
                        </Link>
                        <Link to="/support" className='support-link'>
                            <SupportIcon></SupportIcon>
                            Unterstützung
                        </Link>
                        <Link to="/documentation" className='doc-link'>
                            <SubjectIcon></SubjectIcon>
                            Dokumentation
                        </Link>

                        <Link to="/profile" className="popover-link">Profil ansehen</Link>

                        <button className="logout-button" onClick={handleLogout}>
                            <LogoutIcon className="logout-icon" /> Abmelden
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Nav;
