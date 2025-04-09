import React from 'react';
import Following from './Following';
import Profile from '../profilefeed/ProfileFeed';
import "./style.scss";
import Footer from '../../elements/footer/Footer';

const Followings = () => {
    return (
        <div className='main-page'>

            <div>
            <aside className='left'>
            <Profile />
            </aside>
            <aside className='right'>
             <Following />
            </aside>
            </div>
            <div className='footer'>
            <Footer />
            </div>
               
        </div>
    );
};

export default Followings;