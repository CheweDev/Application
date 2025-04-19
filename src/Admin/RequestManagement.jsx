import { useState, useRef, useEffect } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";
import supabase from "../Supabase.jsx";

const RequestManagement = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);
  const acceptedModalRef = useRef(null);

  // Fetch requests from Supabase
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from("Request")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching requests:", error);
        } else {
          setRequests(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    modalRef.current?.showModal();
  };

  const openAcceptedModal = (item) => {
    setSelectedItem(item);
    acceptedModalRef.current?.showModal();
  };

  const handleDecision = async (decision) => {
    try {
      const { error } = await supabase
        .from("Request")
        .update({ status: decision })
        .eq("id", selectedItem.id);

      if (error) {
        console.error("Error updating request:", error);
      } else {
        // Refresh requests list
        const { data: updatedRequests, error: fetchError } = await supabase
          .from("Request")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching updated requests:", fetchError);
        } else {
          setRequests(updatedRequests);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }

    modalRef.current.close();
    setSelectedItem(null);
  };

  const handleAcceptedDecision = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("Request")
        .update({ status: newStatus })
        .eq("id", selectedItem.id);

      if (error) {
        console.error("Error updating request:", error);
      } else {
        // Refresh requests list
        const { data: updatedRequests, error: fetchError } = await supabase
          .from("Request")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching updated requests:", fetchError);
        } else {
          setRequests(updatedRequests);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }

    acceptedModalRef.current.close();
    setSelectedItem(null);
  };

  const handleSaveAsExcel = () => {
    const filteredTableData = filteredData.map(item => ({
      Name: item.student_name,
      Grade: item.grade_level,
      Section: item.section,
      Status: item.status,
      "Date Requested": new Date(item.created_at).toLocaleDateString(),
      "School Year": item.school_year
    }));

    const ws = XLSX.utils.json_to_sheet(filteredTableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requests");
    XLSX.writeFile(wb, "request_management.xlsx");
  };

  // Filter data based on the active tab and search query
  const filteredData = requests
    .filter((item) => item.status.toLowerCase() === activeTab)
    .filter((item) =>
      item.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return (
      <div className="bg-gray-100 flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:ml-64 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </main>
      </div>
    );
  }

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
                <th>Grade</th>
                <th>Section</th>
                <th>Status</th>
                <th>Date Requested</th>
                <th>School Year</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <th>{index + 1}</th>
                    <td>{item.student_name}</td>
                    <td>{item.grade_level}</td>
                    <td>{item.section}</td>
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
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>{item.school_year}</td>
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
                  <td colSpan="8" className="text-center text-gray-500">
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
              Manage Request for {selectedItem?.student_name}
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
              Edit Request for {selectedItem?.student_name}
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
