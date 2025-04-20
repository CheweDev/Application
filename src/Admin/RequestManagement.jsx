import { useState, useRef } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";

const RequestManagement = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef(null);
  const acceptedModalRef = useRef(null);

  const tableData = [
    {
      id: 1,
      name: "Avery Thompson",
      email: "avery@example.com",
      createdAt: "04/17/2025",
      status: "Pending",
    },
    {
      id: 2,
      name: "Lucas Ramirez",
      email: "lucas@example.com",
      createdAt: "04/17/2025",
      status: "Accepted",
    },
    {
      id: 3,
      name: "Samantha Blake",
      email: "samantha@example.com",
      createdAt: "04/17/2025",
      status: "Pending",
    },
    {
      id: 4,
      name: "Natalie Cruz",
      email: "natalie@example.com",
      createdAt: "04/15/2025",
      status: "Pending",
    },
  ];

  const openModal = (item) => {
    setSelectedItem(item);
    modalRef.current?.showModal();
  };

  const openAcceptedModal = (item) => {
    setSelectedItem(item);
    acceptedModalRef.current?.showModal();
  };

  const handleDecision = (decision) => {
    console.log(`${decision} for ${selectedItem?.name}`);
    modalRef.current.close();
    setSelectedItem(null);
  };

  const handleAcceptedDecision = (newStatus) => {
    const updatedItem = { ...selectedItem, status: newStatus };
    console.log(`Status updated for ${updatedItem?.name}: ${newStatus}`);
    acceptedModalRef.current.close();
    setSelectedItem(null);
  };

  const handleSaveAsExcel = () => {
    const filteredTableData = tableData
      .filter((item) => item.status.toLowerCase() === activeTab)
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const ws = XLSX.utils.json_to_sheet(filteredTableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requests");
    XLSX.writeFile(wb, "request_management.xlsx");
  };

  // Filter data based on the active tab and search query
  const filteredData = tableData
    .filter((item) => item.status.toLowerCase() === activeTab)
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="bg-gray-100 flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <h1 className="text-2xl font-bold text-gray-800">Request Management</h1>
        <p className="text-gray-600">
          Request Management Overview & Activity History
        </p>

        <div className="flex justify-between mt-6">
          {/* Tab Navigation */}
          <div className="mb-4">
            <button
              className={`btn ${
                activeTab === "pending"
                  ? "btn-info text-white"
                  : "bg-white text-gray-600"
              } mr-2`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Requests
            </button>
            <button
              className={`btn ${
                activeTab === "accepted"
                  ? "btn-info text-white"
                  : "bg-white text-gray-600"
              } mr-2`}
              onClick={() => setActiveTab("accepted")}
            >
              Accepted Requests
            </button>
          </div>
          <div className="flex gap-2">
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Save as Excel Button */}
            <button
              className="btn btn-success text-white"
              onClick={handleSaveAsExcel}
            >
              <RiFileExcel2Fill />
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
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <th>{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td
                      className={`font-bold ${
                        item.status === "Pending"
                          ? "text-warning"
                          : item.status === "Accepted"
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td>{item.createdAt}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info btn-outline hover:text-white"
                        onClick={() =>
                          item.status === "Pending"
                            ? openModal(item)
                            : openAcceptedModal(item)
                        }
                      >
                        {item.status === "Pending" ? "Action" : "Edit"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pending Request Modal */}
        <dialog id="action_modal" className="modal" ref={modalRef}>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-2">
              Manage Request for {selectedItem?.name}
            </h3>
            <p className="mb-10 mt-5">
              Do you want to accept or reject this request?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-error text-white"
                onClick={() => handleDecision("Rejected")}
              >
                Reject
              </button>
              <button
                className="btn btn-success text-white"
                onClick={() => handleDecision("Accepted")}
              >
                Accept
              </button>
            </div>
          </div>
        </dialog>

        {/* Accepted Request Modal */}
        <dialog id="accepted_modal" className="modal" ref={acceptedModalRef}>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-2">
              Edit Request for {selectedItem?.name}
            </h3>
            <p className="mb-10 mt-5">
              You can change the status of this request from Accepted to
              Rejected or vice versa.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-error text-white"
                onClick={() => handleAcceptedDecision("Rejected")}
              >
                Change to Rejected
              </button>
              <button
                className="btn btn-success text-white"
                onClick={() => handleAcceptedDecision("Accepted")}
              >
                Keep as Accepted
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default RequestManagement;
