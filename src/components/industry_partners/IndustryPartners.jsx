import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Trash2, FilePenLine, MoreVertical, PlusCircle, AlertTriangle, XCircle } from "lucide-react";
import AddIndustryPartner from "../industry_partners/AddIndustryPartner";
import EditIndustryPartner from "../industry_partners/EditIndustryPartner";
import { useLocation } from "react-router-dom";

export default function IndustryPartners() {
  const role = localStorage.getItem("role");
  const notAdmin = role !== "User";
  const [industryPartners, setIndustryPartners] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ipToDelete, setIPToDelete] = useState(null);
  const [editingIndustryPartner, setEditingIndustryPartner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    date: "",
    business: "",
    validity: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";
  const searchId = location.state?.searchId || ""; // Get ID from search query
  const [displayedPartners, setDisplayedPartners] = useState([]); 

  useEffect(() => {
    if (loading) {
        const timer = setTimeout(() => {
            setLoading('');
        }, 3000);

        return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    fetchIndustryPartners();
  }, []);

  const confirmDelete = (partner) => {
    setIPToDelete(partner);
    setIsDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (searchQuery || searchId) {
      // Show only the matching entry (just like the business type filter)
      setDisplayedPartners(
        industryPartners.filter(item =>
          item.id.toString() === searchId.toString() || 
          item.company_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setDisplayedPartners(industryPartners); // Show all data when there's no search
    }
  }, [searchQuery, searchId, industryPartners]); 

  const fetchIndustryPartners = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/ip/getPartner");
      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return dateB - dateA;
      });
      setIndustryPartners(sortedData);
      setDisplayedPartners(sortedData)
    } catch (err) {
      console.error("Error fetching industry partners:", err);
      setError("Error fetching industry partners");
    } finally {
      setLoading(false);
    }
  };

  const industryPartnersPerPage = 8;

  const formatDate = (date) => {
    if (!date) return null; 
    return new Date(date).toISOString().split("T")[0]; 
  };

  // Apply filters
  const filteredData = industryPartners.filter((partner) => {
    const matchesDate = filters.date
      ? new Date(partner.year_included).getFullYear().toString() === filters.date
      : true;
    const matchesBusiness = filters.business
      ? partner.business_type?.toLowerCase().includes(filters.business.toLowerCase())
      : true;
    const matchesValidity = filters.validity
      ? partner.moa_status === filters.validity
      : true;

    return matchesDate && matchesBusiness && matchesValidity;
  });

  const totalPages = Math.ceil(industryPartners.length / industryPartnersPerPage);
  const startIndex = (currentPage - 1) * industryPartnersPerPage;
  const endIndex = startIndex + industryPartnersPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleNext = () => {
    const totalPages = Math.ceil((searchQuery || searchId ? displayedPartners.length : industryPartners.length) / industryPartnersPerPage);
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
    setFilters({ date: "", business: "", validity: "" });
    setCurrentPage(1);
  };

  const getValidityColor = (validity) => {
    switch (validity) {
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

  const handleEdit = (partner) => {
    setEditingIndustryPartner(partner);
    setIsEditModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDelete = async (id) => {

    if (!ipToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/ip/deletePartner/${ipToDelete.id}`);
      fetchIndustryPartners();
      setOpenDropdown(null);
      setIsDeleteModalOpen(false);
      setIPToDelete(null);
    } catch (error) {
      console.error("Error deleting Industry Partner:", error);
    }


  };

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handlePartnerAdded = () => {
    fetchIndustryPartners();
    setIsAddModalOpen(false);
  };

  const handlePartnerEdited = async () => {
    await fetchIndustryPartners();
    setIsEditModalOpen(false);
    setEditingIndustryPartner(null);
  };

  return (
    <div className="bg-gray-50 md:ml-[250px] mt-10 p-7 min-h-screen overflow-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 mt-3 text-center sm:text-left">
        Industry Partners
      </h1>
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-gray-50 border border-gray-200 rounded-lg p-3 w-full md:w-fit">
          {/* Filter Icon */}
          <div className="flex items-center">
            <i className="fas fa-filter text-black mr-2"></i>
            <span className="text-sm text-black">Filter by</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 border-r border-gray-300 mx-2"></div>

          {/* Year Filter */}
          <div className="md:ml-0 ml-auto">
            <DatePicker
              selected={filters.date ? new Date(filters.date) : null}
              onChange={(date) =>
                setFilters({ ...filters, date: date ? date.getFullYear().toString() : "" })
              }
              dateFormat="yyyy"
              showYearPicker
              className="block w-full md:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              placeholderText="Select Year"
              customInput={
                <button className="flex items-center w-full md:w-auto px-3 py-2 border rounded-md">
                  {filters.date ? filters.date : "Select Year"}
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
            value={filters.validity}
            onChange={(e) => setFilters({ ...filters, validity: e.target.value })}
            className="block w-full md:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              MOA Validity
            </option>
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
            className="w-full sm:w-auto px-2 py-2 text-red-700 rounded-md shadow-sm hover:bg-gray-200 flex items-center justify-center"
          >
            <i className="fas fa-undo mr-2 text-red-700"></i>
            Reset Filters
          </button>
          {notAdmin && (
            <button
              onClick={() => {
                setEditingIndustryPartner(null);
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto px-2 py-2 text-blue-600 rounded-md shadow-sm hover:bg-gray-200 flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Industry Partner
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow h-full mt-1 overflow-x-auto">
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
          <table className="min-w-full h-auto border-collapse mt-3 hidden md:table">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">COMPANY NAME</th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">TELEPHONE NUMBER</th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">FAX NUMBER</th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">COURSE</th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">COLLEGE</th>
                <th className="px-4 py-2 text-center border-b whitespace-nowrap">CAMPUS</th>
                <th className="px-2 py-2 text-center border-b whitespace-nowrap">YEAR SUBMITTED</th>
                <th className="px-2 py-2 text-center border-b whitespace-nowrap">MOA NOTARIZED</th>
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
            <tbody>
              {(searchQuery || searchId ? displayedPartners : currentData).map((partner, index) => (
                <tr key={partner.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.company_name}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.telephone}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.fax_number}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.preferred_courses}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.preferred_college}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.campus}</td>
                  <td className="px-2 py-2 border-t whitespace-nowrap">{partner.year_submitted}</td>
                  <td className="px-2 py-2 border-t whitespace-nowrap">{new Date(partner.with_moa_date_notarized).toLocaleDateString("en-CA")}</td>
                  <td className="px-2 py-2 border-t whitespace-nowrap">{new Date(partner.expiry_date).toLocaleDateString("en-CA")}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.business_type}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">
                    <span className={`rounded-full px-2 py-1 ${getValidityColor(partner.moa_status)}`}>
                      {partner.moa_status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.contact_person}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.contact_number}</td>
                  <td className="px-2 py-2 border-t whitespace-nowrap">{new Date(partner.year_included).toLocaleDateString("en-CA")}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.position_department}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.email_address}</td>
                  <td className="px-4 py-2 border-t whitespace-nowrap">{partner.office_address}</td>
                  <td className="px-2 py-2 border-t whitespace-nowrap">{partner.remarks}</td>
                  {notAdmin && (
                    <td className="px-1 py-2 border-t whitespace-nowrap relative">
                      <button onClick={() => toggleDropdown(partner.id)} className="text-gray-600">
                        <MoreVertical size={20} />
                      </button>
                      {openDropdown === partner.id && (
                        <div className="absolute right-5 w-40 bg-white border rounded shadow-lg z-10 bottom-0">
                          <button
                            onClick={() => handleEdit(partner)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <FilePenLine size={16} className="inline-block mr-2" />
                            Edit File
                          </button>
                          <button
                            onClick={() => confirmDelete(partner)}
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
        )}
      </div>

      {/* Mobile View (Cards) */}
      <div className="md:hidden">
        {(searchQuery || searchId ? displayedPartners : currentData).map((partner, index) => (
          <div key={partner.id} className={`border border-black p-4 mb-4 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 flex-1">
                <div className="font-bold italic break-all">{partner.company_name}</div>
                <div className={`px-4 rounded-full py-1 ${getValidityColor(partner.moa_status)}`}>
                  {partner.moa_status}
                </div>
              </div>
              {notAdmin && (
                <div className="relative ml-4">
                  <button onClick={() => toggleDropdown(partner.id)} className="p-1 hover:bg-gray-100 rounded-full">
                    <MoreVertical size={20} />
                  </button>
                  {openDropdown === partner.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                      <button
                        onClick={() => handleEdit(partner)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <FilePenLine size={16} className="inline-block mr-2" />
                        Edit File
                      </button>
                          <button
                            onClick={() => confirmDelete(partner)}
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
              <strong>ID:</strong> {partner.id}
            </div>
            <div className="mt-2">
              <strong>Telephone Number:</strong> {partner.telephone}
            </div>
            <div className="mt-2">
              <strong>Fax Number:</strong> {partner.fax_number}
            </div>
            <div className="mt-2">
              <strong>Nature of Business:</strong> {partner.business_type}
            </div>
            <div className="mt-2">
              <strong>Course:</strong> {partner.preferred_courses}
            </div>
            <div className="mt-2">
              <strong>College:</strong> {partner.preferred_college}
            </div>
            <div className="mt-2">
              <strong>Campus:</strong> {partner.campus}
            </div>
            <hr className="my-2" />
            <div className="mt-2 text-center">
              <strong>MOA</strong>
            </div>
            <hr className="my-2" />
            <div className="mt-2">
              <strong>Year Included:</strong> {new Date(partner.year_included).toLocaleDateString("en-CA")}
            </div>
            <div className="mt-2">
              <strong>Year Submitted:</strong> {partner.year_submitted}
            </div>
            <div className="mt-2">
              <strong>Moa Notarized:</strong> {new Date(partner.with_moa_date_notarized).toLocaleDateString("en-CA")}
            </div>
            <div className="mt-2">
              <strong>Expiry Date:</strong> {new Date(partner.expiry_date).toLocaleDateString("en-CA")}
            </div>
            <hr className="my-2" />
            <div className="mt-2 text-center">
              <strong>Contact Person</strong>
            </div>
            <hr className="my-2" />
            <div className="mt-2">
              <strong>Name:</strong> {partner.contact_person}
            </div>
            <div className="mt-2">
              <strong>Contact Number:</strong> {partner.contact_number}
            </div>
            <div className="mt-2 break-all">
              <strong>Email Address:</strong> {partner.email_address}
            </div>
            <div className="mt-2">
              <strong>Position:</strong> {partner.position_department}
            </div>
            <div className="mt-2">
              <strong>Office Address:</strong> {partner.office_address}
            </div>
            <div className="mt-2">
              <strong>Remarks:</strong> {partner.remarks}
            </div>
          </div>
        ))}
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
                Are you sure you want to delete <b>{ipToDelete?.company_name}</b>? 
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

          <AddIndustryPartner
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onPartnerAdded={handlePartnerAdded}
          />

          <EditIndustryPartner
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingIndustryPartner(null);
            }}
            industrypartnerData={editingIndustryPartner}
            onPartnerEdited={handlePartnerEdited}
          />


        {/* Showing Results Info */}
        <span className="text-gray-500 text-sm mt-2 md:mt-0">
          {searchQuery || searchId ? (
            <>
              Showing <b>{startIndex + 1}</b> to <b>{Math.min(endIndex, displayedPartners.length)}</b> of <b>{displayedPartners.length}</b> results for your search.
            </>
          ) : (
            <>
              Showing <b>{startIndex + 1}</b> to <b>{Math.min(endIndex, filteredData.length)}</b> of <b>{filteredData.length}</b>
            </>
          )}
        </span>
      </div>
    </div>
  </div>
  );
}

