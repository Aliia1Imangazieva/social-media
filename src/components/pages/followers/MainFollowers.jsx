import React from 'react';
import Profile from '../profilefeed/ProfileFeed';
import Followers from './Followers';
import "./main.style.scss";
import Footer from '../../elements/footer/Footer';

const MainFollowers = () => {
    return (
        <div className='main-page'>
            <div>
            <aside className='left'>
            <Profile />
            </aside>
            <aside className='right'>
            <Followers />
            </aside>
            </div>
            <div className='footer'>
            <Footer />
            </div>
            
        </div>
    );
};

export default MainFollowers;