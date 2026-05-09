import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaMoneyBillWave, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axiosclient from "../utils/axiosclient";
import { AssetImage } from "../utils/imageurl";
import { shopcontext } from "../context/shopcontext";
import Snackbar from "../components/snackbar/snackbar";
import StripeCardInput from "../components/stripe/StripeCardInput";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash on Delivery", Icon: FaMoneyBillWave },
  { id: "visa", label: "Visa", Icon: FaCcVisa },
  { id: "mastercard", label: "MasterCard", Icon: FaCcMastercard },
];

const Cart = () => {
  const [cartItem, setCartItem] = useState([]);
  const [cart, setCart] = useState(null);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", type: "success" });
  const { refreshCart } = useContext(shopcontext);

  const isCardPayment = ["visa", "mastercard"].includes(paymentMethod);
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(false);

  useEffect(() => {
    if (isCardPayment && cart?.total > 0) {
      setLoadingIntent(true);
      axiosclient
        .post("/order/create-payment-intent")
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch(() => setSnackbar({ message: "Failed to initialize payment.", type: "error" }))
        .finally(() => setLoadingIntent(false));
    } else {
      setClientSecret(null);
    }
  }, [isCardPayment]);

  useEffect(() => {
    axiosclient
      .get("/order/order-detail")
      .then((res) => setCartItem(res.data))
      .catch((err) => console.error("Error fetching cart items:", err));

    axiosclient
      .get("/order")
      .then((res) => setCart(res.data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  const handleAmount = (productId, amount) => {
    if (amount < 1) return;
    axiosclient
      .put("/order/update", { productId, amount })
      .then((res) => {
        setCartItem(res.data);
        return axiosclient.get("/order");
      })
      .then((res) => {
        setCart(res.data);
        refreshCart();
      })
      .catch((err) => console.error("Error updating cart:", err));
  };

  const remove = (productId) => {
    axiosclient
      .delete("/order/delete", { data: { productId } })
      .then((res) => {
        setCartItem(res.data);
        return axiosclient.get("/order");
      })
      .then((res) => {
        setCart(res.data);
        refreshCart();
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  const completeCheckout = (method) => {
    axiosclient
      .post("/order/checkout", { paymentMethod: method })
      .then(() => {
        setCartItem([]);
        setCart(null);
        setCheckoutDone(true);
        refreshCart();
        setSnackbar({ message: "Order placed successfully!", type: "success" });
      })
      .catch(() =>
        setSnackbar({ message: "Checkout failed. Please try again.", type: "error" })
      );
  };

  const handleCheckout = () => {
    if (!paymentMethod) {
      setPaymentError(true);
      return;
    }
    if (isCardPayment) return;
    setPaymentError(false);
    completeCheckout(paymentMethod);
  };

  if (checkoutDone) {
    return (
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Order Placed!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Thank you for your purchase.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 capitalize">
            Payment: {paymentMethod.replace("_", " ")}
          </p>
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#22e000] text-black rounded-lg font-semibold hover:bg-green-400 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Shopping Cart
        </h2>

        {cartItem.length === 0 && (
          <div className="mt-12 flex flex-col items-center text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-4">Your cart is empty.</p>
            <Link to="/shop" className="px-6 py-3 bg-[#22e000] text-black rounded-lg font-semibold hover:bg-green-400 transition">
              Browse Shop
            </Link>
          </div>
        )}

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItem.map((item) => (
                <div
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                  key={item.productId}
                >
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <div className="shrink-0 md:order-1">
                      <img
                        className="h-20 w-20 object-cover"
                        src={AssetImage({
                          category: item.Product.categoryId === 1 ? "phasmo" : "valo",
                          imageName: item.Product.image,
                        })}
                        alt={item.Product.name}
                      />
                    </div>

                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleAmount(item.productId, item.amount - 1)}
                          type="button"
                          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                          <svg className="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                          </svg>
                        </button>
                        <div className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 dark:text-white">
                          {item.amount}
                        </div>
                        <button
                          onClick={() => handleAmount(item.productId, item.amount + 1)}
                          type="button"
                          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                          <svg className="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          ${item.subtotal}
                        </p>
                      </div>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {item.Product.name}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => remove(item.productId)}
                          type="button"
                          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                        >
                          <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {cart && cartItem.length > 0 && (
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order summary
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Amount</dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">{cart.quantity}</dd>
                    </dl>
                  </div>
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">${cart.total}</dd>
                  </dl>
                </div>

                {/* Payment method selection */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Payment Method
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map(({ id, label, Icon }) => (
                      <label
                        key={id}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer text-sm transition-colors ${
                          paymentMethod === id
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={(e) => {
                            setPaymentMethod(e.target.value);
                            setPaymentError(false);
                          }}
                          className="accent-indigo-600"
                        />
                        <Icon size={20} />
                        {label}
                      </label>
                    ))}
                  </div>
                  {paymentError && (
                    <p className="text-red-500 text-xs mt-2">Please select a payment method.</p>
                  )}
                </div>

                {isCardPayment && (
                  loadingIntent ? (
                    <p className="text-center text-sm text-gray-400 py-3">Initializing payment...</p>
                  ) : clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: { theme: "stripe" } }}
                    >
                      <StripeCardInput
                        total={cart.total}
                        onSuccess={() => completeCheckout(paymentMethod)}
                        onError={(msg) => setSnackbar({ message: msg, type: "error" })}
                      />
                    </Elements>
                  ) : null
                )}

                {!isCardPayment && (
                  <button
                    onClick={handleCheckout}
                    className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                  >
                    Proceed to Checkout
                  </button>
                )}

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">or</span>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 underline hover:no-underline dark:text-indigo-400"
                  >
                    Continue Shopping
                    <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Snackbar
        type={snackbar.type}
        message={snackbar.message}
        onClose={() => setSnackbar({ message: "", type: "success" })}
      />
    </section>
  );
};

export default Cart;
