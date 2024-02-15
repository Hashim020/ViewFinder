import React, { useEffect, useState } from 'react';
import { useGetUserDataMutation } from '../../Slices/adminApiSlice';
import { toast } from 'react-toastify'; // Assuming you are using react-toastify for notifications

const UserManagementScreen = () => {
  const [usersData, setUsersData] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const refetchData = () => {
    setRefetch(!refetch);
  };

  const [userDataFromApi, { isLoading }] = useGetUserDataMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFromApiCall = await userDataFromApi();
        const usersArray = responseFromApiCall.data;
        setUsersData(usersArray);
      } catch (error) {
        toast.error('Error fetching users:', error.message);
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, [refetch, userDataFromApi]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mt-8 mb-4">User Management</h1>
      <div className="bg-white shadow-md rounded my-6">
        {usersData && usersData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map(user => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={refetchData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default UserManagementScreen;
