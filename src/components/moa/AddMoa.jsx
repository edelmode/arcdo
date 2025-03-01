import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, FileText } from "lucide-react";

const AddMoa = ({ isOpen, onClose, onMoaAdded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [newMoa, setNewMoa] = useState({
    company_name: "",
    address: "",
    business_type: "",
    moa_status: "Processing",
    expiration_date: "",
    year_moa_started: "",
    contact_person: "",
    contact_no: "",
    email: "",
    moa_draft_sent: "",
    remarks: "",
    type_of_moa: "",
    validity: "",
    date_notarized: ""
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

  const validateForm = () => {
    const requiredFields = [
      'company_name', 
      'address', 
      'business_type', 
      'moa_status', 
      'contact_person', 
      'contact_no', 
      'email', 
      'type_of_moa', 
    ];
    const missingFields = requiredFields.filter(field => !newMoa[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const formatDate = (date) => {
      if (!date) return null; 
      return new Date(date).toISOString().split("T")[0]; 
    };
  
    // Trim inputs before sending
    const trimmedMoa = {};
    for (let key in newMoa) {
      trimmedMoa[key] = newMoa[key].trim ? newMoa[key].trim() : newMoa[key];
    }
    trimmedMoa.contact_no = String(trimmedMoa.contact_no);
    trimmedMoa.moa_draft_sent = String(trimmedMoa.moa_draft_sent);
    trimmedMoa.created_at = new Date().toISOString();
  
    if (newMoa.date_notarized) {
      trimmedMoa.date_notarized = formatDate(newMoa.date_notarized);
    } else {
      trimmedMoa.date_notarized = null;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:3001/api/moa/addMoa",
        trimmedMoa
      );
      if (response.status === 201) {
        onMoaAdded(response.data);
        setNewMoa({
          company_name: "",
          address: "",
          business_type: "",
          moa_status: "Processing",
          expiration_date: "",
          year_moa_started: "",
          contact_person: "",
          contact_no: "",
          email: "",
          moa_draft_sent: "",
          remarks: "",
          type_of_moa: "",
          validity: "",
          date_notarized: ""
        });
        onClose();
      }
    } catch (error) {
      console.error("Error adding moa:", error);
      setError(error.response?.data?.error || "Failed to add moa");
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setnewMoa({ ...newMoa, file });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setnewMoa({ ...newMoa, file });
    }
  };
    

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-5 sm:mt-0 mt-20">
      <div className="bg-white p-6 rounded-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12 max-h-[85vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Add New MOA</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-extrabold text-gray-700">Company Name</label>
            <input
              type="text"
              value={newMoa.company_name}
              onChange={(e) => setNewMoa({ ...newMoa, company_name: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Enter Company Name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-extrabold text-gray-700">Type of MOA</label>
              <select
                value={newMoa.type_of_moa || ""}
                onChange={(e) => setNewMoa({ ...newMoa, type_of_moa: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
              >
                <option value="" disabled>Select Type of MOA</option>
                <option value="Practicum">Practicum</option>
                <option value="Research">Research</option>
                <option value="Employment">Employment</option>
                <option value="Scholarship">Scholarship</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-extrabold text-gray-700">Nature of Business</label>
              <input
                type="text"
                value={newMoa.business_type}
                onChange={(e) => setNewMoa({ ...newMoa, business_type: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Enter Nature of Business"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-extrabold text-gray-700">Company Address</label>
            <input
              type="text"
              value={newMoa.address}
              onChange={(e) => setNewMoa({ ...newMoa, address: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Enter Company Address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-extrabold text-gray-700">Contact Person Full Name</label>
              <input
                type="text"
                value={newMoa.contact_person}
                onChange={(e) => setNewMoa({ ...newMoa, contact_person: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Enter Full Name"
              />
            </div>

            <div>
              <label className="text-sm font-extrabold text-gray-700">Contact Number</label>
              <input
                type="number"
                value={newMoa.contact_no}
                onChange={(e) => setNewMoa({ ...newMoa, contact_no: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Contact Number"
              />
            </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-extrabold text-gray-700">Contact Person Position</label>
              <input
                type="number"
                value={newMoa.contact_no}
                onChange={(e) => setNewMoa({ ...newMoa, contact_no: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Enter Position"
              />
            </div>
            <div>
              <label className="text-sm font-extrabold text-gray-700">Email Address</label>
              <input
                type="email"
                value={newMoa.email}
                onChange={(e) => setNewMoa({ ...newMoa, email: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="email@domain.com"
              />
            </div>
            </div>

            <div>
              <label className="text-sm font-extrabold text-gray-700">MOA Satus</label>
              <select
                value={newMoa.moa_status}
                onChange={(e) => setNewMoa({ ...newMoa, moa_status: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
              >
                <option value="Processing">Processing</option>
                <option value="On Hold">On Hold</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
                <option value="For Renewal">For Renewal</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-extrabold text-gray-700">Validity</label>
            <input
              type="text"
              value={newMoa.validity}
              onChange={(e) => setNewMoa({ ...newMoa, validity: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Enter Years of Validity"
            />
          </div>


            <div>
              <label className="text-sm font-extrabold text-gray-700">MOA Date Notarized</label>
              <input
                type="date"
                value={newMoa.date_notarized}
                onChange={(e) => setNewMoa({ ...newMoa, date_notarized: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Date Notarized"
              />
            </div>

            <div>
              <label className="text-sm font-extrabold text-gray-700">Expiry Date</label>
              <input
                type="date"
                value={newMoa.expiration_date}
                onChange={(e) => setNewMoa({ ...newMoa, expiration_date: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
          <label className="text-sm font-extrabold text-gray-700">Branch</label>
          <select value={newMoa.moa_status}
                onChange={(e) => setnewMoa({ ...newMoa, moa_status: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
          >
            <option value="">Select Campus</option>
            <option value="Main">PUP Main</option>
            <option value="Bataan">PUP Bataan</option>
            <option value="Calauan">PUP Calauan</option>
            <option value="Lopez">PUP Lopez</option>
            <option value="Paranaque">PUP Paranaque</option>
            <option value="Quezon City">PUP Quezon City</option>
            <option value="Ragay">PUP Ragay</option>
            <option value="San Juan">PUP San Juan</option>
            <option value="Sto. Tomas">PUP Sto. Tomas</option>
            <option value="San Pedro">PUP San Pedro</option>
            <option value="Santa Rosa">PUP Santa Rosa</option>
            <option value="Taguig">PUP Taguig</option>
          </select>
          </div>

          <div>
              <label className="text-sm font-extrabold text-gray-700">Course</label>
              <input
                type="text"
                value={newMoa.contact_person}
                onChange={(e) => setnewMoa({ ...newMoa, contact_person: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Enter Course"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-extrabold text-gray-700">Remarks</label>
            <textarea
              value={newMoa.remarks}
              onChange={(e) => setNewMoa({ ...newMoa, remarks: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Remarks"
            />
          </div>

          {/* Upload File Section with Drag and Drop */}
 <div
        className={`border-2 border-dashed mt-4 rounded-lg p-6 text-center cursor-pointer transition-all ${
          dragActive ? "border-maroon-500 bg-maroon-50" : "border-gray-300 hover:border-maroon-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
        
        {newMoa.file ? (
          <div className="flex items-center justify-center space-x-2">
            <FileText size={24} className="text-maroon-600" />
            <p className="text-gray-700 text-sm font-medium">{newMoa.file.name}</p>
          </div>
        ) : (
          <label htmlFor="fileInput" className="flex flex-col items-center space-y-2">
            <Upload size={32} className="text-gray-500" />
            <p className="text-gray-600 text-sm">
              Drag & drop a file here, or <span className="text-maroon-600 font-semibold cursor-pointer">click to browse</span>
            </p>
            <p className="text-xs text-gray-400">Accepted formats: PDF, DOCX, JPG, PNG</p>
          </label>
        )}
      </div>

        {/* NDA Checkbox */}
        <div className="flex items-center mt-2 space-x-2">
              <input
                type="checkbox"
                id="hasNDA"
                name="hasNDA"
                className="w-4 h-4 text-maroon border-gray-300 rounded focus:ring-maroon"
              />
              <label htmlFor="hasNDA" className="font-medium text-gray-700 text-sm sm:text-base">
                Has Non-Disclosure Agreement (NDA)
              </label>
            </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50">
              Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMoa;