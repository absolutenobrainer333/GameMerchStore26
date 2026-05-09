import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosclient from "../utils/axiosclient";
import { AssetImage } from "../utils/imageurl";

export const shopcontext = createContext(null);

const normalizeProduct = (p) => ({
  id: p.id,
  name: p.name,
  image: AssetImage({
    category: p.Category?.name === "Phasmophobia" ? "phasmo" : "valo",
    imageName: p.image,
  }),
  category: p.Category?.name || "",
  price: p.price,
  description: p.description,
  categoryId: p.categoryId,
});

const ShopContextProvider = ({ children }) => {
  const [all_product, setAllProduct] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    axiosclient
      .get("/product")
      .then((res) => setAllProduct(res.data.map(normalizeProduct)))
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  const refreshCart = useCallback(() => {
    if (!localStorage.getItem("authToken")) {
      setCartQuantity(0);
      return;
    }
    axiosclient
      .get("/order")
      .then((res) => setCartQuantity(res.data.quantity || 0))
      .catch(() => setCartQuantity(0));
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
    refreshCart();
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setCartQuantity(0);
  };

  return (
    <shopcontext.Provider
      value={{
        all_product,
        productsLoading,
        isLoggedIn,
        login,
        logout,
        cartQuantity,
        refreshCart,
      }}
    >
      {children}
    </shopcontext.Provider>
  );
};

export default ShopContextProvider;
