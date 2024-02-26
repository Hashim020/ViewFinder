import React from 'react';
import SideBar from '../../components/userComponents/SideBar';
const HomePage = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
        <SideBar />
      </div>
      <div  className=" flex-1 h-full bg-white">
      <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="block lg:hidden h-8 w-auto" src="/logo.svg" alt="Logo" />
                <img className="hidden lg:block h-8 w-auto" src="/logo.svg" alt="Logo" />
              </div>
            </div>
            <div className="flex items-center">
              {/* User Profile Picture */}
              <img className="h-8 w-8 rounded-full" src="/profile.jpg" alt="Profile" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-8">
          {/* Posts Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Post */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <img src="/post1.jpg" alt="Post" className="w-full rounded-lg mb-2" />
              <div className="flex items-center">
                <img className="h-8 w-8 rounded-full" src="/profile1.jpg" alt="Profile" />
                <p className="ml-2">Username</p>
              </div>
            </div>
            {/* More posts */}
          </section>
        </div>
      </main>
    </div>
      </div>
    </div>
  );
};

export default HomePage;
