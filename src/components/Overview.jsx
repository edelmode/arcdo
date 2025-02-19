import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Doughnut } from 'react-chartjs-2';
import { CornerRightUp, CornerLeftDown } from 'lucide-react';

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels);

const Overview = () => {
  const [activeTab, setActiveTab] = useState("HTEs");
  const [clickedBarIndex, setClickedBarIndex] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2020");
  const [data, setData] = useState({
    summaryCards: [],
    industryPartnerCard: [],
    natureOfBusinesses: [],
    moaSTATUS: [],
    tableData: {
      HTEs: [],
      "INDUSTRY PARTNERS": [],
      "OJT COORDINATORS": [],
    },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryCardsResponse = await axios.get('http://localhost:3001/api/overview/summaryCard');
        const industryPartnerCardResponse = await axios.get('http://localhost:3001/api/overview/industryPartnerCard');
        const natureOfBusinessesResponse = await axios.get('http://localhost:3001/api/overview/natureOfBusinesses');
        const moaStatusResponse = await axios.get('http://localhost:3001/api/overview/moaStatus');
        const tableDataResponse = await axios.get('http://localhost:3001/api/overview/tableData');

        setData({
          summaryCards: [
            { title: "Host Training Establishments (HTEs)", value: Number(summaryCardsResponse.data.HTEs || 0), change: "Total" },
            { title: "Memorandum of Agreements (MOAs)", value: Number(summaryCardsResponse.data.MOAs || 0), change: "Total" },
            { title: "On-the-Job Training Coordinators", value: Number(summaryCardsResponse.data.OJT_Coordinators || 0), change: "Total" },
            { title: "Industry Partners", value: Number(summaryCardsResponse.data.Industry_Partners || 0), change: "Total" },
          ],
          industryPartnerCard: industryPartnerCardResponse.data,
          natureOfBusinesses: natureOfBusinessesResponse.data,
          moaSTATUS: moaStatusResponse.data,
          tableData: tableDataResponse.data,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const [clickedCard, setClickedCard] = useState(null);

  const doughnutIndustrycardData = {
    labels: data.industryPartnerCard.map((status) => `${status.STATUS} ${status.percentage}%`),
    datasets: [
      {
        data: data.industryPartnerCard.map((status) => status.percentage),
        backgroundColor: ["#c30010", "#800000", "#f69697"],
        hoverOffset: 5,
      },
    ],
  };

  const doughnutndustrycardOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true, // Keeps tooltips on hover
      },
      datalabels: {
        display: false, // Hides labels inside the doughnut
      },
      legend: {
        position: "right",
        labels: {
          color: "white",
          usePointStyle: true,
          padding: 6,
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 7,
        borderColor: "#0000",
      },
    },
    cutout: '50%',
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000) + 'k';
    }
    return num;
  };

  const barData = {
    labels: data.natureOfBusinesses.map((business) => business.category),
    datasets: [
      {
        label: "Nature of Businesses",
        data: data.natureOfBusinesses.map((business) => business.count),
        backgroundColor: data.natureOfBusinesses.map((business, index) =>
          index === clickedBarIndex ? "#31111D" : "#FFD8E4"
        ),
        barThickness: 70,
        borderRadius: 16,
        datalabels: {
          display: (context) => context.dataIndex === clickedBarIndex,
          anchor: "end",
          align: "end",
          color: "#FFFFFF",
          font: {
            weight: "bold",
          },
          offset: 4,
          backgroundColor: "#31111D",
          padding: 8,
          borderRadius: 20,
          formatter: (value) => formatNumber(value),
        },
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "end",
        font: {
          weight: "bold",
          size: 20,
        },
        backgroundColor: "#FF6347",
        borderRadius: 5,
      },
    },
    scales: {
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          autoSkip: false, // Ensure all labels are displayed
          maxRotation: 0, // Keep labels straight
          minRotation: 0,
          font: {
            size: 12, // Adjust for readability
          },
          callback: function (value) {
            let label = this.getLabelForValue(value);
            return label.match(/.{1,15}(\s|$)/g); // Split every 15 characters (adjust as needed)
          },
        },
      },
    },
    layout: {
      padding: {
        top: 40,
        bottom: 3,
        left: 10,
        right: 10,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setClickedBarIndex(index === clickedBarIndex ? null : index);
      }
    },
  };

  const doughnutData = {
    labels: data.moaSTATUS.map((status) => `${status.STATUS} ${status.percentage}%`),
    datasets: [
      {
        data: data.moaSTATUS.map((status) => status.percentage),
        backgroundColor: ["#c30010", "#800000", "#f69697"],
        hoverOffset: 5,
      },
    ],
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true, // Keeps tooltips on hover
      },
      datalabels: {
        display: false, // Hides labels inside the doughnut
      },
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            weight: "bold",
            size: 10,
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 7,
      },
    },
    cutout: '40%',
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 md:ml-[250px] mt-10 p-7 min-h-screen overflow-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-1 relative">
        {Array.isArray(data.summaryCards) && data.summaryCards.map((card, index) => {
          const isFirstColumn = index % 4 === 0;
          const isLastColumn = (index + 1) % 4 === 0;

          const value1 = Math.round(card.value * 0.6);
          const value2 = card.value - value1;

          const gradientClass = card.title === "Host Training Establishments (HTEs)" || card.title === "On-the-Job Training Coordinators" 
            ? "bg-gradient-to-b from-[#31111D] to-[#9A3259]"
            : "bg-gradient-to-b from-[#DAA521] via-[#E3B419] via-[#EDC211] via-[#F6D108] to-[#FFDF00]" ;
            
          const gradientClass2 = card.title === "Host Training Establishments (HTEs)" || card.title === "On-the-Job Training Coordinators" 
            ? "bg-gradient-to-b from-[#9A3259] to-[#31111D]"
            : "bg-gradient-to-b from-[#FFDF00] via-[#F6D108] via-[#EDC211] via-[#E3B419] to-[#DAA521]" ;

          const transformScale = clickedCard === index 
            ? (window.innerWidth < 768 
                ? 'scale(0.8) translateX(-15%) translateY(2%)' 
                : isFirstColumn 
                  ? 'scale(1.4) translateX(15%) translateY(15%)' 
                  : isLastColumn 
                    ? 'scale(1.4) translateX(-30%) translateY(15%)' 
                    : 'scale(1.4) translateY(15%)'
              ) 
            : 'scale(1)';

          return (
            <div
              key={index}
              className={`shadow-lg rounded-t-2xl p-4 flex items-center justify-between transform transition-transform duration-300 ${gradientClass} ${
                clickedCard === index ? 'scale-150 z-50' : 'scale-100'
              }`}
              style={{
                zIndex: clickedCard === index ? 50 : 1,
                width: clickedCard === index ? '130%' : '100%',
                transform: transformScale,
              }}
              onClick={() => setClickedCard(clickedCard === index ? null : index)}
            >
              <div
                className={`flex flex-col transition-all duration-300 ${
                  clickedCard === index ? 'text-lg' : 'text-sm'
                }`}
              >
                <h3
                  className={`font-medium text-white mb-4 ${
                    clickedCard === index ? 'text-xl' : 'text-sm'
                  }`}
                >
                  {card.title}
                </h3>
                <p className={`font-bold text-white ${clickedCard === index ? 'text-4xl' : 'text-2xl'}`}>
                  {typeof card.value === 'number' ? card.value.toLocaleString() : '0'}
                </p>
              </div>
              
              <div className="flex flex-col items-end">
                {card.change.startsWith("+") ? (
                  <CornerRightUp
                    className={`transition-transform duration-300 mb-10 ${
                      clickedCard === index ? 'text-white scale-150' : 'text-white'
                    }`}
                  />
                ) : (
                  <CornerLeftDown
                    className={`transition-transform duration-300 mb-10 ${
                      clickedCard === index ? 'text-white scale-150' : 'text-white'
                    }`}
                  />
                )}
                <p
                  className={`transition-all duration-300 font-medium ${
                    card.change.startsWith("+")
                      ? clickedCard === index
                        ? ' text-lg text-white'
                        : ' text-sm text-white'
                      : clickedCard === index
                      ? ' text-lg text-white'
                      : ' text-sm text-white'
                  }`}
                >
                  {clickedCard === index ? "Total" : card.change}
                </p>
              </div>

              {clickedCard === index && card.title === "Memorandum of Agreements (MOAs)" && (
                <div className={`absolute top-full left-0 w-full shadow-lg rounded-b-2xl p-4 z-10 ${gradientClass2}`}>
                  <div className="flex justify-between mb-2">
                    <p className="text-2xl font-bold text-white -mt-5">
                      {parseFloat(value1).toLocaleString()}
                    </p>
                    <p className="text-sm text-white font-medium text-right -mt-5">
                      HTEs
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-2xl font-bold text-white">
                      {parseFloat(value2).toLocaleString()}
                    </p>
                    <p className="text-sm text-white font-medium text-right">
                      Industry Partners
                    </p>
                  </div>
                </div>
              )}

              {clickedCard === index && (card.title === "Host Training Establishments (HTEs)" || card.title === "On-the-Job Training Coordinators") && (
                <div className={`absolute top-full left-0 w-full shadow-lg rounded-b-2xl p-4 z-10 ${gradientClass2}`}>
                  <div className="flex justify-between mb-2">
                    <p className="text-2xl font-bold text-white -mt-5">
                      {parseFloat(value1).toLocaleString()}
                    </p>
                    <p className="text-sm text-white font-medium text-right -mt-5">
                      Main Campus
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-2xl font-bold text-white">
                      {parseFloat(value2).toLocaleString()}
                    </p>
                    <p className="text-sm text-white font-medium text-right">
                      Other Campuses
                    </p>
                  </div>
                </div>
              )}

              {clickedCard === index && card.title === "Industry Partners" && (
                <div className={`absolute top-full left-0 w-full shadow-lg rounded-b-2xl p-4 z-10 ${gradientClass2}`}>
                  <div className="flex justify-between mb-2 -mt-5">
                    <div style={{ height: '150px', width: '100%' }}>
                      <Doughnut data={doughnutIndustrycardData} options={doughnutndustrycardOptions} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nature of Businesses and MOA STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mb-6 mt-5">
        <div className="bg-white shadow rounded-lg p-2 flex flex-col min-h-[40px]">
          <h3 className="text-lg font-medium text-gray-800 p-5">
            Nature of Businesses
          </h3>
          <div className="h-[300px] sm:h-[250px] md:h-[300px] lg:h-[300px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-2 flex flex-col min-h-[50px] mb-1">
          <h3 className="text-lg font-medium text-gray-800 p-5">
            Memorandum of Agreement (MOA) STATUS
          </h3>
          <div className="h-[250px] sm:h-[220px] md:h-[250px] lg:h-[300px] w-full">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
      
      {/* Tabbed Tables */}
      <div className="bg-white shadow rounded-lg p-4 flex h-30 flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 mb-2 -mt-2">
          <div className="flex sm:flex -mt-5 ">
            {Object.keys(data.tableData).map((tab, index) => (
              <button
                key={index}
                className={`py-3 px-4 mb-5 mt-4 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-red-900 text-red-900"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="py-1 px-4 mb-3 border rounded-md text-gray-700 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 hidden sm:block" 
          >
            {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-auto max-h-60 -mt-5 ">
          <table className="w-full table-auto text-center ">
            <thead className="sticky top-0 bg-white shadow">
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4">DOC #</th>
                <th className="py-2 px-4">COMPANY</th>
                <th className="py-2 px-4">ADDRESS</th>
                <th className="py-2 px-4">DATE</th>
                <th className="py-2 px-4">NATURE OF BUSINESS</th>
                <th className="py-2 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data.tableData[activeTab]) && data.tableData[activeTab].map((row, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-center">
                  <td className="py-2 px-4">{row.DOC}</td>
                  <td className="py-2 px-4">{row.COMPANY}</td>
                  <td className="py-2 px-4">{row.ADDRESS}</td>
                  <td className="py-2 px-4">{row.DATE}</td>
                  <td className="py-2 px-4">{row.BUSINESS}</td>
                  <td
                    className={`py-2 px-4 text-center rounded-full font-normal ${
                      row.STATUS === "Completed"
                        ? "text-green-600 bg-green-100 inline-block py-1 mt-1 mb-2"
                        : row.STATUS === "Processing"
                        ? "text-orange-600 bg-orange-100 inline-block py-1 mt-1 mb-2"
                        : row.STATUS === "Rejected"
                        ? "text-red-600 bg-red-100 inline-block py-1 mt-1 mb-2"
                        : row.STATUS === "For Renewal"
                        ? "text-orange-600 bg-orange-100 inline-block py-1 mt-1 mb-2"
                        : row.STATUS === "Active"
                        ? "text-green-600 bg-green-100 inline-block py-1 mt-1 mb-2"
                        : "text-gray-500 bg-gray-100 inline-block py-1 mt-1 mb-2"
                    }`}
                  >
                    {row.STATUS}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;