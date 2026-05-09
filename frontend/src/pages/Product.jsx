import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { shopcontext } from "../context/shopcontext";
import ProdLooks from "../components/prodlooks/prodlooks";
import ProDisplay from "../components/proDisplay/proDisplay";
import ContactUs from "../components/Newsletter/Newsletter";
import Footer from "../components/footer/footer";
import NotFound from "./NotFound";

const Product = () => {
  const { all_product, productsLoading } = useContext(shopcontext);
  const { productId } = useParams();

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-300 flex items-center justify-center">
        <p className="text-gray-700 text-xl">Loading...</p>
      </div>
    );
  }

  const product = all_product.find((e) => e.id === Number(productId));

  if (!product) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-300">
      <ProdLooks product={product} />
      <ProDisplay product={product} all_product={all_product} />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Product;
