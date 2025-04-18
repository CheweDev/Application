import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import * as XLSX from "xlsx";

const AcademicRecords = () => {
  const [students, setStudents] = useState([
    {
      fullName: "Isabella Reyes",
      lrn: "123456789012",
      birthdate: "2011-06-12",
      sex: "Female",
      gradeLevel: "Grade 7",
    },
    {
      fullName: "Ethan Cruz",
      lrn: "987654321098",
      birthdate: "2010-03-22",
      sex: "Male",
      gradeLevel: "Grade 8",
    },
    {
      fullName: "Mia Santos",
      lrn: "456789123456",
      birthdate: "2012-08-05",
      sex: "Female",
      gradeLevel: "Grade 6",
    },
    {
      fullName: "Liam Garcia",
      lrn: "321654987654",
      birthdate: "2011-11-30",
      sex: "Male",
      gradeLevel: "Grade 7",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    lrn: "",
    birthdate: "",
    sex: "Male",
    gradeLevel: "",
  });

  const modalRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData(student);
    } else {
      setSelectedStudent(null);
      setFormData({
        fullName: "",
        lrn: "",
        birthdate: "",
        sex: "Male",
        gradeLevel: "",
      });
    }
    modalRef.current?.showModal();
  };

  const handleSubmit = () => {
    if (selectedStudent) {
      const updated = students.map((s) =>
        s.lrn === selectedStudent.lrn ? { ...formData } : s
      );
      setStudents(updated);
    } else {
      setStudents((prev) => [...prev, formData]);
    }
    modalRef.current.close();
  };

  const handleSaveAsExcel = () => {
    const filtered = students.filter((s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_management.xlsx");
  };

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <div className="flex justify-between mt-2">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-800">
              Student Management
            </h1>
            <p className="text-gray-600">
              Add, edit, and export student records.
            </p>
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
              className="btn btn-primary"
              onClick={() => handleOpenModal()}
            >
              + Add Student
            </button>
            <button
              className="btn btn-success text-white"
              onClick={handleSaveAsExcel}
            >
              Save as Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white shadow-md">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
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
                    <td>{student.fullName}</td>
                    <td>{student.lrn}</td>
                    <td>{student.birthdate}</td>
                    <td>{student.sex}</td>
                    <td>{student.gradeLevel}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm btn-outline btn-info hover:text-white"
                        onClick={() => handleOpenModal(student)}
                      >
                        Edit
                      </button>
                      <Link
                        to="/student-grade"
                        className="btn btn-sm btn-outline btn-warning hover:text-white"
                      >
                        View Grades
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        <dialog id="student_modal" className="modal" ref={modalRef}>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              {selectedStudent ? "Edit Student" : "Add Student"}
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="lrn"
                placeholder="LRN"
                value={formData.lrn}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                disabled={selectedStudent !== null}
              />
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              <select
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                name="gradeLevel"
                placeholder="Grade Level (e.g., Grade 7)"
                value={formData.gradeLevel}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button className="btn" onClick={() => modalRef.current.close()}>
                Cancel
              </button>
              <button
                className="btn btn-primary text-white"
                onClick={handleSubmit}
              >
                {selectedStudent ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default AcademicRecords;
