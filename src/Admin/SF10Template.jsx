import { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../Supabase";
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = "your-secure-key";

const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const SF10Template = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const location = useLocation();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { lrn, gradeLevel, name, birthdate, sex } = location.state || {};

        if (!lrn || !name) {
          throw new Error('Missing required student data');
        }

        const { data: grades, error: fetchError } = await supabase
          .from('Grades')
          .select('*')
          .eq('lrn', lrn);

        if (fetchError) throw fetchError;

        if (!grades || grades.length === 0) {
          throw new Error('No grades found for this student');
        }

        const gradesByLevel = grades.reduce((acc, grade) => {
          if (!acc[grade.grade_level]) {
            acc[grade.grade_level] = [];
          }
          acc[grade.grade_level].push(grade);
          return acc;
        }, {});

        const transformedData = {
          lastName: name.split(' ')[1] || "",
          firstName: name.split(' ')[0] || "",
          nameExtn: "",
          middleName: "",
          lrn: lrn,
          birthdate: birthdate || "",
          sex: sex || "",
          credentialPresented: {
            kinderProgressReport: false,
            eccdChecklist: false,
            kindergartenCertificate: false,
            peptPasser: false,
            peptRating: "",
            examDate: "",
            otherSpecify: "",
          },
          nameOfSchool: "",
          schoolId: "",
          addressOfSchool: "",
          nameAndAddressOfTestingCenter: "",
          remark: "",

          scholasticRecords: Object.entries(gradesByLevel || {}).map(([gradeLevel, gradeRecords]) => {
            if (!gradeRecords || !Array.isArray(gradeRecords) || gradeRecords.length === 0) {
              return null;
            }

            const firstRecord = gradeRecords[0];
            
            const quarterMap = {
              '1st Quarter': 'q1',
              '2nd Quarter': 'q2',
              '3rd Quarter': 'q3',
              '4th Quarter': 'q4'
            };

            const record = {
              school: " Magallanes Agusan Del Norte",
              district: "Magallanes",
              division: "Agusan Del Norte",
              grade: gradeLevel,
              section: firstRecord?.section || "",
              adviser: firstRecord?.adviser || "",
              schoolId: "131485",
              schoolYear: firstRecord?.school_year || "",
              region: "Caraga",
              signature: firstRecord?.adviser_signature || "",

              grades: {
                "Mother Tongue": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Filipino": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "English": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Mathematics": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Science": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Araling Panlipunan": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "EPP / TLE": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "MAPEH": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Music": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Arts": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Physical Education": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Health": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "Eduk. sa Pagpapakatao": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "*Arabic Language": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "*Islamic Values Education": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
                "General Average": { q1: "", q2: "", q3: "", q4: "", final: "", remarks: "" },
              },

              remedial: {
                conductedFrom: "",
                conductedTo: "",
                subjects: [
                  { subject: "", finalRating: "", remedialMark: "", recomputedGrade: "", remarks: "" },
                  { subject: "", finalRating: "", remedialMark: "", recomputedGrade: "", remarks: "" },
                ],
              },
            };

            const subjectMap = {
              "Mother Tongue": "mother_tongue",
              "Filipino": "filipino",
              "English": "english",
              "Mathematics": "math",
              "Science": "science",
              "Araling Panlipunan": "ap",
              "EPP / TLE": "epp_tle",
              "MAPEH": "mapeh",
              "Music": "music",
              "Arts": "arts",
              "Physical Education": "pe",
              "Health": "health",
              "Eduk. sa Pagpapakatao": "ep",
              "*Arabic Language": "arabic",
              "*Islamic Values Education": "islamic",
              "General Average": "average"
            };

            gradeRecords.forEach(gradeRecord => {
              if (!gradeRecord || !gradeRecord.quarter) return;
              
              const quarter = quarterMap[gradeRecord.quarter];
              if (!quarter) return;

              Object.entries(subjectMap).forEach(([subjectName, dbColumn]) => {
                if (gradeRecord[dbColumn]) {
                  try {
                    record.grades[subjectName][quarter] = decryptData(gradeRecord[dbColumn]);
                  } catch (error) {
                    console.warn(`Error decrypting ${subjectName} for quarter ${quarter}:`, error);
                    record.grades[subjectName][quarter] = "";
                  }
                }
              });
            });


            Object.entries(record.grades).forEach(([subject, grades]) => {
              const quarters = [grades.q1, grades.q2, grades.q3, grades.q4];
              const validGrades = quarters.filter(grade => grade !== "" && !isNaN(grade));
              
              if (validGrades.length > 0) {
                const sum = validGrades.reduce((acc, grade) => acc + parseFloat(grade), 0);
                const average = Math.round(sum / validGrades.length);
                record.grades[subject].final = average.toString();
                record.grades[subject].remarks = average >= 75 ? "Passed" : "Failed";
              } else {
                record.grades[subject].final = "";
                record.grades[subject].remarks = "";
              }
            });

            return record;
          }).filter(record => record !== null),
        };

        setStudentData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError(error.message || 'Failed to fetch student data');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [location.state]);

  const handleSaveAsPDF = async () => {
    if (!formRef.current) return;

    try {
      const saveButton = document.getElementById("save-pdf-button");
      if (saveButton) {
        const originalText = saveButton.innerText;
        saveButton.innerText = "Generating PDF...";
        saveButton.disabled = true;

        const restoreButton = () => {
          saveButton.innerText = originalText;
          saveButton.disabled = false;
        };

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [215.9, 330.2],
        });

        const margin = {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        };

        const content = formRef.current;

        const allRecords = content.querySelectorAll('.school-record-table');
        const certificationBoxes = content.querySelectorAll('.certification-box');
        
        for (let i = 4; i < allRecords.length; i++) {
          allRecords[i].style.display = 'none';
        }
        certificationBoxes.forEach(box => {
          box.style.display = 'none';
        });

        const canvas1 = await html2canvas(content, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          allowTaint: true,
        });

        for (let i = 4; i < allRecords.length; i++) {
          allRecords[i].style.display = '';
        }
        certificationBoxes.forEach(box => {
          box.style.display = '';
        });
        for (let i = 0; i < 4; i++) {
          allRecords[i].style.display = 'none';
        }

        const canvas2 = await html2canvas(content, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          allowTaint: true,
        });

        for (let i = 0; i < 4; i++) {
          allRecords[i].style.display = '';
        }

        const contentWidth = pdf.internal.pageSize.getWidth() - margin.left - margin.right;
        const pageHeight = pdf.internal.pageSize.getHeight() - margin.top - margin.bottom;

        const imgData1 = canvas1.toDataURL("image/png");
        pdf.addImage(
          imgData1,
          "PNG",
          margin.left,
          margin.top,
          contentWidth,
          pageHeight
        );

        pdf.setFontSize(8);
        pdf.text(
          "Page 1 of 2",
          pdf.internal.pageSize.getWidth() - 25,
          pdf.internal.pageSize.getHeight() - 10
        );

        pdf.addPage();
        const imgData2 = canvas2.toDataURL("image/png");
        pdf.addImage(
          imgData2,
          "PNG",
          margin.left,
          margin.top,
          contentWidth,
          pageHeight
        );

        pdf.text(
          "Page 2 of 2",
          pdf.internal.pageSize.getWidth() - 25,
          pdf.internal.pageSize.getHeight() - 10
        );

        pdf.save(`SF10-ES_${studentData.lastName}_${studentData.firstName}.pdf`);
        restoreButton();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");

      const saveButton = document.getElementById("save-pdf-button");
      if (saveButton) {
        saveButton.innerText = "Save as PDF";
        saveButton.disabled = false;
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!studentData) {
    return <div>No student data found</div>;
  }

  return (
    <div className="bg-white p-4 max-w-[1000px] mx-auto text-xs font-serif">
      <div className="max-w-[1000px] mx-auto mt-4 flex justify-end gap-2 mb-5">
        <button
          id="save-pdf-button"
          onClick={handleSaveAsPDF}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Save as PDF
        </button>
        <button
          onClick={() => navigate('/academic-records')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="border border-black p-2" ref={formRef}>
        <div className="header-section">
          <div className="flex justify-between items-start mb-2">
            <div className="w-20 h-20 border border-gray-300 flex items-center justify-center">
              <img
                src="educ-logo.jpg"
                alt="DepEd Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>

            <div className="text-center flex-1">
              <p className="font-bold text-lg">Republic of the Philippines</p>
              <p className="font-bold text-lg">Department of Education</p>
            </div>

            <div className="w-20 h-20 border border-gray-300 flex items-center justify-center">
              <img
                src="deped.jpg"
                alt="Philippine Seal"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-lg font-bold mt-2">
              Learner's Permanent Academic Record for Elementary School
            </h1>
            <h2 className="text-lg font-bold">(SF10-ES)</h2>
          </div>
        </div>

        <div className="personal-info-section mt-4">
          <h3 className="font-bold border-t border-b border-black py-1 px-2 bg-gray-300 text-center">
            LEARNER'S PERSONAL INFORMATION
          </h3>
          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-4">
              <div className="flex">
                <span className="font-bold mr-1">LAST NAME:</span>
                <span className="flex-1 border-b">{studentData.lastName}</span>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex">
                <span className="font-bold mr-1">FIRST NAME:</span>
                <span className="flex-1 border-b">{studentData.firstName}</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex">
                <span className="font-bold mr-1">NAME EXTN. (Jr,I,II)</span>
                <span className="flex-1 border-b">{studentData.nameExtn}</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex">
                <span className="font-bold mr-1">MIDDLE NAME:</span>
                <span className="flex-1 border-b">{studentData.middleName}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-6">
              <div className="flex">
                <span className="font-bold mr-1">Learner Reference Number (LRN):</span>
                <span className="flex-1 border-b border-black">{studentData.lrn}</span>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex">
                <span className="font-bold mr-1">Birthdate (mm/dd/yyyy):</span>
                <span className="flex-1 border-b border-black">
                  {new Date(studentData.birthdate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex">
                <span className="font-bold mr-1">Sex:</span>
                <span className="flex-1 border-b border-black">{studentData.sex}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="eligibility-section mt-4">
          <h3 className="font-bold border-t border-b border-black py-1 px-2 bg-gray-300 text-center">
            ELIGIBILITY FOR ELEMENTARY SCHOOL ENROLMENT
          </h3>
          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-12">
              <div className="flex space-x-4">
                <span className="font-bold mr-1">Credential Presented for Grade 1:</span>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={studentData.credentialPresented.kinderProgressReport}
                    readOnly
                    className="mr-1"
                  />
                  <span>Kinder Progress Report</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={studentData.credentialPresented.eccdChecklist}
                    readOnly
                    className="mr-1"
                  />
                  <span>ECCD Checklist</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={studentData.credentialPresented.kindergartenCertificate}
                    readOnly
                    className="mr-1"
                  />
                  <span>Kindergarten Certificate of Completion</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1 mt-2 border-b">
            <div className="col-span-4">
              <div className="flex">
                <span className="font-bold mr-1">Name of School:</span>
                <span className="flex-1 border-b border-black">{studentData.nameOfSchool}</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex">
                <span className="font-bold mr-1">School ID:</span>
                <span className="flex-1 border-b border-black">{studentData.schoolId}</span>
              </div>
            </div>
            <div className="col-span-6">
              <div className="flex">
                <span className="font-bold mr-1">Address of School:</span>
                <span className="flex-1 border-b border-black">{studentData.addressOfSchool}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-12">
              <span className="font-bold">Other Credential Presented</span>
              <div className="flex space-x-4 mt-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={studentData.credentialPresented.peptPasser}
                    readOnly
                    className="mr-1"
                  />
                  <span>PEPT Passer</span>
                </label>
                <div className="flex">
                  <span className="mr-1">Rating:</span>
                  <span className="w-16 border-b border-black">
                    {studentData.credentialPresented.peptRating}
                  </span>
                </div>
                <div className="flex">
                  <span className="mr-1">Date of Examination/Assessment (mm/dd/yyyy):</span>
                  <span className="w-32 border-b border-black">
                    {studentData.credentialPresented.examDate
                      ? new Date(studentData.credentialPresented.examDate).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <div className="flex">
                  <span className="mr-1">Others (Pls. Specify):</span>
                  <span className="w-40 border-b border-black">
                    {studentData.credentialPresented.otherSpecify}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-8">
              <div className="flex">
                <span className="font-bold mr-1">Name and Address of Testing Center:</span>
                <span className="flex-1 border-b border-black">
                  {studentData.nameAndAddressOfTestingCenter}
                </span>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex">
                <span className="font-bold mr-1">Remark:</span>
                <span className="flex-1 border-b border-black">{studentData.remark}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="scholastic-record-section mt-4">
          <h3 className="font-bold border-t border-b border-black py-1 px-2 bg-gray-300 text-center">
            SCHOLASTIC RECORD
          </h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[1, 2, 3, 4, 5, 6].map((gradeNum) => {
              const gradeRecord = studentData.scholasticRecords.find(
                record => record.grade === `Grade ${gradeNum}`
              );
              return gradeRecord ? (
                <SchoolRecordTable 
                  key={`grade-${gradeNum}`} 
                  record={gradeRecord} 
                  index={gradeNum - 1} 
                />
              ) : (
                <EmptySchoolRecordTable 
                  key={`empty-grade-${gradeNum}`} 
                  index={gradeNum - 1} 
                  grade={`Grade ${gradeNum}`}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <EmptySchoolRecordTable index={6} grade="Grade 7" />
            <EmptySchoolRecordTable index={7} grade="Grade 8" />
          </div>

          <div className="mt-4 space-y-4">
            <EmptyCertificationBox index={0} />
            <EmptyCertificationBox index={1} />
            <EmptyCertificationBox index={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SchoolRecordTable = ({ record, index }) => {
  return (
    <div className={`school-record-table border border-black p-1`} id={`school-record-${index}`}>
      <div className="grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-8">
          <div className="flex items-center">
            <span className="font-bold mr-1">School:</span>
            <span className="border-b border-black flex-1">{record.school}</span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">School ID:</span>
            <span className="border-b border-black flex-1">{record.schoolId}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">District:</span>
            <span className="border-b border-black flex-1">{record.district}</span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Division:</span>
            <span className="border-b border-black flex-1">{record.division}</span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Region:</span>
            <span className="border-b border-black flex-1">{record.region}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Classified as Grade:</span>
            <span className="border-b border-black w-12">{record.grade}</span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Section:</span>
            <span className="border-b border-black flex-1">{record.section}</span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">School Year:</span>
            <span className="border-b border-black flex-1">{record.schoolYear}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className="flex items-center">
            <span className="font-bold mr-1">Name of Adviser/Teacher:</span>
            <span className="border-b border-black flex-1">{record.adviser}</span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Signature:</span>
            <span className="border-b border-black flex-1">{record.signature}</span>
          </div>
        </div>
      </div>

      <table className="w-full mt-2 border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-1 w-1/3 text-left">Learning Areas</th>
            <th className="border border-black p-1 w-1/3 text-center" colSpan={4}>
              Quarterly Rating
            </th>
            <th className="border border-black p-1 w-1/6 text-center">Final Rating</th>
            <th className="border border-black p-1 w-1/6 text-center">Remarks</th>
          </tr>
          <tr>
            <th className="border-l border-r border-black"></th>
            <th className="border border-black p-1 text-center w-8">1</th>
            <th className="border border-black p-1 text-center w-8">2</th>
            <th className="border border-black p-1 text-center w-8">3</th>
            <th className="border border-black p-1 text-center w-8">4</th>
            <th className="border-l border-r border-black"></th>
            <th className="border-l border-r border-black"></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(record.grades).map(([subject, grades]) => (
            <tr key={subject}>
              <td className="border border-black p-1">{subject}</td>
              <td className="border border-black p-1 text-center">{grades.q1}</td>
              <td className="border border-black p-1 text-center">{grades.q2}</td>
              <td className="border border-black p-1 text-center">{grades.q3}</td>
              <td className="border border-black p-1 text-center">{grades.q4}</td>
              <td className="border border-black p-1 text-center">{grades.final}</td>
              <td className="border border-black p-1 text-center">{grades.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2">
        <div className="flex justify-between items-center">
          <span className="font-bold">Remedial Classes</span>
          <div className="flex">
            <span>Date Conducted:</span>
            <span className="w-24 border-b border-black mx-1">
              {record.remedial.conductedFrom
                ? new Date(record.remedial.conductedFrom).toLocaleDateString()
                : ""}
            </span>
            <span>to</span>
            <span className="w-24 border-b border-black ml-1">
              {record.remedial.conductedTo
                ? new Date(record.remedial.conductedTo).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>

        <table className="w-full mt-1 border-collapse">
          <thead>
            <tr>
              <th className="border border-black p-1 text-left">Learning Areas</th>
              <th className="border border-black p-1 text-center">Final Rating</th>
              <th className="border border-black p-1 text-center">Remedial Class Mark</th>
              <th className="border border-black p-1 text-center">Recomputed Final Grade</th>
              <th className="border border-black p-1 text-center">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {record.remedial.subjects.map((subject, index) => (
              <tr key={index}>
                <td className="border border-black p-2">{subject.subject}</td>
                <td className="border border-black p-2 text-center">{subject.finalRating}</td>
                <td className="border border-black p-2 text-center">{subject.remedialMark}</td>
                <td className="border border-black p-2 text-center">{subject.recomputedGrade}</td>
                <td className="border border-black p-2 text-center">{subject.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmptySchoolRecordTable = ({ index, grade = "" }) => {
  return (
    <div className={`school-record-table border border-black p-1`} id={`empty-school-record-${index}`}>
      <div className="grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-8">
          <div className="flex items-center">
            <span className="font-bold mr-1">School:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">School ID:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">District:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Division:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Region:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Classified as Grade:</span>
            <span className="border-b border-black w-12">{grade}</span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Section:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">School Year:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className="flex items-center">
            <span className="font-bold mr-1">Name of Adviser/Teacher:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
        <div className="col-span-4">
          <div className="flex items-center">
            <span className="font-bold mr-1">Signature:</span>
            <span className="border-b border-black flex-1"></span>
          </div>
        </div>
      </div>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-1 w-1/3 text-left">Learning Areas</th>
            <th className="border border-black p-1 w-1/3 text-center" colSpan={4}>
              Quarterly Rating
            </th>
            <th className="border border-black p-1 w-1/6 text-center">Final Rating</th>
            <th className="border border-black p-1 w-1/6 text-center">Remarks</th>
          </tr>
          <tr>
            <th className="border-l border-r border-black"></th>
            <th className="border border-black p-1 text-center w-8">1</th>
            <th className="border border-black p-1 text-center w-8">2</th>
            <th className="border border-black p-1 text-center w-8">3</th>
            <th className="border border-black p-1 text-center w-8">4</th>
            <th className="border-l border-r border-black"></th>
            <th className="border-l border-r border-black"></th>
          </tr>
        </thead>
        <tbody>
          {[
            "Mother Tongue",
            "Filipino",
            "English",
            "Mathematics",
            "Science",
            "Araling Panlipunan",
            "EPP / TLE",
            "MAPEH",
            "Music",
            "Arts",
            "Physical Education",
            "Health",
            "Eduk. sa Pagpapakatao",
            "*Arabic Language",
            "*Islamic Values Education",
            "General Average",
          ].map((subject, index) => (
            <tr key={index}>
              <td className="border border-black p-1">{subject}</td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2">
        <div className="flex justify-between items-center">
          <span className="font-bold">Remedial Classes</span>
          <div className="flex">
            <span>Date Conducted:</span>
            <span className="w-24 border-b border-black mx-1"></span>
            <span>to</span>
            <span className="w-24 border-b border-black ml-1"></span>
          </div>
        </div>

        <table className="w-full mt-1 border-collapse">
          <thead>
            <tr>
              <th className="border border-black p-1 text-left">Learning Areas</th>
              <th className="border border-black p-1 text-center">Final Rating</th>
              <th className="border border-black p-1 text-center">Remedial Class Mark</th>
              <th className="border border-black p-1 text-center">Recomputed Final Grade</th>
              <th className="border border-black p-1 text-center">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
            </tr>
            <tr>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmptyCertificationBox = ({ index }) => {
  return (
    <div className={`certification-box border border-black p-2`} id={`empty-certification-${index}`}>
      <div className="text-center">
        <p className="font-bold">CERTIFICATION</p>
      </div>

      <div className="mt-2">
        <p>
          I CERTIFY that this is a true record of
          <span className="mx-1 border-b border-black inline-block w-40"></span>
          with LRN
          <span className="mx-1 border-b border-black inline-block w-32"></span>
          and that he/she is eligible for admission to Grade
          <span className="mx-1 border-b border-black inline-block w-8"></span>.
        </p>
      </div>

      <div className="mt-2">
        <div className="flex">
          <span>School Name:</span>
          <span className="flex-1 border-b border-black mx-1"></span>
        </div>

        <div className="flex justify-between">
          <div className="flex">
            <span>School ID</span>
            <span className="w-20 border-b border-black mx-1"></span>
          </div>

          <div className="flex">
            <span>Division:</span>
            <span className="w-20 border-b border-black mx-1"></span>
          </div>

          <div className="flex">
            <span>Last School Year Attended:</span>
            <span className="w-20 border-b border-black mx-1"></span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-between">
        <div>
          <span className="border-b border-black inline-block">sample</span>
          <p>Date</p>
        </div>

        <div className="mt-4 text-center">
          <div className="border-black pt-1 w-64 mx-auto">
            <p className="border-b"></p>
            <p>Name of Principal/School Head over Printed Name</p>
          </div>
        </div>

        <div className="text-center mt-13">
          <p>(Affix School Seal here)</p>
        </div>
      </div>
    </div>
  );
};

export default SF10Template;
