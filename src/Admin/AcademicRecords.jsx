import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import * as XLSX from "xlsx";
import supabase from "../Supabase.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";

const AcademicRecords = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    lrn: "",
    birthdate: "",
    sex: "Male",
    gradeLevel: "",
    section: "",
  });

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase.from("StudentData").select("*");
        if (error) {
          console.error("Error fetching students:", error);
        } else {
          setStudents(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchStudents();
  }, []);

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
        last_name: "",
        first_name: "",
        middle_name: "",
        lrn: "",
        birthdate: "",
        sex: "Male",
        gradeLevel: "",
        section: "",
      });
    }
    modalRef.current?.showModal();
  };

  const handleSubmit = async () => {
    const {
      last_name,
      first_name,
      middle_name,
      lrn,
      birthdate,
      sex,
      gradeLevel,
      section,
    } = formData;

    if (selectedStudent) {
      try {
        const { error } = await supabase
          .from("StudentData")
          .update({
            last_name,
            first_name,
            middle_name,
            lrn,
            birthdate,
            sex,
            gradeLevel,
            section,
          })
          .eq("lrn", selectedStudent.lrn);

        if (error) {
          console.error("Error updating student:", error);
        } else {
          const updated = students.map((s) =>
            s.lrn === selectedStudent.lrn ? { ...formData } : s
          );
          setStudents(updated);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    } else {
      try {
        const { error } = await supabase.from("StudentData").insert([
          {
            last_name,
            first_name,
            middle_name,
            lrn,
            birthdate,
            sex,
            gradeLevel,
            section,
          },
        ]);

        if (error) {
          console.error("Error inserting student:", error);
        } else {
          setStudents((prev) => [...prev, formData]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    modalRef.current.close();
  };

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
                    <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-outline btn-info hover:text-white"
                      onClick={() => handleOpenModal(student)}
                    >
                      Edit Info
                    </button>
                    <Link
                      to={{
                        pathname: "/student-grade",
                      }}
                      state={{
                        lrn: student.lrn,
                        gradeLevel: student.gradeLevel,
                        name: `${student.first_name} ${student.last_name}`,
                      }}
                      className="btn btn-sm btn-outline btn-warning hover:text-white"
                    >
                      View Grades
                    </Link>
                    <Link
                      to={{
                        pathname: "/template",
                      }}
                      state={{
                        lrn: student.lrn,
                        gradeLevel: student.gradeLevel,
                        name: `${student.first_name} ${student.last_name}`,
                        birthdate: student.birthdate,
                        sex: student.sex,
                      }}
                      className="btn btn-sm btn-outline btn-success hover:text-white"
                    >
                      Print
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
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="middle_name"
                placeholder="Middle Name"
                value={formData.middle_name}
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
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={formData.section}
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
