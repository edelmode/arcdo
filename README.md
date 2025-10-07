# ARCDO Dashboard (Full Stack)

The **Alumni Relations and Career Development Office (ARCDO) Dashboard** is a full-stack web-based platform designed to improve data management for institutional records.  
It centralizes information related to **Host Training Establishments (HTEs)**, **Memorandum of Agreements (MOAs)**, **On-the-Job Training (OJT) Coordinators**, and **Industry Partners (IPs)**.  

> ⚡ This repository contains both **frontend and backend** implementation.  
> 📌 One of the **ARCDO-PUP projects**.  
> 🔑 **Note:** The `.env` file is not included in this repository for security purposes. You must configure your own environment variables.  

---

## 📌 Features & Pages

- 🏠 **Main Dashboard - Overview Page** – Summary view of all records with key statistics.  
- 🔑 **Authentication Page** – Secure login system with user authentication.  
- 🏢 **Host Training Establishments (HTEs)** – Records and management of partner establishments, including Add and Edit modals for data entry and updates.  
- 📜 **Memorandum of Agreements (MOAs)** – Repository of agreements between the university and partners, with Add and Edit modals for easy management. 
- 👥 **OJT Coordinators** – List and management of faculty coordinators handling OJT students, featuring Add and Edit modals for coordinator details.  
- 🤝 **Industry Partners (IPs)** – Information on industry collaborators, also equipped with Add and Edit modals for record maintenance.  
- 👤 **Account Modal** – Allows users to manage and edit their profile, including role management.
> The system defines three distinct roles to control access levels effectively:
> 🏆 Super Admin – Has full access to all system functionalities and can assign roles.
> 🛠️ Admin – Can manage records and perform administrative actions.
> 👤 User – Limited access for viewing and personal profile management.
- ❌ Delete Entries – Admins can permanently remove outdated or incorrect entries, supported by a confirmation modal to prevent accidental deletions.
- 📤 Export Data – Admins can export data from HTEs, IPs, and OJT Coordinators in CSV or PDF format for reporting and documentation purposes.
- 🔄 Search and Refresh Features – Available across all pages for efficient record navigation and updates.
- 👨‍💻 **Developers Page** – Acknowledgment of the developers behind the project.  
- 📱 **Responsive UI** – Optimised for desktop and mobile.  

---

## 🛠️ Tech Stack

### 🌐 Frontend
- **ReactJS** – Component-based framework for dynamic UI.  
- **TailwindCSS** – Utility-first CSS framework for styling.  

### ⚙️ Backend
- **NodeJS** – Server runtime environment.  
- **ExpressJS** – Lightweight web framework for routing, APIs, and middleware.  

### 🗄️ Database
- **MySQL** – Relational database management system.  
- **Azure Database for MySQL** – Cloud-based hosting ensuring scalability, backups, and high availability.  

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/edelmode/arcdo-dashboard.git
cd arcdo-dashboard
```

### 2️⃣ Install Dependencies
For FrontEnd
```bash
cd frontend
npm install
```
For BackEnd
```bash
cd backend
npm install
```

### 3️⃣ Setup Environment Variables
Create a .env file in the backend folder with the following (example format):
```bash
PORT=5000
DB_HOST=your-azure-db-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-secret-key
```
⚠️ Important: This repo does not include the .env file. Replace the placeholders with your actual configuration.

### 4️⃣ Run the Development Servers
For BackEnd
```bash
cd backend
npm start
```
For FrontEnd 
```bash
cd frontend
npm run dev
```


