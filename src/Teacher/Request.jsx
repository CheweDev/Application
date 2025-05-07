import { useState, useRef, useEffect } from "react";
import UserSidebar from "./UserSidebar.jsx";
import supabase from "../Supabase.jsx";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradeLevel = sessionStorage.getItem("grade_level");
        const section = sessionStorage.getItem("section");

        const { data: studentData, error: studentError } = await supabase
          .from("StudentData")
          .select("*")
          .eq("gradeLevel", gradeLevel)
          .eq("section", section);

        if (studentError) {
          console.error("Error fetching students:", studentError);
        } else {
          setStudents(studentData);
        }

        const { data: requestData, error: requestError } = await supabase
          .from("Request")
          .select("*")
          .eq("grade_level", gradeLevel)
          .eq("section", section);

        if (requestError) {
          console.error("Error fetching requests:", requestError);
        } else {
          setRequests(requestData);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setSelectedStudents([]);
    modalRef.current?.showModal();
  };

  const handleShowComment = (comment) => {
    setSelectedComment(comment || "No reason provided.");
    setCommentModalOpen(true);
  };

  const handleAddRequest = async () => {
    try {
      const gradeLevel = sessionStorage.getItem("grade_level");
      const section = sessionStorage.getItem("section");
      const currentYear = new Date().getFullYear();
      const schoolYear = `${currentYear}-${currentYear + 1}`;

      const newRequests = selectedStudents.map((student) => ({
        student_id: student.lrn,
        student_name: `${student.first_name} ${student.last_name}`,
        grade_level: gradeLevel,
        section: section,
        status: "Pending",
        school_year: schoolYear,
        created_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("Request").insert(newRequests);

      if (error) {
        console.error("Error adding requests:", error);
      } else {
        const { data: updatedRequests, error: fetchError } = await supabase
          .from("Request")
          .select("*")
          .eq("grade_level", gradeLevel)
          .eq("section", section);

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
  };

  const handleStudentSelect = (student) => {
    setSelectedStudents((prev) => {
      if (prev.some((s) => s.lrn === student.lrn)) {
        return prev.filter((s) => s.lrn !== student.lrn);
      } else {
        return [...prev, student];
      }
    });
  };

  const filteredRequests = requests.filter((request) =>
    request.student_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <UserSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <div className="mb-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">
              Student Records
            </h1>
            <p className="text-gray-600">
              Request printed copies of student records
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <button className="btn btn-primary" onClick={handleOpenModal}>
              + Add Request
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Grade Level</th>
                <th>Section</th>
                <th>Status</th>
                <th>Date Requested</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-red-500">
                    No requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, index) => (
                  <tr key={request.id}>
                    <th className="font-normal">{index + 1}</th>
                    <td>{request.student_name}</td>
                    <td>{request.grade_level}</td>
                    <td>{request.section}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          request.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    {request.status === "Rejected" ? (
                      <td>
                        <button
                          className="btn btn-xs btn-outline btn-error hover:text-white"
                          onClick={() => handleShowComment(request.comment)}
                        >
                          View Reason
                        </button>
                      </td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Request Modal */}
        <dialog ref={modalRef} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4">Select Students</h3>
            <div className="max-h-96 overflow-y-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>LRN</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.lrn}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedStudents.some(
                            (s) => s.lrn === student.lrn
                          )}
                          onChange={() => handleStudentSelect(student)}
                          className="checkbox"
                        />
                      </td>
                      <td>{`${student.first_name} ${student.last_name}`}</td>
                      <td>{student.lrn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button className="btn" onClick={() => modalRef.current.close()}>
                Cancel
              </button>
              <button
                className="btn btn-primary text-white"
                onClick={handleAddRequest}
                disabled={selectedStudents.length === 0}
              >
                Submit Request
              </button>
            </div>
          </div>
        </dialog>

        {commentModalOpen && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg text-red-600">
                Rejection Reason
              </h3>
              <p className="py-4 text-gray-700 whitespace-pre-wrap">
                {selectedComment}
              </p>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setCommentModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </main>
    </div>
  );
};

export default Request;
