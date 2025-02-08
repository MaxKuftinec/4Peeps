import React, { useState } from "react";

const TestApiPage = () => {
    const [responseMessage, setResponseMessage] = useState("");

    const handleButtonClick = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/testapi/");
            const data = await response.json();
            setResponseMessage(data.message);
        } catch (error) {
            console.error("Error fetching API:", error);
            setResponseMessage("Failed to connect to API");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>FastAPI Test</h1>
            <button onClick={handleButtonClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
                Call API
            </button>
            {responseMessage && <p style={{ marginTop: "20px", fontSize: "18px" }}>{responseMessage}</p>}
        </div>
    );
};

export default TestApiPage;
