import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import { IoArrowBack } from "react-icons/io5";
import supabase from "../Supabase";
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

const subjectsForAverage = [
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
];

const requiredSubjects = [
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
];

const calculateAverage = (data) => {
  let sum = 0;
  let validSubjectsCount = 0;

  subjectsForAverage.forEach((subject) => {
    if (data[subject] && !isNaN(parseFloat(data[subject]))) {
      sum += parseFloat(data[subject]);
      validSubjectsCount++;
    }
  });

  if (validSubjectsCount > 0) {
    // return (sum / validSubjectsCount).toFixed(2);
    return Math.round(sum / validSubjectsCount).toString();
  }
  return "";
};

const UserStudentGrade = () => {
  const location = useLocation();
  const { lrn, gradeLevel, name, section } = location.state || {};
  const modalRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    lrn: lrn || "",
    grade_level: gradeLevel || "",
    section: section || "",
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
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data, error } = await supabase
          .from("Grades")
          .select("*")
          .eq("lrn", lrn)
          .eq("grade_level", gradeLevel)
          .eq("section", section);

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
            // Recalculate average
            decryptedGrade.average = calculateAverage(decryptedGrade);
            return decryptedGrade;
          });
          setGrades(decryptedGrades);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    if (lrn && gradeLevel && section) {
      fetchGrades();
    }
  }, [lrn, gradeLevel, section]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    // Clear error for this field when user types
    setFormErrors({
      ...formErrors,
      [name]: "",
    });

    if (subjectsForAverage.includes(name)) {
      updatedFormData.average = calculateAverage(updatedFormData);
    }

    setFormData(updatedFormData);
  };

  const handleOpenModal = (quarter = null) => {
    // Reset form errors when opening modal
    setFormErrors({});

    if (quarter) {
      const selected = grades.find((g) => g.quarter === quarter);
      if (selected) {
        const updatedSelected = { ...selected };
        updatedSelected.average = calculateAverage(updatedSelected);
        setFormData(updatedSelected);
      } else {
        setFormData({
          lrn: lrn || "",
          grade_level: gradeLevel || "",
          section: section || "",
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
        section: section || "",
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

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate required subjects
    requiredSubjects.forEach((subject) => {
      if (!formData[subject] || formData[subject].trim() === "") {
        errors[subject] = `${subject
          .replace("_", " ")
          .toUpperCase()} is required`;
        isValid = false;
      } else if (isNaN(parseFloat(formData[subject]))) {
        errors[subject] = `${subject
          .replace("_", " ")
          .toUpperCase()} must be a number`;
        isValid = false;
      } else if (
        parseFloat(formData[subject]) < 60 ||
        parseFloat(formData[subject]) > 100
      ) {
        errors[subject] = `${subject
          .replace("_", " ")
          .toUpperCase()} must be between 60 and 100`;
        isValid = false;
      }
    });

    // Validate optional subjects if filled
    ["ep", "arabic", "islamic"].forEach((subject) => {
      if (formData[subject] && formData[subject].trim() !== "") {
        if (isNaN(parseFloat(formData[subject]))) {
          errors[subject] = `${subject
            .replace("_", " ")
            .toUpperCase()} must be a number`;
          isValid = false;
        } else if (
          parseFloat(formData[subject]) < 60 ||
          parseFloat(formData[subject]) > 100
        ) {
          errors[subject] = `${subject
            .replace("_", " ")
            .toUpperCase()} must be between 60 and 100`;
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill in all required grades correctly before submitting.");
      return;
    }

    try {
      const dataToSubmit = { ...formData };
      dataToSubmit.average = calculateAverage(dataToSubmit);

      const encryptedFormData = { ...dataToSubmit };
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
          alert("Error updating grades. Please try again.");
        } else {
          const { data: updatedGrades, error: fetchError } = await supabase
            .from("Grades")
            .select("*")
            .eq("lrn", lrn)
            .eq("grade_level", gradeLevel)
            .eq("section", section);

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
                decryptedGrade.average = calculateAverage(decryptedGrade);
                return decryptedGrade;
              })
            );
            alert("Grades updated successfully!");
          }
        }
      } else {
        const { error } = await supabase
          .from("Grades")
          .insert([encryptedFormData]);

        if (error) {
          console.error("Error inserting grade:", error);
          alert("Error adding grades. Please try again.");
        } else {
          const { data: updatedGrades, error: fetchError } = await supabase
            .from("Grades")
            .select("*")
            .eq("lrn", lrn)
            .eq("grade_level", gradeLevel)
            .eq("section", section);

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
                decryptedGrade.average = calculateAverage(decryptedGrade);
                return decryptedGrade;
              })
            );
            alert("Grades added successfully!");
          }
        }
      }

      modalRef.current.close();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("Grades")
        .delete()
        .eq("lrn", lrn)
        .eq("grade_level", gradeLevel)
        .eq("section", section)
        .eq("quarter", formData.quarter);

      if (error) {
        console.error("Error deleting grade:", error);
        alert("Error deleting grades. Please try again.");
      } else {
        alert("Grades deleted successfully!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }

    modalRef.current.close();
  };

  return (
    <div className="bg-gray-100 flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 p-6 lg:ml-64">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-b p-4 border-gray-400">
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
              ].map((subject) =>
                subject === "average" ? (
                  <div key={subject}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {subject.replace("_", " ").toUpperCase()}
                    </label>
                    <input
                      type="text"
                      name={subject}
                      placeholder="Automatically calculated"
                      value={formData[subject] || ""}
                      readOnly
                      className="input input-bordered w-full bg-gray-100"
                    />
                  </div>
                ) : (
                  <div key={subject}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {subject.replace("_", " ").toUpperCase()}
                      {requiredSubjects.includes(subject) && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="number"
                      name={subject}
                      placeholder={
                        requiredSubjects.includes(subject)
                          ? "Required"
                          : "Enter grade"
                      }
                      value={formData[subject] || ""}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full ${
                        formErrors[subject] ? "input-error" : ""
                      }`}
                      min="60"
                      max="100"
                      required={requiredSubjects.includes(subject)}
                    />
                    {formErrors[subject] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors[subject]}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                className="btn btn-primary text-white"
                onClick={handleSubmit}
              >
                {selectedCard ? "Update" : "Save"}
              </button>
              {selectedCard && (
                <button
                  className="btn btn-error text-white"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>

            <div className="mt-5 italic text-xs text-gray-600">
              <p>
                * Required fields. All required grades must be entered before
                submission. Grades must be between 60 and 100.
              </p>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default UserStudentGrade;
