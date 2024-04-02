import { useEffect, useRef } from "react";

export default function ViewerComponent(props) {
	const containerRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;
		let instance, PSPDFKit;
		(async function () {
			PSPDFKit = await import("pspdfkit");

			PSPDFKit.unload(container);

			instance = await PSPDFKit.load({
				container,
				document: props.document,
				baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
			});
		})();

		return () => PSPDFKit && PSPDFKit.unload(container);
	}, []);

	return (
		<div
			ref={containerRef}
			style={{ width: "100%", height: "100vh" }}
		/>
	);
}
