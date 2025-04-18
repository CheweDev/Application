import { useState, useRef } from "react";
import AdminSidebar from "./AdminSidebar";
import { IoArrowBack } from "react-icons/io5";

const quarters = ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];
const gradeLevels = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
];

const StudentGrade = () => {
  const modalRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    gradeLevel: "Grade 1",
    quarter: "1st Quarter",
    subjects: {},
  });
  const [selectedCard, setSelectedCard] = useState(null);

  const handleOpenModal = (cardKey = null) => {
    if (cardKey) {
      const selected = grades.find((g) => g.cardKey === cardKey);
      setFormData(selected);
      setSelectedCard(cardKey);
    } else {
      setFormData({
        gradeLevel: "Grade 1",
        quarter: "1st Quarter",
        subjects: {},
      });
      setSelectedCard(null);
    }
    modalRef.current?.showModal();
  };

  const handleInputChange = (e, subject) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const cardKey = `${formData.gradeLevel}-${formData.quarter}`;
    const existing = grades.find((g) => g.cardKey === cardKey);
    if (existing) {
      const updated = grades.map((g) =>
        g.cardKey === cardKey ? { ...formData, cardKey } : g
      );
      setGrades(updated);
    } else {
      setGrades((prev) => [...prev, { ...formData, cardKey }]);
    }
    modalRef.current.close();
  };

  const handleDelete = () => {
    setGrades((prev) => prev.filter((g) => g.cardKey !== selectedCard));
    modalRef.current.close();
  };

  const handlePrint = () => {
    window.print();
  };

  const renderCard = (gradeLevel, quarter) => {
    const cardKey = `${gradeLevel}-${quarter}`;
    const entry = grades.find((g) => g.cardKey === cardKey);
    return (
      <div
        key={cardKey}
        onClick={() => handleOpenModal(cardKey)}
        className="cursor-pointer bg-white border rounded-xl shadow p-4 hover:shadow-md"
      >
        <h2 className="font-bold mb-2">{`${gradeLevel} - ${quarter}`}</h2>
        {entry ? (
          <ul className="text-sm text-gray-700 space-y-1">
            {Object.entries(entry.subjects).map(([subject, score]) => (
              <li key={subject}>
                <strong>{subject}:</strong> {score}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">No grades entered</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="text-gray-700 hover:text-black"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="text-2xl font-bold">Student Grades</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => handleOpenModal()}
            >
              Add Grades
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gradeLevels.map((grade) =>
            quarters.map((quarter) => renderCard(grade, quarter))
          )}
        </div>

        <dialog ref={modalRef} className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4">
              {selectedCard ? "Edit Grades" : "Add Grades"}
            </h3>

            <div className="flex flex-col gap-3">
              <select
                value={formData.gradeLevel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gradeLevel: e.target.value,
                  }))
                }
                className="select select-bordered w-full"
              >
                {gradeLevels.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <select
                value={formData.quarter}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quarter: e.target.value }))
                }
                className="select select-bordered w-full"
              >
                {quarters.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>

              {[
                "Math",
                "English",
                "Science",
                "Filipino",
                "Araling Panlipunan",
              ].map((subject) => (
                <input
                  key={subject}
                  type="number"
                  placeholder={`${subject} Grade`}
                  value={formData.subjects[subject] || ""}
                  onChange={(e) => handleInputChange(e, subject)}
                  className="input input-bordered w-full"
                />
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              {selectedCard && (
                <button
                  className="btn btn-error text-white"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
              <button
                className="btn btn-primary text-white"
                onClick={handleSubmit}
              >
                {selectedCard ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default StudentGrade;
