import { useState } from "react";
import UserSidebar from "./UserSidebar.jsx";

const Request = () => {
  const [requestSent, setRequestSent] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const studentData = [
    {
      id: 1,
      name: "Emma Rodriguez",
      gradeLevel: "Grade 7",
      section: "Diamond",
    },
    {
      id: 2,
      name: "Joshua Kim",
      gradeLevel: "Grade 7",
      section: "Diamond",
    },
    {
      id: 3,
      name: "Olivia Chen",
      gradeLevel: "Grade 7",
      section: "Pearl",
    },
    {
      id: 4,
      name: "Ethan Williams",
      gradeLevel: "Grade 8",
      section: "Ruby",
    },
    {
      id: 5,
      name: "Sophia Martinez",
      gradeLevel: "Grade 8",
      section: "Ruby",
    },
    {
      id: 6,
      name: "Noah Johnson",
      gradeLevel: "Grade 8",
      section: "Emerald",
    },
    {
      id: 7,
      name: "Ava Thompson",
      gradeLevel: "Grade 9",
      section: "Sapphire",
    },
    {
      id: 8,
      name: "William Davis",
      gradeLevel: "Grade 9",
      section: "Sapphire",
    },
  ];

  const handlePrintRequest = (studentId) => {
    setRequestSent((prev) => ({
      ...prev,
      [studentId]: true,
    }));
    setTimeout(() => {
      console.log(`Print request submitted for student ID: ${studentId}`);
    }, 500);
  };

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
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Grade Level</th>
                <th>Section</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {studentData.filter((student) =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-red-500">
                    No matching student found.
                  </td>
                </tr>
              ) : (
                studentData
                  .filter((student) =>
                    student.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((student, index) => (
                    <tr key={student.id}>
                      <th className="font-normal">{index + 1}</th>
                      <td>{student.name}</td>
                      <td>{student.gradeLevel}</td>
                      <td>{student.section}</td>
                      <td>
                        {requestSent[student.id] ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-xs font-medium">
                            Request Sent
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePrintRequest(student.id)}
                            className="btn btn-sm btn-primary text-white"
                          >
                            Request for Printing
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Request;
