import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ChangePassword from "../../components/userComponents/ChangePassword";
import SideBar from "../../components/userComponents/SideBar";
import { IoSettingsOutline } from "react-icons/io5";


const Settings = () => {
    const location = useLocation();
    const isChangePassword = location.pathname.endsWith("/change-password");

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'white', color: 'black' }}>
            <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
                <SideBar />
            </div>

            <div className='ml-8 flex-grow'>
                <div className="flex">
                    <div className="-ml-[26px]  w-[380px] h-screen border-r flex flex-col bg-white">
                    <IoSettingsOutline className="text-3xl absolute mt-[15px] ml-1" />
                        <h1 className="text-2xl pl-10 text-black font-bold p-3">Settings</h1>
                        <div className="flex mt-3 flex-col w-full">
                            <Link
                                to="/settings/change-password"
                                className="mb-2 p-3 text-left text-black text-lg hover:bg-zinc-200">
                                Change Password
                            </Link>

                        </div>
                    </div>
                    <div className="flex-grow bg-white">
                        {isChangePassword && <ChangePassword />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
