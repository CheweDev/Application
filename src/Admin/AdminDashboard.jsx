import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import { FaUsers } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import supabase from "../Supabase.jsx";

const AdminDashboard = () => {
  const [filters, setFilters] = useState({
    remarks: "All",
    date: "All",
    year: "All",
  });
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all students
        const { data: studentData, error: studentError } = await supabase
          .from("StudentData")
          .select("*");

        if (studentError) {
          console.error("Error fetching students:", studentError);
        } else {
          setStudents(studentData);
        }

        // Fetch all requests
        const { data: requestData, error: requestError } = await supabase
          .from("Request")
          .select("*");

        if (requestError) {
          console.error("Error fetching requests:", requestError);
        } else {
          setRequests(requestData);
        }

        // Fetch all teachers
        const { data: teacherData, error: teacherError } = await supabase
          .from("TeacherData")
          .select("*");

        if (teacherError) {
          console.error("Error fetching teachers:", teacherError);
        } else {
          setTeachers(teacherData);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combine student and request data
  const combinedData = requests.map(request => {
    const student = students.find(s => s.lrn === request.student_id);
    return {
      id: request.id,
      name: student ? `${student.first_name} ${student.last_name}` : "Unknown Student",
      date: new Date(request.created_at).toLocaleDateString(),
      year: request.school_year || "2023-2024",
      remarks: request.status,
    };
  });

  const uniqueDates = [...new Set(combinedData.map((item) => item.date))];
  const uniqueYears = [...new Set(combinedData.map((item) => item.year))];
  const uniqueRemarks = [...new Set(combinedData.map((item) => item.remarks))];

  const filteredData = combinedData.filter((item) => {
    const matchRemarks =
      filters.remarks === "All" || item.remarks === filters.remarks;
    const matchDate = filters.date === "All" || item.date === filters.date;
    const matchYear = filters.year === "All" || item.year === filters.year;
    return matchRemarks && matchDate && matchYear;
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:ml-64 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <h1 className="text-2xl font-extrabold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Quick data overview & Activity logs</p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center border-l-4 border-green-500">
            <div className="text-green-500 bg-green-100 rounded-full p-3">
              <FaUsers size={28} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-600 text-sm uppercase font-semibold tracking-widest">
                Total Students
              </h3>
              <p className="text-2xl font-bold text-gray-800">{students.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 flex items-center border-l-4 border-yellow-500">
            <div className="text-yellow-500 bg-yellow-100 rounded-full p-3">
              <GiTeacher size={28} />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-600 text-sm uppercase font-semibold tracking-widest">
                Total Teachers
              </h3>
              <p className="text-2xl font-bold text-gray-800">{teachers.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-between items-end gap-4">
          {/* Remarks Filter */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Filter by Remarks:
            </label>
            <select
              value={filters.remarks}
              onChange={(e) => handleFilterChange("remarks", e.target.value)}
              className="select select-bordered select-sm w-48"
            >
              <option value="All">All</option>
              {uniqueRemarks.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 flex-wrap">
        

            {/* School Year Filter */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Filter by School Year:
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="select select-bordered select-sm w-48"
              >
                <option value="All">All</option>
                {uniqueYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-2 shadow-lg">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Date</th>
                <th>School Year</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <th className="font-normal">{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.date}</td>
                    <td>{item.year}</td>
                    <td
                      className={`font-bold ${
                        item.remarks === "Pending"
                          ? "text-warning"
                          : item.remarks === "Accepted"
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {item.remarks}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500">
                    No records match your filters.
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

export default AdminDashboard;
