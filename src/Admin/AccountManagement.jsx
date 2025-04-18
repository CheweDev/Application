import { useState, useRef } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import * as XLSX from "xlsx";

const UserManagement = () => {
  const [usersData, setUsersData] = useState([
    {
      id: 1,
      name: "Avery Thompson",
      email: "avery@example.com",
      password: "password123",
      status: "Active",
      createdAt: "04/17/2025",
    },
    {
      id: 2,
      name: "Lucas Ramirez",
      email: "lucas@example.com",
      password: "password456",
      status: "Blocked",
      createdAt: "04/17/2025",
    },
    {
      id: 3,
      name: "Samantha Blake",
      email: "samantha@example.com",
      password: "password789",
      status: "Active",
      createdAt: "04/17/2025",
    },
    {
      id: 4,
      name: "Natalie Cruz",
      email: "natalie@example.com",
      password: "password000",
      status: "Active",
      createdAt: "04/15/2025",
    },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef(null);

  const openModal = (user) => {
    setSelectedUser(user);
    modalRef.current?.showModal();
  };

  const handleBlockUnblockUser = (action) => {
    // Update user status in the usersData array
    const updatedUsersData = usersData.map((user) =>
      user.id === selectedUser.id
        ? { ...user, status: action === "block" ? "Blocked" : "Active" }
        : user
    );
    setUsersData(updatedUsersData);
    console.log(`${action} user: ${selectedUser.name}`);
    modalRef.current.close();
    setSelectedUser(null);
  };

  const handleSaveAsExcel = () => {
    const filteredUsersData = usersData.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const ws = XLSX.utils.json_to_sheet(filteredUsersData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "user_management.xlsx");
  };

  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <div className="flex justify-between mt-2">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage user accounts and block/unblock users.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="mb-4">
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="btn btn-success text-white"
              onClick={handleSaveAsExcel}
            >
              Save as Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white shadow-md">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Status</th>
                <th>Created At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <th>{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td
                      className={`font-bold ${
                        user.status === "Active" ? "text-success" : "text-error"
                      }`}
                    >
                      {user.status}
                    </td>
                    <td>{user.createdAt}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          user.status === "Active"
                            ? "btn-outline btn-error hover:text-white"
                            : "btn-outline btn-success hover:text-white"
                        }`}
                        onClick={() => openModal(user)}
                      >
                        {user.status === "Active" ? <>Block</> : <>Unblock</>}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Block/Unblock User Modal */}
        <dialog id="action_modal" className="modal" ref={modalRef}>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              {selectedUser?.status === "Active" ? (
                <>
                  <span className="text-error">🚫</span> Block User
                </>
              ) : (
                <>
                  <span className="text-success">🔓</span> Unblock User
                </>
              )}
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {selectedUser?.status === "Active" ? "block" : "unblock"}
              </span>{" "}
              <span className="text-gray-900 font-medium">
                {selectedUser?.name}
              </span>
              ? This action will immediately update their status.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-ghost"
                onClick={() => modalRef.current.close()}
              >
                Cancel
              </button>
              {selectedUser?.status === "Active" ? (
                <button
                  className="btn btn-error text-white"
                  onClick={() => handleBlockUnblockUser("block")}
                >
                  Block
                </button>
              ) : (
                <button
                  className="btn btn-success text-white"
                  onClick={() => handleBlockUnblockUser("unblock")}
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default UserManagement;
