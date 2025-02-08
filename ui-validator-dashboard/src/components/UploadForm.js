<<<<<<< HEAD
import React, { useState } from "react";
import { FaLink, FaGlobe, FaCheckCircle, FaFileAlt } from "react-icons/fa";

const UploadForm = () => {
    const [figmaOption, setFigmaOption] = useState(null); // "url" or "file"
    const [websiteOption, setWebsiteOption] = useState(null); // "url" or "file"
    const [figmaUrl, setFigmaUrl] = useState("");
    const [figmaFile, setFigmaFile] = useState(null);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [websiteFile, setWebsiteFile] = useState(null);
    const [matchPercentage, setMatchPercentage] = useState(null);

    const handleCompare = (e) => {
        e.preventDefault();
        alert("Backend logic will compare Figma & Website UI!");

        // Mocking a match percentage (Replace this with actual API call)
        setMatchPercentage(Math.floor(Math.random() * 100));
    };

    return (
        <div className="upload-form-container">
            <h2>Compare UI with Figma</h2>

            {/* Ask for Figma & Website options first */}
            {figmaOption === null || websiteOption === null ? (
                <div className="selection-container">
                    <div className="selection-box">
                        <p>How would you like to provide the Figma design?</p>
                        <div className="select-button">
                            <button onClick={() => setFigmaOption("url")} className="option-button">
                                <FaLink /> Use Figma URL
                            </button>
                            <button onClick={() => setFigmaOption("file")} className="option-button">
                                <FaFileAlt /> Upload Figma File
                            </button>
                        </div>
                    </div>

                    <div className="selection-box">
                        <p>How would you like to provide the Website design?</p>
                        <div className="select-button">
                            <button onClick={() => setWebsiteOption("url")} className="option-button">
                                <FaGlobe /> Use Website URL
                            </button>
                            <button onClick={() => setWebsiteOption("file")} className="option-button">
                                <FaFileAlt /> Upload Website Screenshot
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleCompare}>
                    {/* Figma Input */}
                    {figmaOption === "url" && (
                        <div className="input-group">
                            <label>
                                <FaLink /> Figma Design URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://www.figma.com/file/..."
                                value={figmaUrl}
                                onChange={(e) => setFigmaUrl(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {figmaOption === "file" && (
                        <div className="input-group">
                            <label>
                                <FaFileAlt /> Upload Figma Design File
                            </label>
                            <input
                                type="file"
                                accept=".png, .jpg, .jpeg, .pdf"
                                onChange={(e) => setFigmaFile(e.target.files[0])}
                                required
                            />
                            {figmaFile && <p className="file-name">{figmaFile.name}</p>}
                        </div>
                    )}

                    {/* Website Input */}
                    {websiteOption === "url" && (
                        <div className="input-group">
                            <label>
                                <FaGlobe /> Live Website URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://yourwebsite.com"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {websiteOption === "file" && (
                        <div className="input-group">
                            <label>
                                <FaFileAlt /> Upload Website Screenshot
                            </label>
                            <input
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                onChange={(e) => setWebsiteFile(e.target.files[0])}
                                required
                            />
                            {websiteFile && <p className="file-name">{websiteFile.name}</p>}
                        </div>
                    )}

                    {/* Compare Button */}
                    <button type="submit" className="compare-button">
                        Compare UI
                    </button>
                </form>
            )}

            {/* Match Percentage Result */}
            {matchPercentage !== null && (
                <div className="match-result">
                    <FaCheckCircle />
                    <p>Match: {matchPercentage}%</p>
                </div>
            )}
        </div>
    );
};

=======
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

>>>>>>> 59aaa37 (Test)
export default UploadForm;