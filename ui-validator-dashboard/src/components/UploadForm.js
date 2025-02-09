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
    const [markedImage, setMarkedImage] = useState(null);
    const [comparisonReport, setComparisonReport] = useState("");

    const resetForm = () => {
        setFigmaOption(null);
        setWebsiteOption(null);
        setFigmaUrl("");
        setFigmaFile(null);
        setWebsiteUrl("");
        setWebsiteFile(null);
        setMatchPercentage(null);
        setLoading(false);
        setMarkedImage([]);
    };

    const handleCompare = async (e) => {
        e.preventDefault();

        if (!figmaFile || !websiteFile) {
            alert("Please upload both images before comparing.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("figma_file", figmaFile);
        formData.append("ui_file", websiteFile);

        try {
            const response = await axios.post("http://127.0.0.1:8000/compare-ui", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log("Full Backend Responsessss:", response.data.original_report);
            console.log("Comparison Report (Raw):", response.data.report);

            // Store images
            const images = [];
            if (figmaFile) images.push(URL.createObjectURL(figmaFile));
            if (websiteFile) images.push(URL.createObjectURL(websiteFile));
            if (response.data.marked_image) images.push(`data:image/png;base64,${response.data.marked_image}`);

            setMarkedImage(images);

            let parsedReport = "";
            let matchPercentage = null;

            try {
                let report = response.data.original_report;
                let match = response.data.report;

                // ✅ Check if response is already a string (plain text)
                if (typeof report === "string" && report.startsWith("{")) {
                    report = JSON.parse(report); // Parse only if it's valid JSON
                }

                console.log("Parsed Reportssss:", match);

                if (report && typeof report === "object" && Array.isArray(report.differences)) {
                    const differences = report.differences;
                    const alignmentIssue = differences.find(diff => diff.issue === "Misalignment detected");

                    if (alignmentIssue && typeof alignmentIssue.similarity_score === "number") {
                        matchPercentage = alignmentIssue.similarity_score * 100;
                    }

                    parsedReport = differences.map(diff => `• ${diff.issue}: ${diff.description}`).join("\n");
                    // ✅ If the report is plain text, use it directly
                    parsedReport = match;

                } else {
                    parsedReport = "No significant differences detected.";
                }
            } catch (error) {
                parsedReport = "Error parsing report. Check backend response.";
                console.error("JSON Parsing Error:", error);
            }

            setMatchPercentage(matchPercentage);
            setComparisonReport(parsedReport);
        } catch (error) {
            console.error("Error comparing UI:", error);
            alert("Failed to compare UI. Check backend logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                    <footer>
                        <div className="match-result" id={matchPercentage === 100 ? "good-job" : undefined}>
                            <FaCheckCircle />
                            <p id={matchPercentage === 100 ? "good-job" : undefined}>Match: {matchPercentage}%</p>
                        </div>
                        {/* Display extracted descriptions */}
                        {/* {description.length > 0 && (
                        <div className="comparison-details">
                            <h3>Comparison Details:</h3>
                            <ul>
                                {description.map((desc, index) => (
                                    <li key={index}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    )} */}
                        {/* Start Again Button */}
                        <button className="compare-button" id="again_btn" onClick={resetForm}>
                            Compare Again
                        </button>
                    </footer>
                )}
            </div>
            <div
                className="file_container"
                style={{ padding: Array.isArray(markedImage) && markedImage.length > 0 ? "20px" : "0" }}
            >
                {Array.isArray(markedImage) && markedImage.length > 0 && (
                    <div className="comparison-result">
                        <h3>Comparison Result:</h3>
                        <div className="image-container">
                            {/* Figma Screenshot */}
                            <div className="image-box">
                                <h4>Figma Screenshot</h4>
                                <img src={markedImage[0]} alt="Figma Screenshot" />
                            </div>

                            {/* Website Screenshot */}
                            <div className="image-box">
                                <h4>Website Screenshot</h4>
                                <img src={markedImage[1]} alt="Website Screenshot" />
                            </div>
                        </div>

                        {/* Comparison Result (below the side-by-side images) */}
                        <div className="comparison-single">
                            <h4>Comparison Result</h4>
                            <img src={markedImage[2]} alt="Comparison Result" />
                        </div>
                        {/* Display Report Below the Images */}
                        <div className="report-container">
                            <h4>Detailed Report</h4>
                            <p className="report-text">{comparisonReport}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default UploadForm;
