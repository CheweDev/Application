import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import RequestManagement from "./Admin/RequestManagement.jsx";
import AccountManagement from "./Admin/AccountManagement.jsx";
import AcademicRecords from "./Admin/AcademicRecords.jsx";
import StudentGrade from "./Admin/StudentGrade.jsx";
import SF10Template from "./Admin/SF10Template.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/management" element={<RequestManagement />} />
        <Route path="/account" element={<AccountManagement />} />
        <Route path="/academic-records" element={<AcademicRecords />} />
        <Route path="/student-grade" element={<StudentGrade />} />
        <Route path="/template" element={<SF10Template />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
