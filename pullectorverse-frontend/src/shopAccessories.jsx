import React from "react";
import ProductCard from "./components/productCard";


const ShopAccessories = () => {
  return (
    <>
      <ProductCard name="Deck Sleeves" price="$7.99" image="accessory1.png" />
      <ProductCard name="Playmat" price="$19.99" image="accessory2.png" />
      <ProductCard name="Binders" price="$29.99" image="accessory3.png" />
      <ProductCard name="Card Storage Box" price="$14.99" image="accessory4.png" />
    </>
  );
};

export default ShopAccessories;
