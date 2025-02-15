import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Account = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const customAudience = import.meta.env.VITE_AUTH0_AUDIENCE;

  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [orderHistory] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently({
            audience: customAudience,
          });
          const auth0Id = user.sub;

          const profileRes = await axios.get(
            `http://localhost:5000/api/users/${auth0Id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setEmail(profileRes.data.email);

          const addressesRes = await axios.get(
            `http://localhost:5000/api/users/${auth0Id}/address`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setAddresses(addressesRes.data);
        } catch (err) {
          console.error("Error fetching data:", err);
          setAddresses([]);
        } finally {
          setAddressesLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, getAccessTokenSilently, customAudience]);

  const handleSaveProfile = async () => {
    setUpdating(true);
    setUpdateError("");

    try {
      const token = await getAccessTokenSilently({ audience: customAudience });
      const auth0Id = user.sub;

      await axios.put(
        `http://localhost:5000/api/users/${auth0Id}`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditMode(false);
    } catch (err) {
      setUpdateError("Failed to update profile. Please try again.");
      console.error("Update error:", err);
    }
    setUpdating(false);
  };

  const handleAddAddress = async () => {
    try {
      if (
        !newAddress.name ||
        !newAddress.addressLine1 ||
        !newAddress.city ||
        !newAddress.state ||
        !newAddress.zip ||
        !newAddress.country
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      const token = await getAccessTokenSilently({ audience: customAudience });
      const auth0Id = user.sub;

      const res = await axios.post(
        `http://localhost:5000/api/users/${auth0Id}/address`,
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses([...addresses, res.data]);
      setNewAddress({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: "",
      });
      setShowAddressForm(false);
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Error adding address. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/forgot-password`, {
        email,
      });
      alert("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error("Error sending password reset email:", err);
      alert("Failed to send password reset email.");
    }
  };

  if (isLoading || (isAuthenticated && addressesLoading)) {
    return <div className="text-center p-8">Loading account details...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl mb-4">Please sign in to view your account</h2>
        <button
          onClick={() => loginWithRedirect()}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
        >
          Sign In
        </button>
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <Link to="/shop">
            <button className="px-6 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-900 transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Account</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Saved Addresses</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {showAddressForm ? "Cancel" : "Add New Address"}
            </button>
          </div>

          {showAddressForm && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Street Address"
                value={newAddress.addressLine1}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine1: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Apartment/Suite (optional)"
                value={newAddress.addressLine2}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine2: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="State/Province"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ZIP/Postal Code"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleAddAddress}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}

          {addresses.length > 0 ? (
            <div className="space-y-4 mt-4">
              {addresses.map((address) => (
                <div key={address._id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg">{address.name}</h3>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && <p>Phone: {address.phone}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mt-4">No saved addresses yet</p>
          )}
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="flex items-center justify-between">
                    <span>••••••••</span>
                    <button
                      onClick={handleForgotPassword}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
                {updateError && (
                  <p className="text-red-500 text-sm">{updateError}</p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg">{email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Password</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">••••••••</span>
                    <button
                      onClick={handleForgotPassword}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Order History</h2>
            {orderHistory.length > 0 ? (
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Order #{order.id}</span>
                      <span className="text-gray-600">{order.date}</span>
                    </div>
                    <p className="mt-2">Total: ${order.total}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No recent orders found</p>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/shop">
            <button className="px-6 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-900 transition-colors">
              Continue Shopping
            </button>
          </Link>
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
