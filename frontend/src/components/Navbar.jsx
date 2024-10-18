import React from "react";
import { Link } from "react-router-dom";
import svg from "../assets/react.svg";

const Navbar = () => {
  return (
    <nav className="navbar bg-gray-800 text-white w-full top-0 z-50">
      <div>
        <nav className="bg-white border-gray-200 border-b-2 dark:bg-gray-900">
          <div className="max-w-screen-3xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                CodeCatalyst
              </span>
            </Link>
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src={svg}
                  referrerPolicy="no-referrer"
                  alt="Name"
                />
              </button>
              {/* Dropdown menu */}
              <div
                className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">{"Name"}</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{"test123@test.com"}</span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Earnings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
              <button
                data-collapse-toggle="navbar-user"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-user"
            >
              <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:mt-0 md:flex-row md:border-0">
                <li>
                  <Link
                    to="/"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700"
                  >
                    Search
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700"
                  >
                    Docs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/prediction"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700"
                  >
                    Prediction
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/qna"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700"
                  >
                    DocLLM
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    to="/gen"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700"
                  >
                    Generate Doc
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/contact"
                    className="block py-2 px-3 text-white rounded hover:bg-gray-700"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
