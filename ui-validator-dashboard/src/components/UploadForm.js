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

export default UploadForm;