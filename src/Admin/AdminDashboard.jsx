import { useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import { FaUsers } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";

const AdminDashboard = () => {
  const [filters, setFilters] = useState({
    remarks: "All",
    date: "All",
    year: "All",
  });

  const tableData = [
    {
      id: 1,
      name: "Avery Thompson",
      date: "04/17/2025",
      year: "2025-2026",
      remarks: "Pending",
    },
    {
      id: 2,
      name: "Lucas Ramirez",
      date: "04/17/2025",
      year: "2025-2026",
      remarks: "Accepted",
    },
    {
      id: 3,
      name: "Samantha Blake",
      date: "04/17/2025",
      year: "2025-2026",
      remarks: "Pending",
    },
    {
      id: 4,
      name: "Natalie Cruz",
      date: "04/15/2025",
      year: "2025-2026",
      remarks: "Pending",
    },
    {
      id: 5,
      name: "Jasper Whitman",
      date: "04/18/2025",
      year: "2025-2026",
      remarks: "Rejected",
    },
    {
      id: 6,
      name: "Elena Foster",
      date: "04/18/2025",
      year: "2025-2026",
      remarks: "Rejected",
    },
    {
      id: 7,
      name: "Miles Anderson",
      date: "04/18/2025",
      year: "2025-2026",
      remarks: "Rejected",
    },
  ];

  const uniqueDates = [...new Set(tableData.map((item) => item.date))];
  const uniqueYears = [...new Set(tableData.map((item) => item.year))];
  const uniqueRemarks = [...new Set(tableData.map((item) => item.remarks))];

  const filteredData = tableData.filter((item) => {
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
              <p className="text-2xl font-bold text-gray-800">10</p>
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
              <p className="text-2xl font-bold text-gray-800">10</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-between items-end gap-4">
          {/* Remarks Filter */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
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
            {/* Date Filter */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Filter by Date:
              </label>
              <select
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
                className="select select-bordered select-sm w-48"
              >
                <option value="All">All</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* School Year Filter */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
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
