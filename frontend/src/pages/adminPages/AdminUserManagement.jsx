import AdminSideBar from '../../components/adminComponents/AdminSideBar';
import { useState } from 'react';

const AdminUserManagement = () => {
    const users = [
        {
            _id: 1,
            name: "John Doe",
            email: "john@example.com",
            gender: "male",
            username: "johndoe",
            birthdate: "1990-01-01",
            profileImageName: "john_profile.jpg",
            isBlocked: false,
        },
        {
            _id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            gender: "female",
            username: "janesmith",
            birthdate: "1992-05-15",
            profileImageName: "jane_profile.jpg",
            isBlocked: true,
        },
        {
            _id: 3,
            name: "Michael Johnson",
            email: "michael@example.com",
            gender: "male",
            username: "michaelj",
            birthdate: "1985-08-20",
            profileImageName: "michael_profile.jpg",
            isBlocked: false,
        },
        {
            _id: 4,
            name: "Emily Brown",
            email: "emily@example.com",
            gender: "female",
            username: "emilyb",
            birthdate: "1993-11-10",
            profileImageName: "emily_profile.jpg",
            isBlocked: false,
        },
        {
            _id: 5,
            name: "David Wilson",
            email: "david@example.com",
            gender: "male",
            username: "davidw",
            birthdate: "1988-04-25",
            profileImageName: "david_profile.jpg",
            isBlocked: true,
        },
        {
            _id: 6,
            name: "Sarah Johnson",
            email: "sarah@example.com",
            gender: "female",
            username: "sarahj",
            birthdate: "1991-09-30",
            profileImageName: "sarah_profile.jpg",
            isBlocked: false,
        },
        {
            _id: 7,
            name: "Christopher Lee",
            email: "chris@example.com",
            gender: "male",
            username: "chrisl",
            birthdate: "1987-02-15",
            profileImageName: "chris_profile.jpg",
            isBlocked: false,
        },
        {
            _id: 8,
            name: "Amanda Taylor",
            email: "amanda@example.com",
            gender: "female",
            username: "amandat",
            birthdate: "1990-06-05",
            profileImageName: "amanda_profile.jpg",
            isBlocked: true,
        },
        {
            _id: 9,
            name: "Daniel Martinez",
            email: "daniel@example.com",
            gender: "male",
            username: "danm",
            birthdate: "1989-03-12",
            profileImageName: "daniel_profile.jpg",
            isBlocked: false,
        },
        {
            _id: 10,
            name: "Jessica Adams",
            email: "jessica@example.com",
            gender: "female",
            username: "jessa",
            birthdate: "1994-07-20",
            profileImageName: "jessica_profile.jpg",
            isBlocked: false,
        },
    ];
    

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: '0 0 auto', width: '250px', height: '100%', backgroundColor: '#f0f0f0' }}>
                <AdminSideBar />
            </div>
            <div className="px-3 py-14 flex-1 h-full bg-white">
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
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Profile Image
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Gender
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Birthdate
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {user.profileImageName && (
                                            <img src={`path_to_images/${user.profileImageName}`} alt={user.name} className="w-10 h-10 rounded-full" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.gender}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.birthdate && new Date(user.birthdate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isBlocked ? "Blocked" : "Active"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleBlockUser(user._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            {user.isBlocked ? "Unblock" : "Block"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUserManagement;
