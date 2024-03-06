import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSideBar from '../../components/adminComponents/AdminSideBar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminPostManagement = () => {
    const [fetchedData, setFetchedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const recordsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const { adminInfo } = useSelector((state) => state.adminAuth);

    useEffect(() => {
        if (!adminInfo) {
            navigate('/admin');
        }
    }, [adminInfo, navigate]);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const fetchData = async (page) => {
        try {
            const response = await axios.get(`/api/admin/posts-pagenationcall?page=${page}&perPage=${recordsPerPage}`);
            setFetchedData(response.data.posts);
            setTotalPages(response.data.totalPages);
            console.log(response);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



const handleToggleIsListed = async (postId) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/admin/posts-unlistlist${postId}`);
        toast.success("Action Applied");
        setFetchedData(prevData => {
            return prevData.map(post => {
                if (post._id === postId) {
                    return { ...post, isListed: !post.isListed };
                }
                return post;
            });
        });
        console.log('Post toggle isListed successful:', response);
    } catch (err) {
        console.error('Error toggling isListed:', err);
    }
};

    return (
        <div className="flex h-screen">
            <div className="flex-none w-64 h-full bg-gray-200">
                <AdminSideBar />
            </div>
            <div className="flex-1 px-3 py-15 bg-white">
                <h2 className="text-xl font-semibold mb-4">Post Management</h2>
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
                                <th className="py-3 px-3">Post Date</th>
                                <th className="py-3 px-3">Post Description</th>
                                <th className="py-3 px-3">Post Image</th>
                                <th className="py-3 px-3">Likes</th>
                                <th className="py-3 px-3">Comments</th>
                                <th className="py-3 px-3">Is Listed?</th>
                                <th className="py-3 px-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchedData
                                .filter(post => (
                                    (!searchTerm || post.caption.toLowerCase().includes(searchTerm.toLowerCase()))
                                ))
                                .map(post => (
                                    <tr key={post._id}>
                                        <td className="py-3 px-3">{post.createdAt}</td>
                                        <td className="py-3 px-3">{post.caption}</td>
                                        <td className="py-3 px-3"><img src={post.image.url} alt={post.caption} className="w-10 h-10 rounded-full" /></td>
                                        <td className="py-3 px-3">{post.likes.length}</td>
                                        <td className="py-3 px-3">{post.comments.length}</td>
                                        <td className="py-3 px-3">{post.isListed ? "Yes" : "No"}</td>
                                        <td className="py-3 px-3">
                                            {post.isListed ? (
                                                <button onClick={() => handleToggleIsListed(post._id)} className="px-3 py-1 bg-red-500 text-white rounded-md">Unlist</button>
                                                ) : (
                                                <button onClick={() => handleToggleIsListed(post._id)} className="px-3 py-1 bg-green-500 text-white rounded-md">List</button>
                                            )}
                                        </td>
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

export default AdminPostManagement;
