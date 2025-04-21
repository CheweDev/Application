import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import * as XLSX from "xlsx";
import supabase from "../Supabase.jsx";
import { RiFileExcel2Fill } from "react-icons/ri";

const AcademicRecords = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
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
    school_year: "",
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
        school_year: "",
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
      school_year,
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
            school_year,
          })
          .eq("lrn", selectedStudent.lrn);

        if (error) {
          console.error("Error updating student:", error);
        } else {
          window.location.reload();
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
            school_year,
          },
        ]);

        if (error) {
          console.error("Error inserting student:", error);
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }

    modalRef.current.close();
  };

  const handleSaveAsExcel = () => {
    const filtered = filteredStudents;
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_management.xlsx");
  };

 
  const filteredStudents = students
    .filter((student) => {
      if (
        selectedSchoolYear !== "" &&
        student.school_year !== selectedSchoolYear
      ) {
        return false;
      }
      if (!searchQuery.trim()) {
        return true;
      }
      const query = searchQuery.toLowerCase().trim();
      return (
        student.last_name.toLowerCase() === query ||
        student.first_name.toLowerCase() === query ||
        student.lrn === query
      );
    })
    .sort((a, b) => {
      const gradeLevelA = parseInt(a.gradeLevel.split(' ')[1]);
      const gradeLevelB = parseInt(b.gradeLevel.split(' ')[1]);
      
      if (gradeLevelA !== gradeLevelB) {
        return gradeLevelA - gradeLevelB;
      }
      
     
      return a.last_name.localeCompare(b.last_name);
    });

  return (
    <div className="bg-gray-100 flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">
            Student Management
          </h1>
          <p className="text-gray-600">
            Add, edit, and export student records.
          </p>
        </div>
        <div className="flex justify-between mt-2 mb-5">
          <input
            type="text"
            placeholder="Search by exact name..."
            className="input input-bordered"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="select select-bordered"
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
            >
              <option value="">All School Years</option>
              {Array.from(
                new Set(students.map((student) => student.school_year))
              ).map((uniqueYear) => (
                <option key={uniqueYear} value={uniqueYear}>
                  {uniqueYear}
                </option>
              ))}
            </select>
            <button
              className="btn btn-info text-white"
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
                <th>School Year</th>
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
                    <td>{student.school_year}</td>
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
                  <td colSpan="10" className="text-center text-gray-500">
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
                disabled={!!selectedStudent}
              />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                disabled={!!selectedStudent}
              />
              <input
                type="text"
                name="middle_name"
                placeholder="Middle Name"
                value={formData.middle_name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                disabled={!!selectedStudent}
              />
              <input
                type="text"
                name="lrn"
                placeholder="LRN"
                value={formData.lrn}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                disabled={!!selectedStudent}
              />
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                disabled={!!selectedStudent}
              />
              <select
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                disabled={!!selectedStudent}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
              </select>
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={formData.section}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="school_year"
                placeholder="School Year (e.g., 2023-2024)"
                value={formData.school_year}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                disabled={!!selectedStudent}
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
