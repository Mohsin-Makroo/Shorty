import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
     <Routes>
      {/* This route contains our main layout */}
      <Route path="/" element={<Layout />}>
        {/* These "child" routes will be rendered inside the Layout */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
   
  );
}

export default App;
