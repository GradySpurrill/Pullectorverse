import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Shop";
import Cart from "./cart";
import CartProvider from "./components/cartContext";
import ThreeHome from "./three/ThreeHome";
import Account from "./account";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ThreeHome />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Account />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
