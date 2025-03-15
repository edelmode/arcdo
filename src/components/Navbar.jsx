import React, { useState, useRef, useEffect } from "react";
import {
  Sun,
  RotateCcw,
  Search,
  Settings,
  FileText, // You can add this if needed for the Export icon
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

export default function NavbarTopConfigurationPage() {
  const role = localStorage.getItem("role");
  const canExport = role !== "User";
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false); // For controlling the export dropdown
  const [searchQuery, setSearchQuery] = useState(""); 
  const settingsMenuRef = useRef(null);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const defaultPage = "ARCDO";
  const currentPage =
    pathSegments.length > 0 ? pathSegments[pathSegments.length - 1].toUpperCase() : "";
  
  // Check if current page is overview
  const isOverviewPage = location.pathname.includes('/overview');
  const isDeveloperPage = location.pathname.includes('/about-the-developer');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setIsSettingsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageFromPath = (pathname) => {
    const path = pathname.toLowerCase();
    if (path.includes('industry-partners')) {
      return 'INDUSTRYPARTNERS';
    } else if (path.includes('moas')) {
      return 'MOAS';
    } else if (path.includes('ojt-coordinators')) {
      return 'COORDINATORS';
    } else if (path.includes('hte')) {
      return 'HTE';
    }
    return '';
  };

  useEffect(() => {
    fetchAllData(); 
    fetchDataForCurrentPage();
    setSearchQuery(""); 
    setFilteredData([]); 
  }, [location.pathname]); 
  
  const [allData, setAllData] = useState([]); 
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  const fetchAllData = async () => {
    try {
      const [hteRes, moaRes, ipRes, coordRes] = await Promise.all([
        axios.get("http://localhost:3001/api/hte/getHte"),
        axios.get("http://localhost:3001/api/moa/getMoa"),
        axios.get("http://localhost:3001/api/ip/getPartner"),
        axios.get("http://localhost:3001/api/coordinator/getCoordinators"),
      ]);
  
      // Add a type field to differentiate records
      const combinedData = [
        ...hteRes.data.map(item => ({ ...item, type: "HTE" })),
        ...moaRes.data.map(item => ({ ...item, type: "MOA" })),
        ...ipRes.data.map(item => ({ ...item, type: "Industry Partner" })),
        ...coordRes.data.map(item => ({ ...item, type: "OJT Coordinator" })),
      ];
  
      setAllData(combinedData); // Store full dataset for global search
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  
    if (!query) {
      setFilteredData(originalData); // Reset to original data when query is empty
      return;
    }
  
    // Filter across all entities
    const filtered = allData.filter((item) => {
      if (item.company_name) {
        return item.company_name.toLowerCase().includes(query.toLowerCase());
      } else if (item.name) {
        return item.name.toLowerCase().includes(query.toLowerCase());
      }
      return false;
    });
  
    setFilteredData(filtered);
  };
  

  useEffect(() => {
    fetchDataForCurrentPage();
  }, [location.pathname]); // Fetch data when the page changes

  const fetchDataForCurrentPage = async () => {
    try {
      const currentPath = getPageFromPath(location.pathname);
      let endpoint = "";

      switch (currentPath) {
        case "INDUSTRYPARTNERS":
          endpoint = "http://localhost:3001/api/ip/getPartner";
          break;
        case "MOAS":
          endpoint = "http://localhost:3001/api/moa/getMoa";
          break;
        case "HTE":
          endpoint = "http://localhost:3001/api/hte/getHte";
        break;
        case "COORDINATORS":
          endpoint = "http://localhost:3001/api/coordinator/getCoordinators";
          break;
        default:
          return;
      }

      const response = await axios.get(endpoint);
      setOriginalData(response.data); // Store the full dataset
      setFilteredData(response.data); // Set initial filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  

  const handleSearchClick = (item) => {
    let pagePath = "";
    
    switch (item.type) {
      case "HTE":
        pagePath = "/hte";
        break;
      case "MOA":
        pagePath = "/moas";
        break;
      case "Industry Partner":
        pagePath = "/industry-partners";
        break;
      case "OJT Coordinator":
        pagePath = "/OJT-coordinators";
        break;
      default:
        pagePath = "/"; // Fallback
    }
  
    navigate(pagePath, { 
      state: { 
        searchQuery: item.company_name || item.name,
        searchId: item.id
      } 
    }); // Send searchQuery

    // Clear search state after navigation
    setSearchQuery("");
    setFilteredData([]);
  };
  

  const verifyToken = async (token) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-token', { token });
      return response.status === 200;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  const handleRefreshClick = () => {
    window.location.reload();
  };

  const handleExportClick = async (type) => {
    try {
      const currentPath = getPageFromPath(location.pathname);
      let endpoint = '';
      let filename = '';
      let title = '';
      
      switch(currentPath) {
        case 'INDUSTRYPARTNERS':
          endpoint = 'http://localhost:3001/api/ip/getPartner';
          filename = 'industry_partners';
          title = 'Industry Partners List';
          break;
        case 'MOAS':
          endpoint = 'http://localhost:3001/api/moa/getMoa';
          filename = 'moa_list';
          title = 'MOA List';
          break;
        case 'COORDINATORS':
          endpoint = 'http://localhost:3001/api/coordinator/getCoordinators'; // Corrected endpoint
          filename = 'ojt_coordinators';
          title = 'OJT Coordinators List';
          break;
        case 'HTE':
          endpoint = 'http://localhost:3001/api/hte/getHte';
          filename = 'hte_list';
          title = 'HTE List';
          break;
        default:  
          console.error('Unknown page for export:', location.pathname);
          return;
      }

      console.log('Exporting from endpoint:', endpoint); // Debug log

      const response = await axios.get(endpoint);
      const data = response.data;

      if (type === 'Excel') {
        exportToExcel(data, filename);
      } else if (type === 'PDF') {
        exportToPDF(data, title, filename, currentPath);
      }
      
      setIsExportOpen(false);
    } catch (error) {
      console.error('Error fetching data for export:', error);
    }
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const exportToPDF = (data, title, filename, currentPath) => {
    const doc = new jsPDF({ orientation: 'landscape', format: 'a3' });

    let tableColumn = [];
    let tableRows = [];

    switch(currentPath) {
      case 'INDUSTRYPARTNERS':
        tableColumn = [
          "ID", 
          "Company Name", 
          "Business Type", 
          "Campus", 
          "Contact Person",
          "Contact Number", 
          "Email", 
          "Expiry Date", 
          "MOA Status",
          "Office Address", 
          "Position", 
          "College", 
          "Courses", 
          "Remarks",
          "Telephone", 
          "MOA Notarized", 
        ];
        tableRows = data.map(item => [
          item.id, 
          item.company_name, 
          item.business_type, 
          item.campus,
          item.contact_person, 
          item.contact_number, 
          item.email_address,
          item.expiry_date, 
          item.moa_status,
          item.office_address, 
          item.position_department, 
          item.preferred_college,
          item.preferred_courses, 
          item.remarks, 
          item.telephone,
          item.with_moa_date_notarized, 
        ]);
        break;
      case 'MOAS':
        tableColumn = [
          "ID", "Company Name", "Address", "Business Type", "Status",
          "Expiration Date", "MOA Started", "Contact Person", "Contact No",
          "Email", "Draft Sent", "Remarks", "Type", "Validity", "Date Notarized"
        ];
        tableRows = data.map(item => [
          item.id, item.company_name, item.address, item.business_type,
          item.moa_status, item.expiration_date, item.year_moa_started,
          item.contact_person, item.contact_no, item.email,
          item.moa_draft_sent, item.remarks, item.type_of_moa,
          item.validity, item.date_notarized
        ]);
        break;
      case 'COORDINATORS':
        tableColumn = [
          "ID", "Name", "Campus", "College", "Assigned Students",
          "Status", "Email", "Office"
        ];
        tableRows = data.map(item => [
          item.id, item.name, item.campus, item.college,
          item.assigned_student, item.status, item.email, item.office
        ]);
        break;
      case 'HTE':
        tableColumn = [
          "ID", "Company Name", "Year Submitted", "Business Type", "MOA Status",
          "Contact Person", "Contact Number", "Remarks", "Year Included",
          "Position/Department", "Course", "Campus", "College", "Email Address",
          "Office Address", "MOA Date Notarized", "Expiry Date"
        ];
        tableRows = data.map(item => [
          item.id, item.company_name, item.year_submitted, item.business_type,
          item.moa_status, item.contact_person, item.contact_number, item.remarks,
          item.year_included, item.position_department, item.course, item.campus,
          item.college, item.email_address, item.office_address,
          item.with_moa_date_notarized, item.expiry_date
        ]);
        break;
      default:
        console.error('Unknown page type for PDF export');
        return;
    }

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      headStyles: { fillColor: [128, 1, 1] },
      styles: {
        tableWidth: 'wrap',
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 },
        8: { cellWidth: 20 },
        9: { cellWidth: 25 },
        10: { cellWidth: 20 },
        11: { cellWidth: 20 },
        12: { cellWidth: 20 },
        13: { cellWidth: 30 },
        14: { cellWidth: 30 },
        15: { cellWidth: 25 },
        16: { cellWidth: 20 },
      }
    });

    doc.text(title, 14, 15);
    doc.save(`${filename}.pdf`);
  };
  

  return (
    <nav className="fixed bg-[#800101] sm:shadow-md shadow-none top-0 flex items-center px-3 sm:px-10 z-50 h-[4rem] w-full text-white">
      {/* Address Bar */}
      <div
        className={`flex items-center text-sm font-medium text-gray-200 ${
          currentPage ? "ml-16 sm:ml-[250px] mr-2 sm:mr-0" : "ml-16 sm:ml-0 mr-2 sm:mr-0"
        }`}
      >
        <span className="mr-2 ">{decodeURIComponent(defaultPage)}</span>
        {currentPage && (
          <>
            <span className="text-white">/</span>
            <span className="ml-2 font-bold">{decodeURIComponent(currentPage)}</span>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center text-white">
        {/* Only show search and export if not on developer page */}
        {!isDeveloperPage && (
          <>
            {/* Search Bar for Desktop */}
            <div className="hidden lg:flex items-center rounded-2xl border border-gray-300 mr-5">
              <Search
                className="h-5 w-5 mr-2 ml-2 hover:text-gray-400 transition duration-300"
                onClick={() => setIsSearchOpen(!isSearchOpen)} // Toggle search visibility
              />
                      {isSearchOpen && (
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search..."
                            className="px-4 py-2 rounded-2xl text-md text-black focus:outline-none focus:ring-2 focus:ring-red-800-400"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                          />

                          {searchQuery && (
                            <div 
                              className="absolute top-9 left-[10%] transform -translate-x-[76%] bg-white shadow-lg p-3 rounded-lg w-96 max-h-60 overflow-auto">
                              {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                  <div
                                    key={index}
                                    className="p-3 border-b cursor-pointer hover:bg-gray-200 transition duration-300"
                                    onClick={() => handleSearchClick(item)}
                                  >
                                    <p className="text-black">{item.company_name || item.name || item.title}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-black">No results found.</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
            </div>

            {/* Icons for Desktop */}
            <ul className="hidden lg:flex items-center space-x-5 text-white">
              <li>
                <button 
                  className="text-md hover:text-gray-400 transition duration-300"
                  onClick={handleRefreshClick}
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </li>

              {canExport && !isOverviewPage && (
                <li>
                  {/* Export Dropdown for Desktop */}
                  <div className="relative">
                    <button
                      className="text-md hover:text-gray-400 transition duration-300 flex items-center"
                      onClick={() => setIsExportOpen(!isExportOpen)}
                    >
                      <FileText className="h-5 w-5 mr-1" />
                      <span>Export</span>
                    </button>
                    {isExportOpen && (
                      <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2">
                        <button
                          className="inline-flex items-center space-x-1 text-black hover:text-red-800 transition duration-300"
                          onClick={() => handleExportClick("Excel")}
                        >
                          <span>as</span>
                          <span>Excel</span>
                        </button>
                        <button
                          className="inline-flex items-center space-x-1 text-black hover:text-red-800 transition duration-300"
                          onClick={() => handleExportClick("PDF")}
                        >
                          <span>as</span>
                          <span>PDF</span>
                        </button>
                      </div>
                    )}

                  </div>
                </li>
              )}

            </ul>
          </>
        )}

        {/* Settings Menu for Small Devices */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
            className="text-md text-white hover:text-gray-400 transition duration-300"
          >
            <Settings className="h-6 w-6" />
          </button>
          {isSettingsMenuOpen && (
            <div
              ref={settingsMenuRef}
              className="absolute right-3 top-12 bg-white rounded-lg shadow-lg p-3"
            >
              <ul className="space-y-3">
                {!isDeveloperPage && (
                  <>
                    <li>
                      <button className="flex items-center text-black hover:text-red-800 transition duration-300"
                        onClick={handleRefreshClick}>
                        <RotateCcw className="h-5 w-5 mr-2" />
                        <span>Refresh</span>
                      </button>
                    </li>

                    <li className="relative">
                      <button
                        className="flex items-center text-black hover:text-red-800 transition duration-300"
                        onClick={() => setIsSearchOpen(!isSearchOpen)} 
                      >
                        <Search className="h-5 w-5 mr-2" />
                        <span>Search</span>
                      </button>

                      {isSearchOpen && (
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search..."
                            className="mt-2 px-4 py-2 rounded-2xl text-md text-black w-71 focus:outline-none focus:ring-2 focus:ring-red-800"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                          />

                          {searchQuery && (
                            <div 
                              className="absolute left-0 mt-1 bg-white shadow-lg p-3 rounded-lg w-71 max-h-60 overflow-auto z-50">
                              {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                  <div
                                    key={index}
                                    className="p-3 border-b cursor-pointer hover:bg-gray-200 transition duration-300"
                                    onClick={() => handleSearchClick(item)}
                                  >
                                    <p className="text-black">{item.company_name || item.name || item.title}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-black">No results found.</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </li>

                    {canExport && !isOverviewPage && (
                      <li>
                        <div className="relative">
                          <button
                            className="flex items-center text-black hover:text-red-800 transition duration-300"
                            onClick={() => setIsExportOpen(!isExportOpen)}
                          >
                            <FileText className="h-5 w-5 mr-2" />
                            <span>Export</span>
                          </button>
                          {isExportOpen && (
                            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg p-2">
                              <button
                                className="block w-full text-black hover:text-red-800 transition duration-300"
                                onClick={() => handleExportClick("Excel")}
                              >
                                as Excel
                              </button>
                              <button
                                className="block w-full text-black hover:text-red-800 transition duration-300"
                                onClick={() => handleExportClick("PDF")}
                              >
                                as PDF
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}