import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSideBar from '../../components/adminComponents/AdminSideBar';
import { useBlockUnblockUserMutation } from '../../Slices/adminApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminUserManagement = () => {
    const [fetchedData, setFetchedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const recordsPerPage = 13;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [blockUnblockUser] = useBlockUnblockUserMutation();
    const navigate = useNavigate();
    const { adminInfo } = useSelector((state) => state.adminAuth);

    useEffect(() => {
        if (adminInfo) {
            navigate('/admin/user-management');
        } else {
            navigate('/admin')
        }
    }, [adminInfo, navigate]);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, selectedGender, selectedStatus]);

    const fetchData = async (page) => {
        try {
            const response = await axios.get(`/api/admin/users-pagenationcall?page=${page}&perPage=${recordsPerPage}`);
            setFetchedData(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleBlockUser = async (userId) => {
        try {
            const data = { userId };
            const response = await blockUnblockUser(data);
            toast.success("Action Applied");
            setFetchedData(prevData => {
                return prevData.map(user => {
                    if (user._id === userId) {
                        return { ...user, isBlocked: !user.isBlocked };
                    }
                    return user;
                });
            });
            console.log('User block/unblock successful:', response);
        } catch (err) {
            console.error('Error blocking/unblocking user:', err);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    
        if (!fetchedData.some(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))) {
            toast.info("No users found");
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    

    return (
        <div className="flex h-screen">
            <div className="flex-none w-64 h-full bg-gray-200">
                <AdminSideBar />
            </div>
            <div className="flex-1 px-3 py-15 bg-white">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="relative border-spacing-2 overflow-x-auto shadow-md rounded-lg">
                    <div className="flex justify-start  mt-4">
                        <div className="mr-4">
                            <select
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                                className="px-2 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-2 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead>
                            <tr>
                                <th className="py-3 px-3">Profile Image</th>
                                <th className="py-3 px-3">Username</th>
                                <th className="py-3 px-3">Name</th>
                                <th className="py-3 px-3">Email</th>
                                <th className="py-3 px-3">Gender</th>
                                <th className="py-3 px-3">Birthdate</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchedData
                                .filter(user => (
                                    (!searchTerm || user.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
                                    (!selectedGender || user.gender === selectedGender) &&
                                    (!selectedStatus || (user.isBlocked ? "Blocked" : "Active") === selectedStatus)
                                ))
                                .map(user => (
                                    <tr key={user._id}>
                                        <td className="py-3 px-8">{user.profileImageName && <img src={`${user.profileImageName}`} alt={user.name} className="w-10 h-10 rounded-full" />}</td>
                                        <td className="py-3 px-3">{user.username}</td>
                                        <td className="py-3 px-3">{user.name}</td>
                                        <td className="py-3 px-3">{user.email}</td>
                                        <td className="py-3 px-3">{user.gender}</td>
                                        <td className="py-3 px-3">{user.birthdate && new Date(user.birthdate).toLocaleDateString()}</td>
                                        <td className="py-3 px-3">{user.isBlocked ? "Blocked" : "Active"}</td>
                                        <td className="py-3 px-3"><button onClick={() => handleBlockUser(user._id)} className="px-3 py-1 bg-blue-500 text-white rounded-md">{user.isBlocked ? "Unblock" : "Block"}</button></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <nav className="mt-4 pb-1 pl-2 flex justify-end">
                        <ul className="flex">
                            <li>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={`px-3 py-1 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md mr-2`}
                                >
                                    Prev
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i + 1}>
                                    <button
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 py-1 ${currentPage === i + 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md mr-2`}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={`px-3 py-1 ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default AdminUserManagement;
