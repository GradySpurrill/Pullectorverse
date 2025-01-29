import React from "react";
import ProductCard from "./components/productCard";


const ShopSingles = () => {
  return (
    <>
      <ProductCard name="Charizard V" price="$24.99" image="single1.png" />
      <ProductCard name="Pikachu Full Art" price="$19.99" image="single2.png" />
      <ProductCard name="Mewtwo Holo" price="$29.99" image="single3.png" />
      <ProductCard name="Blastoise GX" price="$34.99" image="single4.png" />
    </>
  );
};

export default ShopSingles;
