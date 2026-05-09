import "../Newsletter/newsletter.css";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import back from "../assets/contacto.jpg";

const Newsletter = () => {
  const form = useRef();
  const [notification, setNotification] = useState({ message: "", type: "" });

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
      )
      .then(
        () => {
          setNotification({
            message: "Message received! Thank you for contacting us.",
            type: "success",
          });
          form.current.reset();
          setTimeout(() => setNotification({ message: "", type: "" }), 5000);
        },
        (error) => {
          console.error("EmailJS error:", error.text);
          setNotification({
            message: "Failed to send the message. Please try again later.",
            type: "error",
          });
          setTimeout(() => setNotification({ message: "", type: "" }), 5000);
        },
      );
  };

  return (
    <div
      className="flex flex-col md:flex-row justify-between items-start p-6 md:p-8"
      style={{
        backgroundImage: "url(" + back + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Text Section */}
      <div
        className="md:flex-1 mb-6 md:mb-0 px-4 md:px-6 p-4 rounded-lg"
        style={{ fontFamily: "jaro" }}
      >
        <h1 className="text-5xl mb-4" style={{ color: "#b0e7ff" }}>
          We would love to hear your ideas and suggestions!
        </h1>
        <h3 className="text-2xl mb-4" style={{ color: "#ccb5ff" }}>
          Contact Us Here 👉
        </h3>
      </div>

      {/* Form Section */}
      <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-end w-full md:w-[400px] lg:w-[500px] xl:w-[600px] px-4 md:px-6 mt-6 md:mt-0">
        {notification.message && (
          <div
            className={`mb-4 p-2 text-white text-center rounded-md w-full ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {notification.message}
          </div>
        )}
        <form ref={form} onSubmit={sendEmail} className="space-y-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="user_name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="user_email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your message"
              rows="4"
              required
            />
          </div>
          <div>
            <input
              type="submit"
              value="Send"
              className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
