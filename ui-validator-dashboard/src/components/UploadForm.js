import React, { useState } from "react";
import { FaLink, FaGlobe, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import axios from "axios";

const UploadForm = () => {
    const [figmaOption, setFigmaOption] = useState(null); // "url" or "file"
    const [websiteOption, setWebsiteOption] = useState(null); // "url" or "file"
    const [figmaUrl, setFigmaUrl] = useState("");
    const [figmaFile, setFigmaFile] = useState(null);
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [websiteFile, setWebsiteFile] = useState(null);
    const [matchPercentage, setMatchPercentage] = useState(null);
		const [loading, setLoading] = useState(false); // <-- Add this line

    const handleCompare = async (e) => {
        e.preventDefault();

				if (!figmaFile || !websiteFile) {
					alert("Please upload both images before comparing.");
					return;
				}

				setLoading(true);

				const formData = new FormData();
    		formData.append("figma_file", figmaFile);  // Assuming `figmaFile` is stored in state
    		formData.append("ui_file", websiteFile);   // Assuming `uiFile` is stored in state

        try {
					const response = await axios.post("http://127.0.0.1:8000/compare-ui", formData, {
							headers: { "Content-Type": "multipart/form-data" }
					});
	
					console.log("Comparison Report:", response.data.report);
					alert("Comparison completed! Check console for results.");
	
					// If there's a match percentage in the response, update state
					if (response.data.report.match_percentage !== undefined) {
							setMatchPercentage(response.data.report.match_percentage);
					}
			} catch (error) {
					console.error("Error comparing UI:", error);
					alert("Failed to compare UI. Check backend logs.");
			} finally {
				setLoading(false);
			}
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
                            <button onClick={() => setFigmaOption("url")} className={`option-button ${figmaOption === "url" ? "selected" : ""}`}>
                                <FaLink className="icon_logo" /> Use Figma URL
                            </button>
                            <button onClick={() => setFigmaOption("file")} className={`option-button ${figmaOption === "file" ? "selected" : ""}`}>
                                <FaFileAlt className="icon_logo" /> Upload Figma File
                            </button>
                        </div>
                    </div>

                    <div className="selection-box">
                        <p>How would you like to provide the Website design?</p>
                        <div className="select-button">
                            <button onClick={() => setWebsiteOption("url")} className={`option-button ${websiteOption === "url" ? "selected" : ""}`}>
                                <FaGlobe className="icon_logo" /> Use Website URL
                            </button>
                            <button onClick={() => setWebsiteOption("file")} className={`option-button ${websiteOption === "file" ? "selected" : ""}`}>
                                <FaFileAlt className="icon_logo" /> Upload Website Screenshot
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
                    <button type="submit" className="compare-button" disabled={loading}>
											{loading ? "Comparing..." : "Compare UI"}
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