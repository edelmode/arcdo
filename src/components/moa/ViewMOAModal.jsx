"use client"

import { X, FileText, Building, User, Briefcase, Phone, Mail, CheckCircle, Calendar, Clock, MapPin, GraduationCap, Shield, Type } from 'lucide-react';
import { useState, useEffect } from "react";

const ViewMoaModal = ({ isOpen, formData, onClose }) => {
  if (!isOpen) {
    return null;
  }
  console.log("formData in ViewMOAModal:", formData);

  const sections = [
    { label: "MOA Name", value: formData.name, icon: FileText },
    { label: "Type of MOA", value: formData.type_of_moa, icon: Type },
    { label: "Nature of Business", value: formData.nature_of_business, icon: Briefcase },
    { label: "Company Address", value: formData.address, icon: MapPin },
    { label: "Contact Person", value: `${formData.firstname} ${formData.lastname}`, icon: User },
    { label: "Position", value: formData.position, icon: Briefcase },
    { label: "Contact Number", value: formData.contact_number, icon: Phone },
    { label: "Email Address", value: formData.email, icon: Mail },
    { label: "MOA Status", value: formData.moa_status, icon: CheckCircle },
    { label: "Years Validity", value: formData.years_validity, icon: Clock },
    { 
      label: "Date Notarized", 
      value: new Date(formData.date_notarized).toLocaleDateString(), 
      icon: Calendar 
    },
    { 
      label: "Expiry Date", 
      value: new Date(formData.expiry_date).toLocaleDateString(), 
      icon: Calendar 
    },
    
    { label: "Year Submitted", value: formData.year_submitted, icon: Calendar },
    { label: "Branch", value: formData.branch, icon: Building },
    { label: "Course", value: formData.course, icon: GraduationCap },
    { label: "Has NDA?", value: formData.has_nda ? "Yes" : "No", icon: Shield },
  ];

  // Group sections into categories
  const mainInfo = sections.slice(0, 4);
  const contactInfo = sections.slice(4, 8);
  const statusInfo = sections.slice(8, 13);
  const additionalInfo = sections.slice(13);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isOpen ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-lg overflow-hidden relative translate-x-20">
        <div className="bg-red-900 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            View MOA
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition-colors focus:outline-none rounded-full hover:bg-red-900/20 p-2"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-8 max-h-[calc(90vh-80px)] space-y-8">
          {/* Main Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-red-100 pb-2">Main Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mainInfo.map((section, index) => (
                <InfoSection key={index} {...section} />
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-red-100 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((section, index) => (
                <InfoSection key={index} {...section} />
              ))}
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-red-100 pb-2">Status & Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statusInfo.map((section, index) => (
                <InfoSection key={index} {...section} />
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black border-b border-red-100 pb-2">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalInfo.map((section, index) => (
                <InfoSection key={index} {...section} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoSection = ({ label, value, icon: Icon }) => {
  // Default fallback if Icon is not provided
  const IconComponent = Icon || X;

  return (
    <div className="bg-white border border-red-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-50 rounded-lg">
          <IconComponent className="text-red-900bg-red-900 h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-gray-900">{value || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewMoaModal;
