import React, { useEffect, useState } from 'react';
import AdminSideBar from '../../components/adminComponents/AdminSideBar';
import { useGetUserDataMutation } from '../../Slices/adminApiSlice';
import { useBlockUnblockUserMutation } from '../../Slices/adminApiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@chakra-ui/react';
const AdminUserManagement = () => {
    const [refetch, setRefetch] = useState(false);
    let [fetchedData, setfetchedData] = useState([]);

    const navigate = useNavigate()
    const { adminInfo } = useSelector((state) => state.adminAuth);

    useEffect(() => {
        if (adminInfo) {
            navigate('/admin/user-management');
        } else {
            navigate('/admin')
        }
    }, [adminInfo, navigate]);



    const [userDataFromApi, { isLoading }] = useGetUserDataMutation();
    useEffect(() => {

        try {

            const fetchData = async () => {
                const responseFromApiCall = await userDataFromApi();
                const usersArray = responseFromApiCall.data;
                console.log(usersArray);
                setfetchedData(usersArray)
            };
            fetchData();
        } catch (error) {
            toast.error(error);
            console.error("Error fetching users:", error);

        }

    }, [refetch]);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 7;
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfUsersDataRecord = indexOfLastRecord - recordsPerPage;
    const filteredUsers = fetchedData.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentRecords = filteredUsers.slice(indexOfUsersDataRecord, indexOfLastRecord);

    const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [blockUnblockUser, { isLoading1, isError, isSuccess, error }] = useBlockUnblockUserMutation();

    const handleBlockUser = async (userId) => {
        try {
            const data = { userId };
            const response = await blockUnblockUser(data);
            setfetchedData(prevData => {
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
                            {currentRecords.map(user => (
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
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md mr-2`}
                                >
                                    Prev
                                </button>
                            </li>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handlePageChange(index + 1)}
                                        disabled={currentPage === index + 1}
                                        className={`px-3 py-1 ${currentPage === index + 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md mr-2`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
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
