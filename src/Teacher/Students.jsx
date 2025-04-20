import { useState } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "./UserSidebar.jsx";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [students] = useState([
    {
      last_name: "Rodriguez",
      first_name: "Emma",
      middle_name: "Grace",
      lrn: "123456789012",
      birthdate: "2010-05-15",
      sex: "Female",
      gradeLevel: "Grade 7",
    },
    {
      last_name: "Kim",
      first_name: "Joshua",
      middle_name: "Min",
      lrn: "234567890123",
      birthdate: "2010-08-22",
      sex: "Male",
      gradeLevel: "Grade 7",
    },
    {
      last_name: "Chen",
      first_name: "Olivia",
      middle_name: "Lin",
      lrn: "345678901234",
      birthdate: "2010-03-10",
      sex: "Female",
      gradeLevel: "Grade 7",
    },
    {
      last_name: "Williams",
      first_name: "Ethan",
      middle_name: "James",
      lrn: "456789012345",
      birthdate: "2009-11-28",
      sex: "Male",
      gradeLevel: "Grade 8",
    },
    {
      last_name: "Martinez",
      first_name: "Sophia",
      middle_name: "Elena",
      lrn: "567890123456",
      birthdate: "2009-07-14",
      sex: "Female",
      gradeLevel: "Grade 8",
    },
    {
      last_name: "Johnson",
      first_name: "Noah",
      middle_name: "Alexander",
      lrn: "678901234567",
      birthdate: "2009-04-05",
      sex: "Male",
      gradeLevel: "Grade 8",
    },
    {
      last_name: "Thompson",
      first_name: "Ava",
      middle_name: "Rose",
      lrn: "789012345678",
      birthdate: "2008-12-19",
      sex: "Female",
      gradeLevel: "Grade 9",
    },
    {
      last_name: "Davis",
      first_name: "William",
      middle_name: "Thomas",
      lrn: "890123456789",
      birthdate: "2008-10-03",
      sex: "Male",
      gradeLevel: "Grade 9",
    },
  ]);

  const handleSaveAsExcel = () => {
    const filtered = students.filter((s) =>
      `${s.last_name} ${s.first_name} ${s.middle_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_management.xlsx");
  };

  const filteredStudents = students.filter((s) =>
    `${s.last_name} ${s.first_name} ${s.middle_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <div className="flex justify-between mt-2">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-800">
              Student Records
            </h1>
            <p className="text-gray-600">View and Export Student Records</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name"
              className="input input-bordered"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-success text-white"
              onClick={handleSaveAsExcel}
            >
              <RiFileExcel2Fill />
              Save as Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white shadow-md">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>LRN</th>
                <th>Birthdate</th>
                <th>Sex</th>
                <th>Grade Level</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.lrn}>
                    <th>{index + 1}</th>
                    <td>{student.last_name}</td>
                    <td>{student.first_name}</td>
                    <td>{student.middle_name}</td>
                    <td>{student.lrn}</td>
                    <td>{student.birthdate}</td>
                    <td>{student.sex}</td>
                    <td>{student.gradeLevel}</td>
                    <td>
                      <Link
                        to={{
                          pathname: "/user-grade",
                        }}
                        state={{
                          lrn: student.lrn,
                          gradeLevel: student.gradeLevel,
                        }}
                        className="btn btn-sm btn-outline btn-warning hover:text-white"
                      >
                        View Grades
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Students;
