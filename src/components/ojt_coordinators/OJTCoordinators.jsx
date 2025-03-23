import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { Trash2, FilePenLine, MoreVertical, PlusCircle, AlertTriangle, XCircle } from "lucide-react";
import AddCoordinator from "../ojt_coordinators/AddCoordinator";
import EditCoordinator from "../ojt_coordinators/EditCoordinator";
import { useLocation } from "react-router-dom";

export default function OJTCoordinators() {
  const role = localStorage.getItem("role");
  const notAdmin = role !== "User";
  const [coordinators, setCoordinators] = useState([]);
  const [editingCoordinator, setEditingCoordinator] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ campus: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";
  const searchId = location.state?.searchId || ""; // Get ID from search query
  const [displayedCoordinator, setDisplayedCoordinator] = useState([]); 
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [newCoordinator, setNewCoordinator] = useState({
    name: '',
    campus: '',
    contact: '',
    college: '',
    office: '',
    assigned_student: '',
    status: 'Active'
  });

  useEffect(() => {
      fetchCoordinators();
    }, []);
  
  useEffect(() => {
    if (searchQuery || searchId) {
      // Show only the matching entry (just like the business type filter)
      setDisplayedCoordinator(
        coordinators.filter(item =>
          item.id.toString() === searchId.toString() || 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setDisplayedCoordinator(coordinators); // Show all data when there's no search
    }
  }, [searchQuery, searchId, coordinators]); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchCoordinators();
      } catch (error) {
        console.error("Error fetching coordinators:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const confirmDelete = (coordinator) => {
    setAdminToDelete(coordinator);
    setIsDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  const fetchCoordinators = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/coordinator/getCoordinators"
      );
      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateB - dateA;
      });
      setCoordinators(sortedData);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
    }
  };
  


  const handleEdit = (coordinator) => {
    setEditingCoordinator({ ...coordinator });
    setIsEditModalOpen(true);
    setOpenDropdown(null);
  };
  

  const handleDelete = async (id) => {
    if (!adminToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/coordinator/deleteCoordinator/${adminToDelete.id}`);
      fetchCoordinators();
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      setOpenDropdown(null);
    } catch (error) {
      console.error("Error deleting Coordinator:", error);
    }
  };
  


  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const itemsPerPage = 8;
  const filteredCoordinators = coordinators.filter((coordinator) => {
    return filters.campus
      ? coordinator.campus.toLowerCase() === filters.campus.toLowerCase()
      : true;
  });

  const totalPages = Math.ceil(filteredCoordinators.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoordinators = filteredCoordinators.slice(startIndex, endIndex);

  const handleNext = () => {
    const totalPages = Math.ceil((searchQuery || searchId ? displayedCoordinator.length : filteredCoordinators.length) / itemsPerPage);
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
    setFilters({ campus: "" });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "On Leave":
        return "bg-yellow-100 text-yellow-600";
      case "Retired":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  

  return (
    <div className="bg-gray-50 md:ml-[300px] mt-10 p-7 min-h-screen overflow-hidden">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 mt-3 text-center sm:text-left">
        OJT Coordinators
      </h1>
      
      {/* Filter Section */}
      <div className="mb-3">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 bg-gray-50 border border-gray-200 rounded-lg p-2 w-full sm:w-fit">
          <div className="flex items-center">
            <i className="fas fa-filter text-black mr-2"></i>
            <span className="text-sm text-black">Filter by</span>
          </div>
          <div className="hidden sm:block h-6 border-r border-gray-300"></div>
          <div className="w-full sm:w-auto">
            <select
              value={filters.campus}
              onChange={(e) => setFilters({ campus: e.target.value })}
              className="w-full sm:min-w-[120px] px-3 py-2 border rounded-md shadow-sm focus:outline-none"
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
          <div className="hidden sm:block h-6 border-r border-gray-300"></div>
          <button 
            onClick={resetFilters} 
            className="w-full sm:w-auto px-4 py-2 text-red-700 rounded-md shadow-sm hover:bg-gray-200 flex items-center justify-center"
          >
            <i className="fas fa-undo mr-2 text-red-700"></i>  
            Reset Filters
          </button>
          
          {notAdmin && (
            <button
              onClick={() => {
                setEditingCoordinator(null);
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2 text-blue-600 rounded-md shadow-sm hover:bg-gray-200 flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Coordinator
            </button>
          )}
        </div>
      </div>
     
      {/* Table Section */}
      <div className="flex-grow h-full mt-1 overflow-x-auto overflow-y-hidden">
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
              <tr className="bg-gray-100 text-center">
                <th className="px-4 py-2 text-left border-b">NAME</th>
                <th className="px-4 py-2 text-left border-b">CAMPUS</th>
                <th className="px-4 py-2 text-left border-b">COLLEGE</th>
                <th className="px-4 py-2 text-left border-b">EMAIL</th>
                <th className="px-4 py-2 text-left border-b">OFFICE</th>
                <th className="px-4 py-2 text-left border-b">ENROLLED STUDENTS</th>
                <th className="px-4 py-2 text-left border-b">STATUS</th>
                {notAdmin && (
                  <th className="px-4 py-2 text-left border-b"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {(searchQuery || searchId ? displayedCoordinator : currentCoordinators).map((coordinator, index) => (
                <tr
                  key={coordinator.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 border-t">{coordinator.name}</td>
                  <td className="px-4 py-2 border-t">{coordinator.campus}</td>
                  <td className="px-4 py-2 border-t">{coordinator.college}</td>
                  <td className="px-4 py-2 border-t">{coordinator.email}</td>
                  <td className="px-4 py-2 border-t">{coordinator.office}</td>
                  <td className="px-4 py-2 border-t">{coordinator.assigned_student}</td>
                  <td className={`px-4 border-t rounded-full inline-block py-1 mt-1 mb-2 text-center ${getStatusColor(coordinator.status)}`}>
                    {coordinator.status}
                  </td>
                  {notAdmin && (
                    <td className="px-6 py-2 border-t relative">
                      <button onClick={() => toggleDropdown(coordinator.id)} className="text-gray-600">
                        <MoreVertical size={20} />
                      </button>
                                
                      {openDropdown === coordinator.id && (
                        <div className="absolute right-10  w-40 bg-white border rounded shadow-lg z-10 bottom-0">
                          <button
                            onClick={() => handleEdit(coordinator)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <FilePenLine size={16} className="inline-block mr-2" />
                            Edit File
                          </button>
                          <button
                            onClick={() => confirmDelete(coordinator)}
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

      <AddCoordinator
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCoordinatorAdded={() => {
          fetchCoordinators();
          setIsAddModalOpen(false);
        }}
      />

      <EditCoordinator 
        isEditModalOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCoordinator(null);
        }} 
        editingCoordinator={editingCoordinator} 
        setEditingCoordinator={setEditingCoordinator}
        onCoordinatorEdited={() => {
          fetchCoordinators();
          setIsEditModalOpen(false);
          setEditingCoordinator(null);
        }}
      />



      {/* mobile view section */}
      <div className="md:hidden">
        {(searchQuery || searchId ? displayedCoordinator : currentCoordinators).map((coordinator, index) => (
                  <div key={coordinator.id} className={`border border-black p-4 mb-4 relative ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className="font-bold italic">{coordinator.name}</div>
                                  <div className={`px-3 rounded-full py-1 text-sm ${getStatusColor(coordinator.status)}`}>
                                    {coordinator.status}
                                  </div>
                                </div>
                                {notAdmin && (
                                  <div className="relative ml-4">
                                    <button 
                                      onClick={() => toggleDropdown(coordinator.id)} 
                                      className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                      <MoreVertical size={20} />
                                    </button>
                                    {openDropdown === coordinator.id && (
                                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                                        <button
                                          onClick={() => handleEdit(coordinator)}
                                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                          <FilePenLine size={16} className="inline-block mr-2" />
                                          Edit File
                                        </button>
                                        <button
                                          onClick={() => confirmDelete(coordinator)}
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
                                <strong>ID:</strong> {coordinator.id}
                              </div>
                              <div className="mt-2">
                                <strong>Campus:</strong> {coordinator.campus}
                              </div>
                              <div className="mt-2">
                                <strong>College:</strong> {coordinator.college}
                              </div>
                              <div className="mt-2">
                                <strong>Contact:</strong> {coordinator.email}
                              </div>
                              <div className="mt-2">
                                <strong>Office:</strong> {coordinator.office}
                              </div>
                              <div className="mt-2">
                                <strong>Enrolled Students:</strong> {coordinator.assigned_student}
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
                Are you sure you want to delete <b>{adminToDelete?.name}</b> as an OJT Coordinator? 
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


      {/* Pagination Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-3">
        <div className="flex space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-lg hover:bg-gray-200"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-lg hover:bg-gray-200 mr-2"
        >
          →
        </button>
        <span className="text-gray-500 text-sm mt-2 md:mt-0">
          {searchQuery || searchId ? (
            <>
              Showing <b>{startIndex + 1}</b> to <b>{Math.min(endIndex, displayedCoordinator.length)}</b> of <b>{displayedCoordinator.length}</b> results for your search.
            </>
          ) : (
            <>
              Showing <b>{startIndex + 1}</b> to <b>{Math.min(endIndex, filteredCoordinators.length)}</b> of{" "}
              <b>{filteredCoordinators.length}</b>
            </>
          )}
        </span>
      </div>
    </div>
    </div>

  );
}