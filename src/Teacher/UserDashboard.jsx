import { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar.jsx";
import { FaUsers } from "react-icons/fa";
import { MdOutlineClass } from "react-icons/md";
import supabase from "../Supabase.jsx";

const UserDashboard = () => {
  const [filters, setFilters] = useState({
    gradeLevel: "All",
    section: "All",
    status: "All",
  });
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students and requests based on teacher's grade_level and section
  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradeLevel = sessionStorage.getItem('grade_level');
        const section = sessionStorage.getItem('section');

        // Fetch students
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

        // Fetch requests
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique values for filters
  const uniqueGradeLevels = [...new Set(students.map((item) => item.gradeLevel))];
  const uniqueSections = [...new Set(students.map((item) => item.section))];
  const uniqueStatuses = ["Pending", "Approved", "Declined"];

  // Combine student and request data
  const combinedData = students.map(student => {
    const studentRequest = requests.find(request => request.student_id === student.lrn);
    return {
      id: student.lrn,
      name: `${student.first_name} ${student.last_name}`,
      gradeLevel: student.gradeLevel,
      section: student.section,
      status: studentRequest ? studentRequest.status : "No Request",
    };
  });

  // Apply filters to data
  const filteredData = combinedData.filter((item) => {
    const matchGradeLevel =
      filters.gradeLevel === "All" || item.gradeLevel === filters.gradeLevel;
    const matchSection =
      filters.section === "All" || item.section === filters.section;
    const matchStatus =
      filters.status === "All" || item.status === filters.status;
    return matchGradeLevel && matchSection && matchStatus;
  });

  // Calculate summary data
  const totalStudents = filteredData.length;
  const sections = new Set(filteredData.map((item) => item.section));
  const totalSections = sections.size;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
      case "Declined":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
      case "No Request":
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <UserSidebar />
        <main className="flex-1 p-6 lg:ml-64 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <UserSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        {/* Filters */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600">
              Student overview & classroom management
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Filter by Grade Level:
              </label>
              <select
                value={filters.gradeLevel}
                onChange={(e) =>
                  handleFilterChange("gradeLevel", e.target.value)
                }
                className="select select-bordered select-sm w-48"
              >
                <option value="All">All Grades</option>
                {uniqueGradeLevels.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Filter by Section:
              </label>
              <select
                value={filters.section}
                onChange={(e) => handleFilterChange("section", e.target.value)}
                className="select select-bordered select-sm w-48"
              >
                <option value="All">All Sections</option>
                {uniqueSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Filter by Status:
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="select select-bordered select-sm w-48"
              >
                <option value="All">All Statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center border-l-4 border-blue-500">
            <div className="text-blue-500 bg-blue-100 rounded-full p-3">
              <FaUsers size={28} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-600 text-sm uppercase font-semibold tracking-widest">
                Total Students
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {totalStudents}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center border-l-4 border-purple-500">
            <div className="text-purple-500 bg-purple-100 rounded-full p-3">
              <MdOutlineClass size={28} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-600 text-sm uppercase font-semibold tracking-widest">
                Total Sections
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {totalSections}
              </p>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-5 shadow-lg">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Grade Level</th>
                <th>Sections</th>
                <th>Request Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((student, index) => (
                  <tr key={student.id}>
                    <th className="font-normal">{index + 1}</th>
                    <td>{student.name}</td>
                    <td>{student.gradeLevel}</td>
                    <td>{student.section}</td>
                    <td>
                      <span className={getStatusBadge(student.status)}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500">
                    No students match your filters.
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

export default UserDashboard;
