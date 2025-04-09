import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar from '../post/image/avatar.png';
import './post.style.scss';

const Post = () => {
	const { token, user } = useSelector((state) => state.user);
	const [feedData, setFeedData] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [fullscreenImage, setFullscreenImage] = useState(null);
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!token) return;
		
		const fetchFeed = async () => {
			setLoading(true);
			try {
				const response = await fetch("http://49.13.31.246:9191/posts", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-access-token": token,
					},
				});
				if (!response.ok) throw new Error(`Fehler: ${response.status}`);
				const data = await response.json();
				
				setFeedData(data.reverse());
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchFeed();
	}, [token]);
	
	const handleLike = async (postId) => {
		try {
			const response = await fetch("http://49.13.31.246:9191/like", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
				body: JSON.stringify({ post_id: postId }),
			});
			if (!response.ok) throw new Error("Fehler beim liken");
			
			setFeedData((prevFeedData) =>
				prevFeedData.map((post) =>
					post._id === postId
						? { ...post, likes: [...post.likes, { fromUser: user }] }
						: post
				)
			);
		} catch (error) {
			console.error("Fehler:", error);
		}
	};
	
	const deleteLike = async (postId) => {
		try {
			const response = await fetch(`http://49.13.31.246:9191/like/${postId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-access-token": token,
				},
			});
			if (!response.ok) throw new Error("Fehler beim like löschen");
			
			setFeedData((prevFeedData) =>
				prevFeedData.map((post) =>
					post._id === postId
						? { ...post, likes: post.likes.filter((like) => like.fromUser !== user) }
						: post
				)
			);
		} catch (error) {
			console.error("Fehler beim like löschen:", error);
		}
	};
	
	const getYouTubeEmbedUrl = (url) => {
		const regExp = /^.*(youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
	};
	
	return (
			<div className="feed-container">
				<div className="feed-posts">
					{feedData.map((post) => (
						<div key={post._id} className="feed-post">
							<div className="post-header">
								<div className="author-info" onClick={() => navigate(`/userprofile/${post.user[0].username}`)}>
									<img src={post.user[0].avatar || avatar} alt="Avatar des Authors" className="author-avatar" />
									<span className="author-name">{post.user[0].fullName || post.user[0].username}</span>
								</div>
							</div>
							
							{post.title && <h3 className="post-title">{post.title}</h3>}
							{post.description && <p style={{whiteSpace: "pre-wrap"}} className="post-description">{post.description}</p>}
							{post.image && (
								<img
									src={post.image}
									alt="Photo der Publikation"
									className="post-media"
									onClick={() => setFullscreenImage(post.image)}
								/>
							)}
							{post.video && getYouTubeEmbedUrl(post.video) ? (
								<div className="post-video-container">
									<iframe
										className="post-video"
										src={getYouTubeEmbedUrl(post.video)}
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										title="YouTube video"
									></iframe>
								</div>
							) : post.video ? (
								<a href={post.video} target="_blank" rel="noopener noreferrer">
									Video anschauen
								</a>
							) : null}
							<div className="post-actions">
								<button
									className="like-button"
									onClick={() =>
										post.likes.some((like) => like.fromUser === user)
											? deleteLike(post._id)
											: handleLike(post._id)
									}
								>
									{post.likes.some((like) => like.fromUser === user) ? "❤️" : "❤️"} {post.likes.length}
								</button>
					
							</div>
						</div>
					))}
				</div>
			{fullscreenImage && (
				<div className="fullscreen-image" onClick={() => setFullscreenImage(null)}>
					<img src={fullscreenImage} alt="Bild vergrößern" />
				</div>
			
			)}
			</div>
			
	);
};

export default Post;