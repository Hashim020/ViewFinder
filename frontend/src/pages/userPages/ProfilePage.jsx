import React from 'react';

const ProfilePage = () => {
  return (
    <div className="profile">
      <div className="profile-header">
        <img
          src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fsimple.wikipedia.org%2Fwiki%2FXabi_Alonso&psig=AOvVaw2GtfZZ2OgmoQzo953ZXecq&ust=1708071844718000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPCki9D1rIQDFQAAAAAdAAAAABAE"
          alt="Profile Picture"
          className="profile-picture"
        />
        <h1 className="username">Your Username</h1>
        <p className="bio">Your Bio</p>
      </div>
      <div className="profile-content">
        {/* Add more components for user content like posts, followers, following, etc. */}
      </div>
    </div>
  );
};

export default ProfilePage;
