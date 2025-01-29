import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Shop from "./shop";
import LoginButton from "./login";
import Profile from "./profile";
import "./App.css";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shop />} />

        <Route path="/profile" element={isAuthenticated ? <Profile /> : <LoginButton />} />

        <Route path="/login" element={<LoginButton />} />
      </Routes>
    </Router>
  );
};

export default App;
