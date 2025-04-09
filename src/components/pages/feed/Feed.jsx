import React from 'react';
import ProfileFeed from "../profilefeed/ProfileFeed";
import Post from "../../pages/post/Post";
import User from '../user/User';
import './feed.style.scss';
import Footer from '../../elements/footer/Footer';
const Feed = () => {
	return (
			<div className='box-content'>
			<div className="dashboard-layout">
				<aside className='sidebar-left'>
				<ProfileFeed/>
				</aside>
				<main className='main-content'>
				<Post/>
				</main>
				<aside className="sidebar-right">
				<User />
				</aside>
			</div>
			<div className='footer'>
			<Footer />
			</div>
			</div>
			
			);
};

export default Feed;