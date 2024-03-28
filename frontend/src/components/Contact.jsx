import React from "react";
import { FaEnvelope, FaEdit, FaCommentDots } from "react-icons/fa";

function ContactForm() {
  return (
    <>
      <section className="bg-gray-800 h-[85.5vh] overflow-hidden text-gray-300">
        <div className="py-3 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-2 text-4xl tracking-tight font-extrabold text-center text-white">
            Contact Us
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-400 lg:text-xl">
            Got a technical issue? Want to send feedback about a beta feature?
            Need details about our Business plan? Let us know.
          </p>
          <form className="space-y-8">
            <div>
              <div className="flex items-center mb-2">
                <FaEnvelope size={24} className="text-orange-300 mr-2" />
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-gray-300"
                >
                  Your email
                </label>
              </div>
              <input
                type="email"
                id="email"
                className="shadow-lg bg-gray-700 border border-gray-600 text-gray-300 text-lg rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
                placeholder="name@flowbite.com"
                required
              />
            </div>
            <div>
              <div className="flex items-center mb-2">
                <FaEdit size={24} className="text-green-300 mr-2" />
                <label
                  htmlFor="subject"
                  className="block text-lg font-medium text-gray-300"
                >
                  Subject
                </label>
              </div>
              <input
                type="text"
                id="subject"
                className="block p-3 w-full text-lg text-gray-300 bg-gray-700 rounded-lg border border-gray-600 shadow-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Let us know how we can help you"
                required
              />
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center mb-2">
                <FaCommentDots size={24} className="text-blue-300 mr-2" />
                <label
                  htmlFor="message"
                  className="block text-lg font-medium text-gray-300"
                >
                  Your message
                </label>
              </div>
              <textarea
                id="message"
                rows="6"
                className="block p-2 w-full text-lg text-gray-300 bg-gray-700 rounded-lg shadow-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="py-1.5 px-5 flex m-auto bg-purple-600 hover:bg-purple-700 text-lg font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-purple-300"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
      <footer className="bg-gray-900 py-4">
        <div className="container mx-auto mb-4 px-4 text-center text-gray-400">
          &copy; 2023 Codecatalysts
        </div>
      </footer>
    </>
  );
}

export default ContactForm;