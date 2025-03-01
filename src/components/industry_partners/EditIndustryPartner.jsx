import React, { useState, useEffect } from "react";

const EditIndustryPartner = ({ isOpen, onClose, industrypartnerData, onPartnerEdited }) => {
  const [industryPartner, setIndustryPartner] = useState({
    company_name: "",
    telephone: "",
    fax_number: "",
    business_type: "",
    moa_status: "",
    contact_person: "",
    contact_number: "",
    remarks: "",
    year_included: "",
    position_department: "",
    preferred_courses: "",
    preferred_college: "",
    email_address: "",
    office_address: "",
    with_moa_date_notarized: "",
    expiry_date: "",
  });

  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError('');
        }, 3000);

        return () => clearTimeout(timer);
    }
  }, [error]); 
  
  useEffect(() => {
    if (industrypartnerData) {
      setIndustryPartner({
        ...industrypartnerData,
        year_included: formatDateForDisplay(industrypartnerData.year_included),
        with_moa_date_notarized: formatDateForDisplay(industrypartnerData.with_moa_date_notarized),
        expiry_date: formatDateForDisplay(industrypartnerData.expiry_date),
      });
    }
  }, [industrypartnerData]);

  const formatDateForDisplay = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const formatDateForSubmission = (date) => {
    if (!date) return null;
    return date;
  };

  const handleSave = async () => {
    try {
      // Convert empty fields to NULL
      const fieldsToConvert = [
        "telephone",
        "fax_number",
        "business_type",
        "moa_status",
        "contact_person",
        "contact_number",
        "remarks",
        "year_included",
        "position_department",
        "preferred_courses",
        "preferred_college",
        "email_address",
        "office_address",
        "with_moa_date_notarized",
        "expiry_date",
      ];
  
      const updatedPartner = { ...industryPartner };
      fieldsToConvert.forEach((field) => {
        if (updatedPartner[field] === "") {
          updatedPartner[field] = null;
        }
      });

      // Format date fields for submission
      updatedPartner.year_included = formatDateForSubmission(updatedPartner.year_included);
      updatedPartner.with_moa_date_notarized = formatDateForSubmission(updatedPartner.with_moa_date_notarized);
      updatedPartner.expiry_date = formatDateForSubmission(updatedPartner.expiry_date);
  
      // Format updated_at for MySQL
      updatedPartner.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
      const response = await fetch(
        `http://localhost:3001/api/ip/updatePartner/${industryPartner.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPartner),
        }
      );
  
      if (response.ok) {
        if (onPartnerEdited) {
          onPartnerEdited();
        }
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update Industry Partner");
      }
    } catch (err) {
      console.error("Error updating Industry Partner:", err);
      setError("An error occurred while updating the Industry Partner");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-5 sm:mt-0 mt-20">
      <div className="bg-white p-6 rounded-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12 max-h-[85vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Industry Partner</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={industryPartner.company_name || ""}
              onChange={(e) => setIndustryPartner({ ...industryPartner, company_name: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Company Name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Telephone Number</label>
              <input
                type="text"
                value={industryPartner.telephone || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, telephone: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Telephone Number"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Fax Number</label>
              <input
                type="text"
                value={industryPartner.fax_number || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, fax_number: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Fax Number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Business Type</label>
              <input
                type="text"
                value={industryPartner.business_type || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, business_type: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Business Type"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">MOA Status</label>
              <select
                value={industryPartner.moa_status || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, moa_status: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
              >
                <option value="Processing">Processing</option>
                <option value="On Hold">On Hold</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
                <option value="For Renewal">For Renewal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                value={industryPartner.contact_person || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, contact_person: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Contact Person"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                value={industryPartner.contact_number || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, contact_number: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Contact Number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Position/Department</label>
              <input
                type="text"
                value={industryPartner.position_department || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, position_department: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Position or Department"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={industryPartner.email_address || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, email_address: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="email@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Office Address</label>
            <input
              type="text"
              value={industryPartner.office_address || ""}
              onChange={(e) => setIndustryPartner({ ...industryPartner, office_address: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Office Address"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={industryPartner.remarks || ""}
              onChange={(e) => setIndustryPartner({ ...industryPartner, remarks: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Remarks"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Course</label>
              <input
                type="text"
                value={industryPartner.preferred_courses || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, preferred_courses: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Course"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">College</label>
              <input
                type="text"
                value={industryPartner.preferred_college || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, preferred_college: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="College"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Year Included</label>
              <input
                type="date"
                value={industryPartner.year_included || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, year_included: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">MOA Date Notarized</label>
              <input
                type="date"
                value={industryPartner.with_moa_date_notarized || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, with_moa_date_notarized: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                value={industryPartner.expiry_date || ""}
                onChange={(e) => setIndustryPartner({ ...industryPartner, expiry_date: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditIndustryPartner;
