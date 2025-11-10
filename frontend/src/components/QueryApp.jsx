import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import './QueryApp.css'

export default function QueryApp() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
    const res = await fetch("/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  } catch (error) {
    setAnswer("Error fetching answer. Please try again.");
    console.error(error);
  }
  setLoading(false);
};

    const handleClear=()=>{
      setAnswer(""),
      setQuestion("")
    }

  return (
    <div className="container">
      <div className="all"> 
        <div className="content">
      <textarea
        className=" texts" style={{width:"630px",padding:"8px"}}
        rows={7}
        placeholder="Any queries on your pet?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        
      />
    

<div className="btn">
      <button
        className="btn-query"
        onClick={handleQuery}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Submit"}
      </button>
      <button className="btn-query" onClick={handleClear}>Clear</button>
</div>
  
</div>
      {answer && (
        <div className="mt-6 w-full max-w-xl bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-800">Answer:</h2>
          <ReactMarkdown >
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
    </div>
  );
}
