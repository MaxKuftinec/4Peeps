import React, { useState } from "react";
import { FaLink, FaGlobe, FaCheckCircle } from "react-icons/fa";

const UploadForm = () => {
    const [figmaUrl, setFigmaUrl] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [matchPercentage, setMatchPercentage] = useState(null);

    const handleCompare = (e) => {
        e.preventDefault();
        alert("Backend logic will compare Figma & Website UI!");

        // Mocking a match percentage (Replace this with actual API call)
        setMatchPercentage(Math.floor(Math.random() * 100));
    };

    return (
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-lg mx-auto mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Compare UI with Figma</h2>

            <form onSubmit={handleCompare} className="space-y-6">
                {/* Figma URL Input */}
                <div>
                    <label className="block font-medium mb-2 flex items-center">
                        <FaLink className="mr-2 text-blue-500" /> Figma Design URL
                    </label>
                    <input
                        type="url"
                        placeholder="https://www.figma.com/file/..."
                        value={figmaUrl}
                        onChange={(e) => setFigmaUrl(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Website URL Input */}
                <div>
                    <label className="block font-medium mb-2 flex items-center">
                        <FaGlobe className="mr-2 text-green-500" /> Live Website URL
                    </label>
                    <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                {/* Compare Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Compare UI
                </button>
            </form>

            {/* Match Percentage Result */}
            {matchPercentage !== null && (
                <div className="mt-6 text-center">
                    <FaCheckCircle className="text-green-500 text-4xl mx-auto" />
                    <p className="text-lg font-bold">Match: {matchPercentage}%</p>
                </div>
            )}
        </div>
    );
};

export default UploadForm;