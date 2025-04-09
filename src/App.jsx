import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import SignIn from './components/pages/signin/SignIn';
import SignUp from './components/pages/signup/SignUp';
import Nav from './components/elements/nav/Nav';
import Feed from './components/pages/feed/Feed';
import Search from './components/pages/search/Search';
import  Profile from './components/pages/profile/Profile';
import MainFollowers from './components/pages/followers/MainFollowers';
import Followings from './components/pages/following/Followings';
import NewPost from './components/pages/newpost/NewPost';
import RedactProfile from './components/pages/redactprofile/RedactProfile';
import Post from './components/pages/post/Post';
import User from './components/pages/user/User';
import ProfileFeed from './components/pages/profilefeed/ProfileFeed';
import UserProfile from './components/pages/userprofile/UserProfile';
import NotFoundPage from './components/pages/notfoundpage/NotFoundPage';
import Footer from './components/elements/footer/Footer';
const App = () => {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const hideNav = ["/signup", "/signin", "/", "/*" ].includes(location.pathname.toLowerCase());

  return (
    <div>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profilefeed" element={<ProfileFeed />} />
        <Route path="/redactprofile" element={<RedactProfile />} />
        <Route path="/followers" element={<MainFollowers />} />
        <Route path="/following" element={<Followings />} />
        <Route path="/post" element={<Post />} />
        <Route path="/newpost" element={<NewPost />} />
        <Route path="/user" element={<User />} />
        <Route path="/userprofile/:username" element={<UserProfile />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </div>
  );
};

export default App;