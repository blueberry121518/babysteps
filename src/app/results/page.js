"use client"

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Results() {
    const searchParams = useSearchParams();
    const [microGoals, setMicroGoals] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const dataParam = searchParams.get('data');
        if (dataParam) {
            try {
                const parsedData = JSON.parse(dataParam);
                if (parsedData.MicroGoals) {
                    setMicroGoals(parsedData.MicroGoals);
                }
            } catch (error) {
                console.error('Failed to parse data:', error);
            }
        }
    }, [searchParams]);

    const handleNext = () => {
        console.log("Current Index:", currentIndex);
        console.log("MicroGoals Length:", microGoals.length);
        if (currentIndex < microGoals.length - 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % microGoals.length);
        } else {
            setCurrentIndex(microGoals.length + 1);
        }
    };

    const currentSet = microGoals[currentIndex];

    const handleAccept = async () => {
        if (microGoals[currentIndex]) {
            const dataToSend = microGoals[currentIndex];
            console.log('Data sent to API:', dataToSend); // Log the data being sent

            try {
                const response = await fetch('/api/enter-event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });
                if (response.ok) {
                    setMessage('Event entered into calendar!');
                    setTimeout(() => setMessage(''), 1000);
                } else {
                    console.error('Failed to enter event:', response.statusText);
                    const errorData = await response.json();
                    console.error('Error details:', errorData);
                }
            } catch (error) {
                console.error('Failed to enter event:', error);
            }
        }
        handleNext();
    };

    const handleReject = () => {
        handleNext();
    };

    const handleCreateNew = () => {
        window.location.href = '/';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#021526] text-white">
            {message && <div className="bg-green-500 p-2 rounded mb-4">{message}</div>}
            {currentIndex < microGoals.length ? (
                currentSet ? (
                    <div className="bg-[#021526] p-6 rounded-lg shadow-lg text-center max-w-lg w-full m-5">
                        <h2 className="text-2xl font-bold mb-4">Summary: {currentSet.Summary}</h2>
                        <p className="mb-2">Description: {currentSet.Description}</p>
                        <p className="mb-2">Start: {currentSet.Start}</p>
                        <p className="mb-2">End: {currentSet.End}</p>
                    </div>
                ) : (
                    <div className="bg-[#021526] p-6 rounded-lg shadow-lg text-center max-w-lg w-full m-5">
                        <p>Loading...</p>
                        <pre>{JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}</pre>
                    </div>
                )
            ) : (
                <div className="bg-[#021526] p-6 rounded-lg shadow-lg text-center max-w-lg w-full m-5">
                    <h2 className="text-2xl font-bold mb-4">Good Luck!</h2>
                    <button onClick={handleCreateNew} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create New</button>
                </div>
            )}
            {currentIndex < microGoals.length && (
                <div className="flex justify-between w-48 mt-5">
                    <button onClick={handleReject} disabled={microGoals.length === 0} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Reject</button>
                    <button onClick={handleAccept} disabled={microGoals.length === 0} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Accept</button>
                </div>
            )}
        </div>
    );
}