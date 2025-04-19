import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

// Mock data to simulate data coming from a database
const mockStudentData = {
  lastName: "Santos",
  firstName: "Juan",
  nameExtn: "Jr.",
  middleName: "Dela Cruz",
  lrn: "136428170048",
  birthdate: "2010-05-15",
  sex: "Male",
  credentialPresented: {
    kinderProgressReport: true,
    eccdChecklist: false,
    kindergartenCertificate: true,
    peptPasser: false,
    peptRating: "",
    examDate: "",
    otherSpecify: "",
  },
  nameOfSchool: "San Juan Elementary School",
  schoolId: "305428",
  addressOfSchool: "San Juan City, Metro Manila",
  nameAndAddressOfTestingCenter: "",
  remark: "Complete Requirements",

  // Scholastic records
  scholasticRecords: [
    {
      school: "San Juan Elementary School",
      district: "San Juan",
      division: "Metro Manila",
      grade: "1",
      section: "Sampaguita",
      adviser: "Ms. Maria Santos",
      schoolId: "305428",
      schoolYear: "2021-2022",
      region: "NCR",
      signature: "MSantos",

      // Grades
      grades: {
        "Mother Tongue": {
          q1: "85",
          q2: "87",
          q3: "88",
          q4: "90",
          final: "88",
          remarks: "Passed",
        },
        Filipino: {
          q1: "82",
          q2: "84",
          q3: "86",
          q4: "88",
          final: "85",
          remarks: "Passed",
        },
        English: {
          q1: "88",
          q2: "90",
          q3: "87",
          q4: "89",
          final: "89",
          remarks: "Passed",
        },
        Mathematics: {
          q1: "90",
          q2: "92",
          q3: "88",
          q4: "94",
          final: "91",
          remarks: "Passed",
        },
        Science: {
          q1: "86",
          q2: "88",
          q3: "90",
          q4: "92",
          final: "89",
          remarks: "Passed",
        },
        "Araling Panlipunan": {
          q1: "84",
          q2: "86",
          q3: "88",
          q4: "90",
          final: "87",
          remarks: "Passed",
        },
        "EPP / TLE": {
          q1: "88",
          q2: "90",
          q3: "92",
          q4: "94",
          final: "91",
          remarks: "Passed",
        },
        MAPEH: {
          q1: "90",
          q2: "92",
          q3: "94",
          q4: "96",
          final: "93",
          remarks: "Passed",
        },
        Music: {
          q1: "88",
          q2: "90",
          q3: "92",
          q4: "94",
          final: "91",
          remarks: "Passed",
        },
        Arts: {
          q1: "90",
          q2: "92",
          q3: "94",
          q4: "96",
          final: "93",
          remarks: "Passed",
        },
        "Physical Education": {
          q1: "92",
          q2: "94",
          q3: "96",
          q4: "98",
          final: "95",
          remarks: "Passed",
        },
        Health: {
          q1: "90",
          q2: "92",
          q3: "94",
          q4: "96",
          final: "93",
          remarks: "Passed",
        },
        "Eduk. sa Pagpapakatao": {
          q1: "88",
          q2: "90",
          q3: "92",
          q4: "94",
          final: "91",
          remarks: "Passed",
        },
        "*Arabic Language": {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          final: "",
          remarks: "",
        },
        "*Islamic Values Education": {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          final: "",
          remarks: "",
        },
        "General Average": {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          final: "90",
          remarks: "Passed",
        },
      },

      // Remedial classes
      remedial: {
        conductedFrom: "2022-04-10",
        conductedTo: "2022-05-15",
        subjects: [
          {
            subject: "Filipino",
            finalRating: "75",
            remedialMark: "80",
            recomputedGrade: "78",
            remarks: "Passed",
          },
          {
            subject: "",
            finalRating: "",
            remedialMark: "",
            recomputedGrade: "",
            remarks: "",
          },
        ],
      },
    },
    {
      school: "San Juan Elementary School",
      district: "San Juan",
      division: "Metro Manila",
      grade: "2",
      section: "Rosal",
      adviser: "Mr. Jose Reyes",
      schoolId: "305428",
      schoolYear: "2022-2023",
      region: "NCR",
      signature: "JReyes",

      // Grades
      grades: {
        "Mother Tongue": {
          q1: "87",
          q2: "89",
          q3: "90",
          q4: "92",
          final: "90",
          remarks: "Passed",
        },
        Filipino: {
          q1: "84",
          q2: "86",
          q3: "88",
          q4: "90",
          final: "87",
          remarks: "Passed",
        },
        English: {
          q1: "90",
          q2: "92",
          q3: "89",
          q4: "91",
          final: "91",
          remarks: "Passed",
        },
        Mathematics: {
          q1: "92",
          q2: "94",
          q3: "90",
          q4: "96",
          final: "93",
          remarks: "Passed",
        },
        Science: {
          q1: "88",
          q2: "90",
          q3: "92",
          q4: "94",
          final: "91",
          remarks: "Passed",
        },
        "Araling Panlipunan": {
          q1: "86",
          q2: "88",
          q3: "90",
          q4: "92",
          final: "89",
          remarks: "Passed",
        },
        "EPP / TLE": {
          q1: "90",
          q2: "92",
          q3: "94",
          q4: "96",
          final: "93",
          remarks: "Passed",
        },
        MAPEH: {
          q1: "92",
          q2: "94",
          q3: "96",
          q4: "98",
          final: "95",
          remarks: "Passed",
        },
        Music: {
          q1: "90",
          q2: "92",
          q3: "94",
          q4: "96",
          final: "93",
          remarks: "Passed",
        },
        Arts: {
          q1: "92",
          q2: "94",
          q3: "96",
          q4: "98",
          final: "95",
          remarks: "Passed",
        },
        "Physical Education": {
          q1: "94",
          q2: "96",
          q3: "98",
          q4: "99",
          final: "97",
          remarks: "Passed",
        },
        Health: {
          q1: "92",
          q2: "94",
          q3: "96",
          q4: "98",
          final: "95",
          remarks: "Passed",
        },
        "Eduk. sa Pagpapakatao": {
          q1: "90",
          q2: "92",
          q3: "94",
          q4: "96",
          final: "93",
          remarks: "Passed",
        },
        "*Arabic Language": {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          final: "",
          remarks: "",
        },
        "*Islamic Values Education": {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          final: "",
          remarks: "",
        },
        "General Average": {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          final: "92",
          remarks: "Passed",
        },
      },

      // Remedial classes
      remedial: {
        conductedFrom: "",
        conductedTo: "",
        subjects: [
          {
            subject: "",
            finalRating: "",
            remedialMark: "",
            recomputedGrade: "",
            remarks: "",
          },
          {
            subject: "",
            finalRating: "",
            remedialMark: "",
            recomputedGrade: "",
            remarks: "",
          },
        ],
      },
    },
  ],

  // Certification data
  certifications: [
    {
      studentName: "Juan Dela Cruz Santos Jr.",
      lrn: "136428170048",
      eligibleForGrade: "3",
      schoolName: "San Juan Elementary School",
      schoolId: "305428",
      division: "Metro Manila",
      lastSchoolYear: "2022-2023",
      principalName: "Dr. Elena Morales",
      date: "2023-04-15",
    },
  ],
};

const SF10Template = () => {
  const formRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPDF = async () => {
    if (!formRef.current) return;

    try {
      const saveButton = document.getElementById("save-pdf-button");
      if (saveButton) {
        const originalText = saveButton.innerText;
        saveButton.innerText = "Generating PDF...";
        saveButton.disabled = true;

        // Restore button state after completion
        const restoreButton = () => {
          saveButton.innerText = originalText;
          saveButton.disabled = false;
        };

        // Create a new jsPDF instance (Letter size in portrait orientation)
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "letter",
        });

        // Define PDF margins (in mm)
        const margin = {
          top: 10,
          right: 10,
          bottom: 15,
          left: 10,
        };

        // Get the content element
        const content = formRef.current;

        // Capture the form as a high-resolution image
        const canvas = await html2canvas(content, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          allowTaint: true,
        });

        // Calculate dimensions
        const contentWidth =
          pdf.internal.pageSize.getWidth() - margin.left - margin.right;
        const contentHeight =
          pdf.internal.pageSize.getHeight() - margin.top - margin.bottom;

        // Calculate the total height of the form based on aspect ratio
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Calculate how many pages we need
        const pageCount = Math.ceil(imgHeight / contentHeight);

        // Add each page
        for (let i = 0; i < pageCount; i++) {
          // Add a new page after the first page
          if (i > 0) {
            pdf.addPage();
          }

          // Calculate which portion of the image to use for this page
          const sourceY = i * (canvas.height / pageCount);
          const sourceHeight = canvas.height / pageCount;

          // Create a temporary canvas for this page section
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;

          // Draw the appropriate portion of the original canvas onto the temporary canvas
          const ctx = tempCanvas.getContext("2d");
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );

          // Add this section to the PDF
          const pageImgData = tempCanvas.toDataURL("image/png");
          pdf.addImage(
            pageImgData,
            "PNG",
            margin.left,
            margin.top,
            imgWidth,
            contentHeight
          );

          // Add page number
          pdf.setFontSize(8);
          pdf.text(
            `Page ${i + 1} of ${pageCount}`,
            pdf.internal.pageSize.getWidth() - 25,
            pdf.internal.pageSize.getHeight() - 10
          );
        }

        // Save the PDF
        pdf.save(
          `SF10-ES_${mockStudentData.lastName}_${mockStudentData.firstName}.pdf`
        );
        restoreButton();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");

      // Reset button state on error
      const saveButton = document.getElementById("save-pdf-button");
      if (saveButton) {
        saveButton.innerText = "Save as PDF";
        saveButton.disabled = false;
      }
    }
  };

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
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Print Form
        </button>
      </div>
      <div className="border border-black p-2" ref={formRef}>
        <div className="header-section">
          <div className="flex justify-between items-start mb-2">
            <div className="w-16 h-16 border border-gray-300 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=64&width=64"
                alt="DepEd Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>

            {/* Center Text */}
            <div className="text-center flex-1 px-4">
              <p className="font-bold">Republic of the Philippines</p>
              <p className="font-bold">Department of Education</p>
            </div>

            <div className="w-16 h-16 border border-gray-300 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=64&width=64"
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

        {/* Personal Information Section */}
        <div className="personal-info-section mt-4">
          <h3 className="font-bold border-t border-b border-black py-1 px-2 bg-gray-200">
            LEARNER'S PERSONAL INFORMATION
          </h3>
          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-4 border-b border-black">
              <div className="flex">
                <span className="font-bold mr-1">LAST NAME:</span>
                <span className="flex-1">{mockStudentData.lastName}</span>
              </div>
            </div>
            <div className="col-span-4 border-b border-black">
              <div className="flex">
                <span className="font-bold mr-1">FIRST NAME:</span>
                <span className="flex-1">{mockStudentData.firstName}</span>
              </div>
            </div>
            <div className="col-span-2 border-b border-black">
              <div className="flex">
                <span className="font-bold mr-1">NAME EXTN. (Jr,I,II)</span>
                <span className="flex-1">{mockStudentData.nameExtn}</span>
              </div>
            </div>
            <div className="col-span-2 border-b border-black">
              <div className="flex">
                <span className="font-bold mr-1">MIDDLE NAME:</span>
                <span className="flex-1">{mockStudentData.middleName}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-6">
              <div className="flex">
                <span className="font-bold mr-1">
                  Learner Reference Number (LRN):
                </span>
                <span className="flex-1 border-b border-black">
                  {mockStudentData.lrn}
                </span>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex">
                <span className="font-bold mr-1">Birthdate (mm/dd/yyyy):</span>
                <span className="flex-1 border-b border-black">
                  {new Date(mockStudentData.birthdate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex">
                <span className="font-bold mr-1">Sex:</span>
                <span className="flex-1 border-b border-black">
                  {mockStudentData.sex}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Section */}
        <div className="eligibility-section mt-4">
          <h3 className="font-bold border-t border-b border-black py-1 px-2 bg-gray-200">
            ELIGIBILITY FOR ELEMENTARY SCHOOL ENROLMENT
          </h3>
          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-12">
              <span className="font-bold mr-1">
                Credential Presented for Grade 1:
              </span>
              <div className="flex space-x-4 mt-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      mockStudentData.credentialPresented.kinderProgressReport
                    }
                    readOnly
                    className="mr-1"
                  />
                  <span>Kinder Progress Report</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={mockStudentData.credentialPresented.eccdChecklist}
                    readOnly
                    className="mr-1"
                  />
                  <span>ECCD Checklist</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      mockStudentData.credentialPresented
                        .kindergartenCertificate
                    }
                    readOnly
                    className="mr-1"
                  />
                  <span>Kindergarten Certificate of Completion</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-6">
              <div className="flex">
                <span className="font-bold mr-1">Name of School:</span>
                <span className="flex-1 border-b border-black">
                  {mockStudentData.nameOfSchool}
                </span>
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex">
                <span className="font-bold mr-1">School ID:</span>
                <span className="flex-1 border-b border-black">
                  {mockStudentData.schoolId}
                </span>
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex">
                <span className="font-bold mr-1">Address of School:</span>
                <span className="flex-1 border-b border-black">
                  {mockStudentData.addressOfSchool}
                </span>
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
                    checked={mockStudentData.credentialPresented.peptPasser}
                    readOnly
                    className="mr-1"
                  />
                  <span>PEPT Passer</span>
                </label>
                <div className="flex">
                  <span className="mr-1">Rating:</span>
                  <span className="w-16 border-b border-black">
                    {mockStudentData.credentialPresented.peptRating}
                  </span>
                </div>
                <div className="flex">
                  <span className="mr-1">
                    Date of Examination/Assessment (mm/dd/yyyy):
                  </span>
                  <span className="w-32 border-b border-black">
                    {mockStudentData.credentialPresented.examDate
                      ? new Date(
                          mockStudentData.credentialPresented.examDate
                        ).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <div className="flex">
                  <span className="mr-1">Others (Pls. Specify):</span>
                  <span className="w-40 border-b border-black">
                    {mockStudentData.credentialPresented.otherSpecify}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1 mt-2">
            <div className="col-span-8">
              <div className="flex">
                <span className="font-bold mr-1">
                  Name and Address of Testing Center:
                </span>
                <span className="flex-1 border-b border-black">
                  {mockStudentData.nameAndAddressOfTestingCenter}
                </span>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex">
                <span className="font-bold mr-1">Remark:</span>
                <span className="flex-1 border-b border-black">
                  {mockStudentData.remark}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scholastic Record Section */}
        <div className="scholastic-record-section mt-4">
          <h3 className="font-bold border-t border-b border-black py-1 px-2 bg-gray-200">
            SCHOLASTIC RECORD
          </h3>

          {/* School Records */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {mockStudentData.scholasticRecords
              .slice(0, 2)
              .map((record, index) => (
                <SchoolRecordTable key={index} record={record} index={index} />
              ))}
          </div>

          {/* Additional empty school records to match the template */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <EmptySchoolRecordTable index={2} />
            <EmptySchoolRecordTable index={3} />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <EmptySchoolRecordTable index={4} />
            <EmptySchoolRecordTable index={5} />
          </div>

          {/* Certification Section */}
          <div className="mt-4 space-y-4">
            {mockStudentData.certifications.map((cert, index) => (
              <CertificationBox
                key={index}
                certification={cert}
                index={index}
              />
            ))}
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
    <div
      className={`school-record-table border border-black p-1`}
      id={`school-record-${index}`}
    >
      <div className="grid grid-cols-12 gap-1">
        <div className="col-span-12">
          <div className="flex">
            <span className="font-bold mr-1">School:</span>
            <span className="flex-1 border-b border-black">
              {record.school}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-4">
          <div className="flex">
            <span className="font-bold mr-1">District:</span>
            <span className="flex-1 border-b border-black">
              {record.district}
            </span>
          </div>
        </div>
        <div className="col-span-8">
          <div className="flex">
            <span className="font-bold mr-1">Division:</span>
            <span className="flex-1 border-b border-black">
              {record.division}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">Classified as Grade:</span>
            <span className="w-8 border-b border-black">{record.grade}</span>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">Section:</span>
            <span className="flex-1 border-b border-black">
              {record.section}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-12">
          <div className="flex">
            <span className="font-bold mr-1">Name of Adviser/Teacher:</span>
            <span className="flex-1 border-b border-black">
              {record.adviser}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-3 text-center">
          <div className="flex justify-around">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">School ID:</span>
            <span className="flex-1 border-b border-black">
              {record.schoolId}
            </span>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">School Year:</span>
            <span className="flex-1 border-b border-black">
              {record.schoolYear}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">Region:</span>
            <span className="flex-1 border-b border-black">
              {record.region}
            </span>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">Signature:</span>
            <span className="flex-1 border-b border-black">
              {record.signature}
            </span>
          </div>
        </div>
      </div>

      {/* Learning Areas Table */}
      <table className="w-full mt-2 border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-1 w-1/3 text-left">
              Learning Areas
            </th>
            <th
              className="border border-black p-1 w-1/3 text-center"
              colSpan={4}
            >
              Quarterly Rating
            </th>
            <th className="border border-black p-1 w-1/6 text-center">
              Final Rating
            </th>
            <th className="border border-black p-1 w-1/6 text-center">
              Remarks
            </th>
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
              <td className="border border-black p-1 text-center">
                {record.grades[subject]?.q1 || ""}
              </td>
              <td className="border border-black p-1 text-center">
                {record.grades[subject]?.q2 || ""}
              </td>
              <td className="border border-black p-1 text-center">
                {record.grades[subject]?.q3 || ""}
              </td>
              <td className="border border-black p-1 text-center">
                {record.grades[subject]?.q4 || ""}
              </td>
              <td className="border border-black p-1 text-center">
                {record.grades[subject]?.final || ""}
              </td>
              <td className="border border-black p-1 text-center">
                {record.grades[subject]?.remarks || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Remedial Classes */}
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
              <th className="border border-black p-1 text-left">
                Learning Areas
              </th>
              <th className="border border-black p-1 text-center">
                Final Rating
              </th>
              <th className="border border-black p-1 text-center">
                Remedial Class Mark
              </th>
              <th className="border border-black p-1 text-center">
                Recomputed Final Grade
              </th>
              <th className="border border-black p-1 text-center">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {record.remedial.subjects.map((subject, index) => (
              <tr key={index}>
                <td className="border border-black p-1">{subject.subject}</td>
                <td className="border border-black p-1 text-center">
                  {subject.finalRating}
                </td>
                <td className="border border-black p-1 text-center">
                  {subject.remedialMark}
                </td>
                <td className="border border-black p-1 text-center">
                  {subject.recomputedGrade}
                </td>
                <td className="border border-black p-1 text-center">
                  {subject.remarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmptySchoolRecordTable = ({ index }) => {
  return (
    <div
      className={`school-record-table border border-black p-1`}
      id={`empty-school-record-${index}`}
    >
      <div className="grid grid-cols-12 gap-1">
        <div className="col-span-12">
          <div className="flex">
            <span className="font-bold mr-1">School:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-4">
          <div className="flex">
            <span className="font-bold mr-1">District:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
        <div className="col-span-8">
          <div className="flex">
            <span className="font-bold mr-1">Division:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">Classified as Grade:</span>
            <span className="w-8 border-b border-black"></span>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">Section:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-12">
          <div className="flex">
            <span className="font-bold mr-1">Name of Adviser/Teacher:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-3 text-center">
          <div className="flex justify-around">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">School ID:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">School Year:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-1">
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">Region:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex">
            <span className="font-bold mr-1">Signature:</span>
            <span className="flex-1 border-b border-black"></span>
          </div>
        </div>
      </div>

      {/* Learning Areas Table */}
      <table className="w-full mt-2 border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-1 w-1/3 text-left">
              Learning Areas
            </th>
            <th
              className="border border-black p-1 w-1/3 text-center"
              colSpan={4}
            >
              Quarterly Rating
            </th>
            <th className="border border-black p-1 w-1/6 text-center">
              Final Rating
            </th>
            <th className="border border-black p-1 w-1/6 text-center">
              Remarks
            </th>
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

      {/* Remedial Classes */}
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
              <th className="border border-black p-1 text-left">
                Learning Areas
              </th>
              <th className="border border-black p-1 text-center">
                Final Rating
              </th>
              <th className="border border-black p-1 text-center">
                Remedial Class Mark
              </th>
              <th className="border border-black p-1 text-center">
                Recomputed Final Grade
              </th>
              <th className="border border-black p-1 text-center">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
            </tr>
            <tr>
              <td className="border border-black p-1"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
              <td className="border border-black p-1 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CertificationBox = ({ certification, index }) => {
  return (
    <div
      className={`certification-box border border-black p-2`}
      id={`certification-${index}`}
    >
      <div className="text-center">
        <p className="font-bold">CERTIFICATION</p>
      </div>

      <div className="mt-2">
        <p>
          I CERTIFY that this is a true record of
          <span className="mx-1 border-b border-black inline-block w-40 text-center">
            {certification.studentName}
          </span>
          with LRN
          <span className="mx-1 border-b border-black inline-block w-32 text-center">
            {certification.lrn}
          </span>
          and that he/she is eligible for admission to Grade
          <span className="mx-1 border-b border-black inline-block w-8 text-center">
            {certification.eligibleForGrade}
          </span>
          .
        </p>
      </div>

      <div className="mt-2">
        <div className="flex">
          <span>School Name:</span>
          <span className="flex-1 border-b border-black mx-1">
            {certification.schoolName}
          </span>
        </div>

        <div className="flex justify-between">
          <div className="flex">
            <span>School ID</span>
            <span className="w-20 border-b border-black mx-1">
              {certification.schoolId}
            </span>
          </div>

          <div className="flex">
            <span>Division:</span>
            <span className="w-20 border-b border-black mx-1">
              {certification.division}
            </span>
          </div>

          <div className="flex">
            <span>Last School Year Attended:</span>
            <span className="w-20 border-b border-black mx-1">
              {certification.lastSchoolYear}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="border-t border-black pt-1 w-64 mx-auto">
          <p>{certification.principalName}</p>
          <p>Name of Principal/School Head over Printed Name</p>
        </div>
      </div>

      <div className="mt-2 flex justify-between">
        <div>
          <p>Date</p>
          <span className="border-b border-black inline-block">
            {certification.date
              ? new Date(certification.date).toLocaleDateString()
              : ""}
          </span>
        </div>

        <div className="text-center">
          <p>(Affix School Seal here)</p>
          <div className="w-24 h-24 border border-dashed border-black mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

const EmptyCertificationBox = ({ index }) => {
  return (
    <div
      className={`certification-box border border-black p-2`}
      id={`empty-certification-${index}`}
    >
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

      <div className="mt-4 text-center">
        <div className="border-t border-black pt-1 w-64 mx-auto">
          <p>Name of Principal/School Head over Printed Name</p>
        </div>
      </div>

      <div className="mt-2 flex justify-between">
        <div>
          <p>Date</p>
          <span className="border-b border-black inline-block"></span>
        </div>

        <div className="text-center">
          <p>(Affix School Seal here)</p>
          <div className="w-24 h-24 border border-dashed border-black mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SF10Template;
