import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

function ContactForm() {
	const form = useRef();

	const sendEmail = async (e) => {
		e.preventDefault();

		try {
			await emailjs
				.sendForm(
					"service_rjil8gm",
					"template_vakpiby",
					form.current,
					"IWrb4kCihH8p7eTOA"
				)
				.then((result) => {
					console.log(result.text);
					form.current.reset();
				}, 5000);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<section className="bg-gray-100 h-[85.5vh] overflow-hidden">
				<div className="py-3 lg:py-16 px-4 mx-auto max-w-screen-md">
					<h2 className="mb-2 text-4xl tracking-tight font-extrabold text-center text-gray-900">
						Contact Us
					</h2>
					<p className="mb-8 lg:mb-16 font-light text-center text-gray-700 lg:text-xl">
						Got a technical issue? Want to send feedback about a beta
						feature? Need details about our Business plan? Let us
						know.
					</p>
					<form
						ref={form}
						className="space-y-8"
						onSubmit={sendEmail}
					>
						<div>
							<label
								htmlFor="email"
								className="block mb-2 text-lg font-medium text-gray-900"
							>
								Your email
							</label>
							<input
								name="email"
								type="email"
								id="email"
								className="shadow-lg bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
								placeholder="name@codecatalysts.com"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="subject"
								className="block mb-2 text-lg font-medium text-gray-900"
							>
								Subject
							</label>
							<input
								name="subject"
								type="text"
								id="subject"
								className="block p-3 w-full text-lg text-gray-900 bg-white rounded-lg border border-gray-300 shadow-lg focus:ring-primary-500 focus:border-primary-500"
								placeholder="Let us know how we can help you"
								required
							/>
						</div>
						<div className="lg:col-span-2">
							<label
								htmlFor="message"
								className="block mb-2 text-lg font-medium text-gray-900"
							>
								Your message
							</label>
							<textarea
								name="message"
								id="message"
								rows="6"
								className="block p-2 w-full text-lg text-gray-900 bg-white rounded-lg shadow-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
								placeholder="Leave a comment..."
							></textarea>
						</div>
						<button
							type="submit"
							className="py-1.5 px-5 flex m-auto bg-blue-500 hover:bg-blue-600 text-lg font-medium text-center text-white rounded-lg bg-primary-700 lg:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300"
						>
							Send message
						</button>
					</form>
				</div>
			</section>
			<footer className="bg-gray-800 py-4">
				<div className="container mx-auto mb-4 px-4 text-center text-gray-300">
					&copy; 2024 Codecatalysts
				</div>
			</footer>
		</>
	);
}

export default ContactForm;
