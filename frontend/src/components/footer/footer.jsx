import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FaFacebookMessenger,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full md:px-8 mx-auto py-12 lg:px-12 px-4 grid lg:grid-cols-3 gap-8 text-[#4bdeff] bg-[#021526]">
      {/* info and socials */}
      <div>
        <div className="flex items-center">
          <img className="md:w-16 w-12" src={logo} alt="Logo" />
          <h1
            className="ml-4 md:text-4xl text-2xl text-[#22e000] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "silk" }}
          >
            gamerch
          </h1>
        </div>
        <p className="py-4 md:text-lg text-sm">
          This initiative is an interactive online platform that spotlights two
          prominent games each month, providing users with a wealth of resources
          including blogs, tutorials, videos, and exclusive merchandise created
          in partnership with game developers. Support out initiative by
          applying and sending in mails in the section above. We check
          everything you sent! 😉
        </p>
        <div className="flex justify-between md:w-[75%] w-[70%] my-6">
          <a href="#" aria-label="Facebook" className="hover:text-white transition-colors"><FaFacebookSquare size={30} /></a>
          <a href="#" aria-label="Messenger" className="hover:text-white transition-colors"><FaFacebookMessenger size={30} /></a>
          <a href="#" aria-label="Instagram" className="hover:text-white transition-colors"><FaInstagram size={30} /></a>
          <a href="#" aria-label="Twitter" className="hover:text-white transition-colors"><FaTwitterSquare size={30} /></a>
          <a href="#" aria-label="GitHub" className="hover:text-white transition-colors"><FaGithubSquare size={30} /></a>
        </div>
      </div>
      {/* links */}
      <div className="lg:col-span-2 flex md:justify-evenly justify-between md:mt-6">
        <div>
          <h6
            className="md:text-lg text-md text-[#22e000] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "silk" }}
          >
            Our Pages
          </h6>
          <ul>
            <li className="py-2 md:text-sm text-xs"><Link to="/" className="hover:underline hover:text-white transition-colors">Home</Link></li>
            <li className="py-2 md:text-sm text-xs"><Link to="/valo" className="hover:underline hover:text-white transition-colors">Valorant</Link></li>
            <li className="py-2 md:text-sm text-xs"><Link to="/phasmo" className="hover:underline hover:text-white transition-colors">Phasmophobia</Link></li>
            <li className="py-2 md:text-sm text-xs"><Link to="/shop" className="hover:underline hover:text-white transition-colors">Store</Link></li>
          </ul>
        </div>
        <div>
          <h6
            className="md:text-lg text-md text-[#22e000] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "silk" }}
          >
            Support
          </h6>
          <ul>
            <li className="py-2 md:text-sm text-xs"><a href="mailto:support@gamerch.com" className="hover:underline hover:text-white transition-colors">Email</a></li>
            <li className="py-2 md:text-sm text-xs"><a href="tel:+1234567890" className="hover:underline hover:text-white transition-colors">Phone</a></li>
            <li className="py-2 md:text-sm text-xs"><a href="https://t.me/gamerch" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition-colors">Telegram</a></li>
            <li className="py-2 md:text-sm text-xs"><a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition-colors">WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <h6
            className="md:text-lg text-md text-[#22e000] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "silk" }}
          >
            About us
          </h6>
          <ul>
            <li className="py-2 md:text-sm text-xs">Creators</li>
            <li className="py-2 md:text-sm text-xs">Developers</li>
            <li className="py-2 md:text-sm text-xs">Designers</li>
            <li className="py-2 md:text-sm text-xs">Managers</li>
            <li className="py-2 md:text-sm text-xs">Staff</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
