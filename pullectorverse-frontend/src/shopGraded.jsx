import React from "react";
import ProductCard from "./components/productCard";


const ShopGraded = () => {
  return (
    <>
      <ProductCard name="PSA 10 Charizard" price="$299.99" image="graded1.png" />
      <ProductCard name="PSA 9 Blastoise" price="$99.99" image="graded2.png" />
      <ProductCard name="PSA 10 Pikachu" price="$249.99" image="graded3.png" />
      <ProductCard name="PSA 8 Mewtwo" price="$79.99" image="graded4.png" />
    </>
  );
};

export default ShopGraded;
