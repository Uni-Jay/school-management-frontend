import  { useEffect, useState } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </>
  );
}

export default App;
