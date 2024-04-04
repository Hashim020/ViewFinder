import React, { useEffect, useState } from 'react';
import AdminSideBar from '../../components/adminComponents/AdminSideBar.jsx';
import axios from '../../API/axios/axiosInstance.js';
import SelectWinnerModal from '../../components/modal/adminModal/SelectWinnerModal.jsx';
import { useDisclosure } from '@chakra-ui/react';
import Swal from 'sweetalert2';

const AdminContestManagement = () => {
    const [contests, setContests] = useState([]);
    const [singleContest, setSingleContest] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchContests = async (page, term) => {
        try {
            const { data } = await axios.get(`/api/admin/get-contests?page=${page}&search=${term}`);
            setContests(data.contests);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchContests(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handleClick = async (singleCo) => {
        try {
            setSingleContest(singleCo);
            onOpen();
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnListReList = async (id) => {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to perform this action?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        });

        if (confirmed.isConfirmed) {
            try {
                const { data } = await axios.put("/api/admin/Contest-unlistRelist", {
                    contestId: id
                });

                if (data.success === true) {
                    Swal.fire({
                        title: "Done",
                        text: "Action Applied",
                        icon: "success"
                    });

                    fetchContests(currentPage, searchTerm);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex h-screen">
            <div className="flex-none w-64 h-full bg-gray-200">
                <AdminSideBar />
            </div>
            <div className="flex-1 px-3 py-15 bg-white">
                <h2 className="text-xl font-semibold mb-4">Contest Management</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Search..."
                    />
                </div>
                <div className="relative border-spacing-2 overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead>
                            <tr>
                                <th className="py-3 px-3">Contest Name</th>
                                <th className="py-3 px-3">Contest Description</th>
                                <th className="py-3 px-3">Cover Photo</th>
                                <th className="py-3 px-3">Entries</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3">Select Winner</th>
                                <th className="py-3 px-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.map(contest => (
                                <tr key={contest._id}>
                                    <td className="py-3 px-3">{contest.contestName}</td>
                                    <td className="py-3 px-3 w-80">{contest.contestDescription}</td>
                                    <td className="py-3 px-3"><img src={contest.coverPhoto} alt="Cover Photo" className="w-10 h-10 rounded-full" /></td>
                                    <td className="py-3 px-3 text-center">{contest.participation.length}</td>
                                    <td className="py-3 px-3">{contest.isActive ? 'Active' : 'Inactive'}</td>
                                    <td onClick={() => handleClick(contest)} className="py-3 px-3 text-center cursor-pointer hover:text-blue-600 ">{`Show ${contest.participation.length}`}</td>
                                    <td className="py-3 px-3">
                                        {contest.isListed ? (
                                            <button onClick={() => handleUnListReList(contest._id)} className="px-3 py-1 bg-red-500 text-white rounded-md">Unlist</button>
                                        ) : (
                                            <button onClick={() => handleUnListReList(contest._id)} className="px-3 py-1 bg-green-600 text-white rounded-md">list</button>
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
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={`px-3 py-1 bg-gray-300 ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-400'} text-white rounded-md mr-2`}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                            </li>
                            {[...Array(totalPages).keys()].map(pageNumber => (
                                <li key={pageNumber}>
                                    <button
                                        onClick={() => handlePageChange(pageNumber + 1)}
                                        className={`px-3 py-1 ${currentPage === pageNumber + 1 ? 'bg-blue-500 text-white' : 'hover:bg-blue-600 text-blue-500'} rounded-md mr-2`}
                                    >
                                        {pageNumber + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={`px-3 py-1 bg-gray-300 ${currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-400'} text-white rounded-md`}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <SelectWinnerModal isOpen={isOpen} onClose={onClose} singleContest={singleContest} />
        </div>
    );
};

export default AdminContestManagement;
