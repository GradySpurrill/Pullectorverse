import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) return <p>Loading...</p>;

  return (
    isAuthenticated && (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Welcome, {user.name}!</h2>
        <img src={user.picture} alt={user.name} width="100" style={{ borderRadius: "50%" }} />
        <p>Email: {user.email}</p>
        <p>Nickname: {user.nickname}</p>
        
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          style={{
            backgroundColor: "purple",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            borderColor: "transparent",
            marginTop: "20px",
            cursor: "pointer"
          }}
        >
          Log Out
        </button>
      </div>
    )
  );
};

export default Profile;
