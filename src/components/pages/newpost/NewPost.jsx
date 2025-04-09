import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import './newpost.style.scss';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { IconButton } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Footer from "../../elements/footer/Footer";

const NewPost = () => {
	const { token } = useSelector((state) => state.user);
	const [postData, setPostData] = useState({
		title: "",
		description: "",
		image: "",
		video: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showPhotoInput, setShowPhotoInput] = useState(false);
	const [showVideoInput, setShowVideoInput] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setPostData({
			...postData,
			[e.target.name]: e.target.value,
		});
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("http://49.13.31.246:9191/post", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify(postData),
			});
			if (!response.ok) throw new Error(`Fehler: ${response.status}`);
			setPostData({ title: "", description: "", image: "", video: "" });
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
		window.location.reload();
	};
	
	return (
		<div className="new-post-container">
			<button className="one-user-back-btn" onClick={() => navigate(-1)}>⬅ Zurück</button>
			<div className="post-box">
				<div className="post-header">
					<input
						type="text"
						name="title"
						placeholder="Titel..."
						value={postData.title}
						onChange={handleChange}
						className="post-input title-input"
					/>
				</div>

				<div className="post-description">
					<textarea
						name="description"
						placeholder="Beschreibung..."
						value={postData.description}
						onChange={handleChange}
						className="post-input desc-input"
					></textarea>
				</div>
				
				<div className="post-actions">
					<button className="post-action photo" onClick={() => setShowPhotoInput(!showPhotoInput)}>
						<IconButton>
						<AddPhotoAlternateIcon sx={{ color: "#1E90FF" }} />
						</IconButton>
						Bild
					</button>
					<button className="post-action video" onClick={() => setShowVideoInput(!showVideoInput)}>
					<IconButton>
					<VideoCameraBackIcon sx={{ color:  "#1E90FF" }} />
					</IconButton>
					 Video
					</button>
				</div>
				
				{showPhotoInput && (
					<div className="extra-input">
						<input
							type="text"
							name="image"
							placeholder="Foto URL"
							value={postData.image}
							onChange={handleChange}
						/>
					</div>
				)}
				
				{showVideoInput && (
					<div className="extra-input">
						<input
							type="text"
							name="video"
							placeholder="Video URL"
							value={postData.video}
							onChange={handleChange}
						/>
					</div>
				)}
				
				<button className="post-submit" onClick={handleSubmit} disabled={loading}>
					{loading ? "Laden..." : "Posten"}
				</button>
				
				{error && <div className="error-msg">: {error}</div>}
			</div>
			<div className="footer">
            <Footer />
			</div>
		</div>
		
	);
};

export default NewPost;