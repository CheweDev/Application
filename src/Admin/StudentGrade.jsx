import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { IoArrowBack } from "react-icons/io5";
import supabase from "../Supabase";
import { IoMdPrint } from "react-icons/io";
import CryptoJS from "crypto-js"; 

const quarters = ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];


const ENCRYPTION_KEY = "your-secure-key";

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data.toString(), ENCRYPTION_KEY).toString();
};

const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const StudentGrade = () => {
  const location = useLocation();
  const { lrn, gradeLevel, name } = location.state || {};
  const modalRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    lrn: lrn || "",
    grade_level: gradeLevel || "",
    quarter: "1st Quarter",
    mother_tongue: "",
    filipino: "",
    english: "",
    math: "",
    science: "",
    ap: "",
    epp_tle: "",
    mapeh: "",
    music: "",
    arts: "",
    pe: "",
    health: "",
    ep: "",
    arabic: "",
    islamic: "",
    average: "",
  });
  const [selectedCard, setSelectedCard] = useState(null);


  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data, error } = await supabase
          .from("Grades")
          .select("*")
          .eq("lrn", lrn)
          .eq("grade_level", gradeLevel);

        if (error) {
          console.error("Error fetching grades:", error);
        } else {
      
          const decryptedGrades = data.map((grade) => {
            const decryptedGrade = { ...grade };
            Object.keys(decryptedGrade).forEach((key) => {
              if (
                [
                  "mother_tongue",
                  "filipino",
                  "english",
                  "math",
                  "science",
                  "ap",
                  "epp_tle",
                  "mapeh",
                  "music",
                  "arts",
                  "pe",
                  "health",
                  "ep",
                  "arabic",
                  "islamic",
                  "average",
                ].includes(key)
              ) {
                decryptedGrade[key] = decryptData(decryptedGrade[key]);
              }
            });
            return decryptedGrade;
          });
          setGrades(decryptedGrades);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    if (lrn && gradeLevel) {
      fetchGrades();
    }
  }, [lrn, gradeLevel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (quarter = null) => {
    if (quarter) {
      const selected = grades.find((g) => g.quarter === quarter);
      if (selected) {
        setFormData(selected); 
      } else {
        setFormData({
          lrn: lrn || "",
          grade_level: gradeLevel || "",
          quarter: quarter,
          mother_tongue: "",
          filipino: "",
          english: "",
          math: "",
          science: "",
          ap: "",
          epp_tle: "",
          mapeh: "",
          music: "",
          arts: "",
          pe: "",
          health: "",
          ep: "",
          arabic: "",
          islamic: "",
          average: "",
        });
      }
      setSelectedCard(quarter);
    } else {
      setFormData({
        lrn: lrn || "",
        grade_level: gradeLevel || "",
        quarter: "1st Quarter",
        mother_tongue: "",
        filipino: "",
        english: "",
        math: "",
        science: "",
        ap: "",
        epp_tle: "",
        mapeh: "",
        music: "",
        arts: "",
        pe: "",
        health: "",
        ep: "",
        arabic: "",
        islamic: "",
        average: "",
      });
      setSelectedCard(null);
    }
    modalRef.current?.showModal();
  };

  const handleSubmit = async () => {
    try {

      const encryptedFormData = { ...formData };
      Object.keys(encryptedFormData).forEach((key) => {
        if (
          [
            "mother_tongue",
            "filipino",
            "english",
            "math",
            "science",
            "ap",
            "epp_tle",
            "mapeh",
            "music",
            "arts",
            "pe",
            "health",
            "ep",
            "arabic",
            "islamic",
            "average",
          ].includes(key)
        ) {
          encryptedFormData[key] = encryptData(encryptedFormData[key]);
        }
      });

      if (formData.id) {

        const { error } = await supabase
          .from("Grades")
          .update(encryptedFormData)
          .eq("id", formData.id);

        if (error) {
          console.error("Error updating grade:", error);
        } else {

          const { data: updatedGrades, error: fetchError } = await supabase
            .from("Grades")
            .select("*")
            .eq("lrn", lrn)
            .eq("grade_level", gradeLevel);

          if (fetchError) {
            console.error("Error fetching updated grades:", fetchError);
          } else {
            setGrades(
              updatedGrades.map((grade) => {
                const decryptedGrade = { ...grade };
                Object.keys(decryptedGrade).forEach((key) => {
                  if (
                    [
                      "mother_tongue",
                      "filipino",
                      "english",
                      "math",
                      "science",
                      "ap",
                      "epp_tle",
                      "mapeh",
                      "music",
                      "arts",
                      "pe",
                      "health",
                      "ep",
                      "arabic",
                      "islamic",
                      "average",
                    ].includes(key)
                  ) {
                    decryptedGrade[key] = decryptData(decryptedGrade[key]);
                  }
                });
                return decryptedGrade;
              })
            );
          }
        }
      } else {

        const { error } = await supabase.from("Grades").insert([encryptedFormData]);

        if (error) {
          console.error("Error inserting grade:", error);
        } else {
          const { data: updatedGrades, error: fetchError } = await supabase
            .from("Grades")
            .select("*")
            .eq("lrn", lrn)
            .eq("grade_level", gradeLevel);

          if (fetchError) {
            console.error("Error fetching updated grades:", fetchError);
          } else {
            setGrades(
              updatedGrades.map((grade) => {
                const decryptedGrade = { ...grade };
                Object.keys(decryptedGrade).forEach((key) => {
                  if (
                    [
                      "mother_tongue",
                      "filipino",
                      "english",
                      "math",
                      "science",
                      "ap",
                      "epp_tle",
                      "mapeh",
                      "music",
                      "arts",
                      "pe",
                      "health",
                      "ep",
                      "arabic",
                      "islamic",
                      "average",
                    ].includes(key)
                  ) {
                    decryptedGrade[key] = decryptData(decryptedGrade[key]);
                  }
                });
                return decryptedGrade;
              })
            );
          }
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }

    modalRef.current.close();
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("Grades")
        .delete()
        .eq("lrn", lrn)
        .eq("grade_level", gradeLevel)
        .eq("quarter", formData.quarter);

      if (error) {
        console.error("Error deleting grade:", error);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }

    modalRef.current.close();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="text-gray-700 hover:bg-gray-700 hover:text-white cursor-pointer rounded-full p-1"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="text-2xl">Add Grades for {name}</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => handleOpenModal()}
            >
              + Add Grades
            </button>
            <button className="btn bg-gray-300" onClick={handlePrint}>
              <IoMdPrint />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {grades.length > 0 ? (
            grades.map((grade) => (
              <div
                key={grade.quarter}
                onClick={() => handleOpenModal(grade.quarter)}
                className="cursor-pointer bg-white border rounded-xl shadow p-4 hover:shadow-md"
              >
                <h2 className="font-bold mb-2">
                  {grade.grade_level} - {grade.quarter}
                </h2>
                <p className="text-gray-700">Grades entered</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic col-span-full text-center">
              No grades available.
            </p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {!selectedCard && (
                <div className="col-span-1 md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quarter
                  </label>
                  <select
                    name="quarter"
                    value={formData.quarter}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    {quarters.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {[
                "mother_tongue",
                "filipino",
                "english",
                "math",
                "science",
                "ap",
                "epp_tle",
                "mapeh",
                "music",
                "arts",
                "pe",
                "health",
                "ep",
                "arabic",
                "islamic",
                "average",
              ].map((subject) => (
                <div key={subject}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {subject.replace("_", " ").toUpperCase()}
                  </label>
                  <input
                    type="number"
                    name={subject}
                    placeholder="Enter grade"
                    value={formData[subject] || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
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