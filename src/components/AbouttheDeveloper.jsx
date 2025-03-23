import React, { useState } from "react";
import { motion } from "framer-motion";

const teamSections = [
  { 
    title: "UI/UX", 
    names: ["Gian Carlo B. Estrella"],
    images: ["/Public/gian.jpg"],
    descriptions: ["I'm Gian, I love mixing design concepts and I'm a member of the one-man UI/UX Team that designed the ARCDO Dashboard."]
  },
  { 
    title: "Database Administrator", 
    names: ["Carla Jeanne B. Goleña"],
    images: ["/Public/carla.jpg"],
    descriptions: ["I'm Carla, I specialize in database management and backend integration. I designed and managed the database for the ARCDO Dashboard, ensuring seamless connectivity with the backend."]
  },
  { 
    title: "Front End Developers", 
    names: ["Edel Mae T. Tapar", "Ahijah Reign M. Reyes", "Noah B. Dorado"],
    images: ["/Public/Del.jpg", "/Public/reign.png", "/Public/nowi.png"],
    descriptions: [
      "Hello! Call me Del, a part of the front-end developer team responsible for bringing designs and ideas to life, making the website engaging and user-friendly.",
      "I'm Reign, part of the front-end dev team for the ARCDO website. I help build and refine the user interface to keep things smooth and functional.",
      "I'm Noah, I love dragons and I'm a member of the Front-End Team that developed the ARCDO Dashboard."
    ]
  },
  { 
    title: "Back End Developers", 
    names: ["Rowel B. Dacut", "Christine S. Ilagan", "Nathaniel Kingsley Pulan", "Edrian Infante"],
    images: ["/Public/rowel.png", "/Public/tine.png", "/Public/nath.jpg", "/Public/ed.jpg"],
    descriptions: [
      "I'm Rowel Pogi, a Backend Developer working on the ARCDO Dashboard. My role includes managing data and fetching data for the Overview section.",
      "I'm Christine, a Back-End Developer for the ARCDO Dashboard. I handle data fetching, backend functions, and feature implementation.",
      "I'm Nath, a Back-End Developer for the ARCDO. I fetch the data, write the code, and add or implement new features.",
      "I'm Ed, a Backend Developer working on the ARCDO Dashboard. Role includes managing data fetching & rolling out new features."
    ]
  },
];

const AbouttheDeveloper = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:pl-[17rem] mt-10">
      <motion.div 
        className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900 text-center">🚀 Meet the Developers</h1>
        <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed text-center">
          This dashboard for the <span className="font-semibold">Alumni Relations and Career Development Office (ARCDO)</span> of the Polytechnic University of the Philippines was created by select 4th Year <span className="font-semibold">Bachelor of Science Computer Engineering (BSCOE)</span> students as part of their requirements 
          from the course <span className="font-semibold">CMPE 40173 Database System Implementation.</span> It was made in the <i>1st semester of the academic year 2024-2025</i> by the CpE batch of 2021 section <span className="font-semibold">BSCOE 4-2.</span>
        </p>
        
        {teamSections.map((section, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 border-b-2 pb-2 text-center sm:text-left">{section.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {section.images.map((imgSrc, idx) => (
                <motion.div 
                  key={idx} 
                  className="bg-gradient-to-r from-gray-200 to-gray-300 p-6 sm:p-8 rounded-lg text-center shadow-md hover:shadow-xl transition-transform transform hover:scale-105 flex flex-col items-center min-h-[250px] sm:min-h-[300px] cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedMember({ name: section.names[idx], image: imgSrc, description: section.descriptions[idx] })}
                >
                  <img src={imgSrc} alt={section.names[idx]} className="w-28 h-28 sm:w-40 sm:h-40 rounded-full mb-3 object-cover" />
                  <p className="text-gray-700 font-medium text-base sm:text-lg">{section.names[idx]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
      
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6" onClick={() => setSelectedMember(null)}>
          <motion.div 
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-sm sm:max-w-lg text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedMember.image} alt={selectedMember.name} className="w-40 h-40 sm:w-60 sm:h-60 rounded-full mb-3 object-cover mx-auto" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedMember.name}</h2>
            <p className="text-gray-700 text-sm sm:text-base">{selectedMember.description}</p>
            <button className="mt-4 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={() => setSelectedMember(null)}>Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AbouttheDeveloper;
