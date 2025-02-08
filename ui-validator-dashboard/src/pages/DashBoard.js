import React from "react";
import UploadForm from "../components/UploadForm";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center">UI Validator</h1>
            <UploadForm />
        </div>
    );
};

export default Dashboard;