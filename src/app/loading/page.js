"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Loading() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = Object.fromEntries(searchParams.entries());

	console.log('Query data:', query); // Log the query data

	useEffect(() => {
		const sendDataToAPI = async () => {
			const dataToSend = { ...query, type: query.type };
			console.log('Data to send to OpenAI:', dataToSend); // Log the data being sent

			try {
				console.log("sending to api file");
				const response = await fetch('/api/open-ai', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`,
					},
					body: JSON.stringify(dataToSend),
				});

				console.log('Response status:', response.status); // Log the response status

				if (!response.ok) {
					const errorText = await response.text(); // Get error text for more details
					console.error('Network response was not ok:', errorText);
					throw new Error('Network response was not ok');
				}

				const responseData = await response.json();
				console.log('Response from OpenAI:', responseData); // Log the response data

				// Redirect to results page with response data in query params
				const params = new URLSearchParams({ data: JSON.stringify(responseData) });
				router.push(`/results?${params.toString()}`);
			} catch (error) {
				console.error('Error sending data to OpenAI:', error); // Log any errors
			}
		};

		if (Object.keys(query).length > 0) {
			sendDataToAPI();
		}
	}, [query]);

	return <div className="flex flex-col items-center justify-center min-h-screen text-[#F4F4F9">
        <h1 className="text-2xl font-bold">Loading...</h1>
        <img src="/images/loading.gif" alt="Loading..." />
        </div>;
}