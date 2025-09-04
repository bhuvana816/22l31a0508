import React, { useEffect } from "react";
import { FrontendLog } from "./logger";

function App() {
  useEffect(() => {
    FrontendLog("info", "component", "App component mounted");
    FrontendLog("warn", "api", "Slow response from user API");
    FrontendLog("error", "hook", "useAuth failed to fetch user data");
  }, []);

  return (
    <div>
      <h1>🚀 Frontend Logger Test</h1>
      <button onClick={() => FrontendLog("info", "page", "Home button clicked")}>
        Send Log
      </button>
    </div>
  );
}

export default App;
