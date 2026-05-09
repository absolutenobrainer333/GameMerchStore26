import "./App.css";
import Navbar from "./components/navbar/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Logup from "./pages/RegJoin";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Phasmo from "./pages/Phasmo";
import Valo from "./pages/Valo";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Newsletter from "./components/Newsletter/Newsletter";
import Footer from "./components/footer/footer";

function App() {
  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/valo" element={<Valo />} />
          <Route path="/phasmo" element={<Phasmo />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/signup" element={<Logup />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Newsletter />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
