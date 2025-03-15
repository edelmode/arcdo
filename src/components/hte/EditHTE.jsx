import React, { useState, useEffect } from "react";

const EditHTE = ({ isOpen, onClose, editingHTE, setEditingHTE, onHteEdited }) => {
  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError('');
        }, 3000);

        return () => clearTimeout(timer);
    }
  }, [error]); 

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !editingHTE) return null;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");

      const formatDate = (date) => {
        if (!date) return null; // Ensure null if no date is set
        return new Date(date).toISOString().split("T")[0]; // Format YYYY-MM-DD
      };

      const response = await fetch(`http://localhost:3001/api/hte/updateHte/${editingHTE.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: editingHTE.company_name,
          office_address: editingHTE.office_address,
          year_submitted: editingHTE.year_submitted,
          business_type: editingHTE.business_type,
          moa_status: editingHTE.moa_status,
          contact_person: editingHTE.contact_person,
          contact_number: editingHTE.contact_number,
          email_address: editingHTE.email_address,
          remarks: editingHTE.remarks,
          campus: editingHTE.campus,
          college: editingHTE.college,
          course: editingHTE.course,
          expiry_date: formatDate(editingHTE.expiry_date),
          position_department: editingHTE.position_department,
          with_moa_date_notarized: formatDate(editingHTE.with_moa_date_notarized),
          year_included: editingHTE.year_included,
          updated_at: new Date().toISOString() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update HTE');
      }

      onHteEdited();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-5 sm:mt-0 mt-20">
      <div className="bg-white p-6 rounded-lg w-full  sm:w-10/12 md:w-8/12 lg:w-6/12 max-h-[85vh] overflow-auto">
      <h2 className="text-xl font-semibold mb-4 items-center">Edit HTE</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={editingHTE.company_name}
              onChange={(e) => setEditingHTE({ ...editingHTE, company_name: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Company Name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Year Submitted</label>
              <input
                type="text"
                value={editingHTE.year_submitted}
                onChange={(e) => setEditingHTE({ ...editingHTE, year_submitted: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Year Submitted"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Business Type</label>
              <input
                type="text"
                value={editingHTE.business_type}
                onChange={(e) => setEditingHTE({ ...editingHTE, business_type: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Business Type"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">MOA Status</label>
              <select
                value={editingHTE.moa_status}
                onChange={(e) => setEditingHTE({ ...editingHTE, moa_status: e.target.value })}
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
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                value={editingHTE.contact_person}
                onChange={(e) => setEditingHTE({ ...editingHTE, contact_person: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Contact Person"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                value={editingHTE.contact_number}
                onChange={(e) => setEditingHTE({ ...editingHTE, contact_number: e.target.value })}
                className="w-full p-2 border rounded border-gray-500"
                placeholder="Contact Number"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={editingHTE.email_address}
              onChange={(e) => setEditingHTE({ ...editingHTE, email_address: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Email Address"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Office Address</label>
            <input
              type="text"
              value={editingHTE.office_address}
              onChange={(e) => setEditingHTE({ ...editingHTE, office_address: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Office Address"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={editingHTE.remarks}
              onChange={(e) => setEditingHTE({ ...editingHTE, remarks: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Remarks"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
            <label className="text-sm font-medium text-gray-700">
              Course
            </label>
            <input
              type="text"
              value={editingHTE.course}
              onChange={(e) => setEditingHTE({ ...editingHTE, course: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Course"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Campus
            </label>
            <select
              value={editingHTE.campus}
              onChange={(e) => setEditingHTE({ ...editingHTE, campus: e.target.value })}
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
            <label className="text-sm font-medium text-gray-700">
              College
            </label>
            <input
              type="text"
              value={editingHTE.college}
              onChange={(e) => setEditingHTE({ ...editingHTE, college: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="College"
            />
          </div>
        </div>



        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
            <label className="text-sm font-medium text-gray-700">
              Year Included
            </label>
            <input
              type="text"
              value={editingHTE.year_included}
              onChange={(e) => setEditingHTE({ ...editingHTE, year_included: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
              placeholder="Year Included"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              MOA Date Notarized
            </label>
            <input
              type="date"
              value={editingHTE.with_moa_date_notarized 
                ? new Date(editingHTE.with_moa_date_notarized).toISOString().split("T")[0] 
                : ""}
              onChange={(e) => setEditingHTE({ ...editingHTE, with_moa_date_notarized: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              value={editingHTE.expiry_date 
                ? new Date(editingHTE.expiry_date).toISOString().split("T")[0] 
                : ""}
              onChange={(e) => setEditingHTE({ ...editingHTE, expiry_date: e.target.value })}
              className="w-full p-2 border rounded border-gray-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHTE;
