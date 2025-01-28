import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login";
import Profile from "./profile";
import "./App.css";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Pullectorverse</h1>
      {isAuthenticated ? <Profile /> : <LoginButton />}
    </div>
  );
};

export default App;
