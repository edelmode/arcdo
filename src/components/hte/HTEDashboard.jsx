import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { Trash2, FilePenLine, MoreVertical, PlusCircle, AlertTriangle, XCircle } from "lucide-react";
import AddHTE from "../hte/AddHTE";
import EditHTE from "../hte/EditHTE";
import { useLocation } from "react-router-dom";

export default function HTEDashboard() {
  const role = localStorage.getItem("role");
  const notAdmin = role !== "User";
  const [hte, sethte] = useState([ ]);
  const [editingHTE, setEditingHTE] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hteToDelete, setHteToDelete] = useState(null);
  const [filters, setFilters] = useState({
    date: "",
    business: "",
    moa_status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";
  const searchId = location.state?.searchId || ""; // Get ID from search query
  const [displayedHte, setDisplayedHte] = useState([]); 

  const [newHTE, setNewHTE] = useState({
      company_name: '',
      year_submitted: '',
      business_type: '',
      moa_status: 'Processing',
      contact_person: '',
      contact_number: '',
      remarks: '',
      year_included: '',
      position_department: '',
      course: '',
      campus: '',
      college: '',
      email_address: '',
      office_address: '',
      with_moa_date_notarized: '',
      expiry_date: '',
      status: 'Active'
    });

  useEffect(() => {
    if (loading) {
        const timer = setTimeout(() => {
            setLoading('');
        }, 3000);

        return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError('');
        }, 3000);

        return () => clearTimeout(timer);
    }
  }, [error]); 

  useEffect(() => {
    fetchHte();
  }, []);

  useEffect(() => {
    if (searchQuery || searchId) {
      // Show only the matching entry (just like the business type filter)
      setDisplayedHte(
        hte.filter(item =>
          item.id.toString() === searchId.toString() || 
          item.company_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setDisplayedHte(hte); // Show all data when there's no search
    }
  }, [searchQuery, searchId, hte]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchHte();
      } catch (error) {
        console.error("Error fetching hte:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const fetchHte = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/hte/getHte");
      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return dateB - dateA;
      });
      sethte(sortedData);
      setDisplayedHte(sortedData);
    } catch (error) {
      console.error("Error fetching hte:", error);
    }
  };  

  const handleEdit = (hte) => {
    setEditingHTE({...hte}); 
    setIsEditModalOpen(true);
    setOpenDropdown(null);
  };

  const confirmDelete = (hte) => {
    setHteToDelete(hte);
    setIsDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDelete = async () => {
    if (!hteToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/hte/deleteHte/${hteToDelete.id}`);
      fetchHte();
      setIsDeleteModalOpen(false);
      setHteToDelete(null);
    } catch (error) {
      console.error("Error deleting hte:", error);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const htesPerPage = 8;

  // Apply filters
  const filteredHte = hte.filter((hte) => {
    const matchesDate = filters.date
      ? hte.year_submitted === filters.date  // Compare exact year
      : true;
    const matchesBusiness = filters.business
      ? hte.business_type.toLowerCase().includes(filters.business.toLowerCase())
      : true;
    const matchesValidity = filters.moa_status
      ? hte.moa_status === filters.moa_status
      : true;

    return matchesDate && matchesBusiness && matchesValidity;
  });

  const totalPages = Math.ceil(filteredHte.length / htesPerPage);
  const startIndex = (currentPage - 1) * htesPerPage;
  const endIndex = startIndex + htesPerPage;
  const currentHte = filteredHte.slice(startIndex, endIndex);

  const handleNext = () => {
    const totalPages = Math.ceil((searchQuery || searchId ? displayedHte.length : filteredHte.length) / htesPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetFilters = () => {
    setFilters({ date: "", business: "", moa_status: "" });
    setCurrentPage(1);
  };

  const getValidityColor = (moa_status) => {
    switch (moa_status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Processing":
        return "bg-purple-100 text-purple-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      case "On Hold":
        return "bg-yellow-100 text-yellow-600";
      case "For Renewal":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  
  return (
    <div className="bg-gray-50 md:ml-[300px] mt-10 p-7 max-h-screen overflow-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 mt-3 text-center sm:text-left">
        Host Training Establishments
      </h1>
      
      {/* Filter Section */}
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-gray-50 border border-gray-200 rounded-lg p-3 w-full md:w-fit">
          <div className="flex items-center">
            <i className="fas fa-filter text-black mr-2"></i>
            <span className="text-sm text-black">Filter by</span>
          </div>
          <div className="hidden md:block h-6 border-r border-gray-300 mx-2"></div>
          <div className="md:ml-0 ml-auto"> 
            <DatePicker
                selected={filters.date ? new Date(filters.date) : null}
                onChange={(date) => setFilters({ ...filters, date: date ? date.getFullYear().toString() : "" })}
                dateFormat="yyyy"
                showYearPicker
                className="block w-full md:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                placeholderText="Select Year"
                customInput={
                  <button className="flex htes-center w-full md:w-auto px-3 py-2 border rounded-md justify-end sm:justify-start">
                    {filters.date ? filters.date : 'Select Year'}
                    <i className="ml-2 fas fa-chevron-down"></i>
                  </button>
                }
              />
          </div>

          {/* Business Filter */}
          <input
            placeholder="Nature of Business"
            type="text"
            value={filters.business}
            onChange={(e) => setFilters({ ...filters, business: e.target.value })}
            className="block w-full md:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          />

          {/* Validity Filter */}
          <select
            value={filters.moa_status}
            onChange={(e) => setFilters({ ...filters, moa_status: e.target.value })}
            className="block w-full md:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>MOA Validity</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="On Hold">On Hold</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Divider (Visible only on larger screens) */}
          <div className="hidden md:block h-6 border-r border-gray-300 mx-2"></div>

          {/* Reset Filters Button */}
          <button 
            onClick={resetFilters} 
            className="w-full sm:w-auto px-4 py-2 text-red-700 rounded-md shadow-sm hover:bg-gray-200 flex items-center justify-center">
              <i className="fas fa-undo mr-2 text-red-700"></i>
            Reset Filters
          </button>

          {notAdmin && (
            <button
              onClick={() => {
                setEditingHTE(null);
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2 text-blue-600 rounded-md shadow-sm hover:bg-gray-200 flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Add HTE
            </button>
          )}


        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow h-full mt-1 overflow-x-auto overflow-y-hidden block">
        {/* Responsive Wrapper for Table */}
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-lg font-semibold text-gray-700">Loading...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full h-auto border-collapse mt-3 hidden md:table">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">COMPANY NAME</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">COURSE</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">COLLEGE</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">CAMPUS</th>
                  <th className="px-2 py-2 text-center border-b whitespace-nowrap">YEAR SUBMITTED</th>
                  <th className="px-2 py-2 text-center border-b whitespace-nowrap">MOA NOTORIZED</th>
                  <th className="px-2 py-2 text-center border-b whitespace-nowrap">EXPIRY DATE</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">NATURE OF BUSINESS</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap border-r">MOA VALIDITY</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">CONTACT PERSON</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">CONTACT NUMBER</th>
                  <th className="px-2 py-2 text-center border-b whitespace-nowrap">YEAR INCLUDED</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">POSITION</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">EMAIL ADDRESS</th>
                  <th className="px-4 py-2 text-center border-b whitespace-nowrap">OFFICE ADDRESS</th>
                  <th className="px-2 py-2 text-center border-b whitespace-nowrap">REMARKS</th>
                  {notAdmin && (
                  <th className="px-1 py-2 text-center border-b whitespace-nowrap"></th>
                  )}
                </tr>
              </thead>
              <tbody >
                {(searchQuery || searchId ? displayedHte : currentHte).map((hte, index) => (
                  <tr 
                    key={hte.id} 
                    className={`md:table-row block w-full ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >        
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.company_name}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.course}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.college}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.campus}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.year_submitted}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{new Date(hte.with_moa_date_notarized).toLocaleDateString("en-CA")}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{new Date(hte.expiry_date).toLocaleDateString("en-CA")}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.business_type}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">
                      <span className={`rounded-full px-2 py-1 ${getValidityColor(hte.moa_status)}`}>
                        {hte.moa_status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.contact_person}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.contact_number}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.year_ncluded}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.position_department}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.email_address}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.office_address}</td>
                    <td className="px-4 py-2 border-t block md:table-cell whitespace-nowrap">{hte.remarks}</td>
                    {notAdmin && (
                    <td className="px-6 py-2 border-t relative">
                      <button onClick={() => toggleDropdown(hte.id)} className="text-gray-600">
                        <MoreVertical size={20} />
                      </button>
          
                      {openDropdown === hte.id && (
                        <div className="absolute right-10 bottom-0 w-40 bg-white border rounded shadow-lg z-10">
                          <button
                            onClick={() => handleEdit(hte)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <FilePenLine size={16} className="inline-block mr-2" />
                            Edit File
                          </button>
                          <button
                            onClick={() => confirmDelete(hte)}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 size={16} className="inline-block mr-2" />
                            Delete File
                          </button>
                        </div>
                      )}
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile View (Cards) */}
        <div className="md:hidden">
        {(searchQuery || searchId ? displayedHte : currentHte).map((hte, index) => (
                <div key={hte.id} className={`border border-black p-4 mb-4 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="font-bold italic break-all">{hte.company_name}</div>
                    <div className={`px-3 rounded-full py-1 text-sm ${getValidityColor(hte.moa_status)}`}>
                      {hte.moa_status}
                    </div>
                  </div>
                  {notAdmin && (
                  <div className="relative ml-4">
                    <button 
                      onClick={() => toggleDropdown(hte.id)} 
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openDropdown === hte.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        <button
                          onClick={() => handleEdit(hte)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          <FilePenLine size={16} className="inline-block mr-2" />
                          Edit File
                        </button>
                        <button
                          onClick={() => confirmDelete(hte)}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 size={16} className="inline-block mr-2" />
                          Delete File
                        </button>
                      </div>
                    )}
                  </div>
                  )}
                </div>
  
                  
                  <div className="mt-2">
                    <strong>ID:</strong> {hte.id}
                  </div>
                  <div className="mt-2">
                    <strong>Nature of Business:</strong> {hte.business_type}
                  </div>
                  <div className="mt-2">
                    <strong>Course:</strong> {hte.course}
                  </div>
                  <div className="mt-2">
                    <strong>College:</strong> {hte.college}
                  </div>
                  <div className="mt-2">
                    <strong>Campus:</strong> {hte.campus}
                  </div>
                  <hr className="my-2" />
                  <div className="mt-2 text-center">
                    <strong>MOA</strong> 
                  </div> <hr className="my-2" />
                  <div className="mt-2">
                    <strong>Year Included:</strong> {hte.year_included}
                  </div>
                  <div className="mt-2">
                    <strong>Year Submitted:</strong> {hte.year_submitted}
                  </div>
                  <div className="mt-2">
                    <strong>Moa Notorized:</strong> {new Date(hte.with_moa_date_notarized).toLocaleDateString("en-CA")}
                  </div>
                  <div className="mt-2">
                    <strong>Expiry Date:</strong> {new Date(hte.expiry_date).toLocaleDateString("en-CA")}
                  </div>
                  <hr className="my-2" />
                  <div className="mt-2 text-center">
                    <strong>Contact Person</strong> 
                  </div> <hr className="my-2" />
                  <div className="mt-2">
                    <strong>Name:</strong> {hte.contact_person}
                  </div>
                  <div className="mt-2">
                    <strong>Contact Number:</strong> {hte.contact_number}
                  </div>
                  <div className="mt-2 break-all">
                    <strong>Email Address:</strong> {hte.email_address}
                  </div>
                  <div className="mt-2">
                    <strong>Position:</strong> {hte.position_department}
                  </div>
                  <div className="mt-2">
                    <strong>Office Address:</strong> {hte.office_address}
                  </div>
                  <div className="mt-2">
                    <strong>Remarks:</strong> {hte.remarks}
                  </div>
                  
              </div>
                )
              )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium">Confirm Deletion</h3>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <b>{hteToDelete?.company_name}</b>? 
                This action cannot be undone.
              </p>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-3">
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevious} 
            disabled={currentPage === 1} 
            className="px-3 py-1 border rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            ←
          </button>

          <button 
            onClick={handleNext} 
            disabled={currentPage === totalPages} 
            className="px-3 py-1 border rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            →
          </button>
        

          <AddHTE
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onHTEAdded={() => {
              fetchHte();
              setIsAddModalOpen(false);
            }}
          />

          <EditHTE
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingHTE(null);
            }}
            editingHTE={editingHTE}
            setEditingHTE={setEditingHTE}
            onHteEdited={() => {
              fetchHte();
              setIsEditModalOpen(false);
              setEditingHTE(null);
            }}
          />

        {/* Showing Results Info */}
        <span className="text-gray-500 text-sm mt-2 md:mt-0">
          {searchQuery || searchId ? (
            <>
              Showing <b>{startIndex + 1}</b> to <b>{Math.min(endIndex, displayedHte.length)}</b> of <b>{displayedHte.length}</b> results for your search.
            </>
          ) : (
            <>
              Showing <b>{startIndex + 1}</b> to <b>{Math.min(endIndex, filteredHte.length)}</b> of <b>{filteredHte.length}</b>
            </>
          )}
        </span>
      </div>
      </div>
    </div>
  

    
  );
  
}