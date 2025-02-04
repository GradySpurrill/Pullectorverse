import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Shop";
import Cart from "./cart"; 
import CartProvider from "./components/cartContext";
function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/" element={<Shop />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
