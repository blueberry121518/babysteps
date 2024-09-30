import React from 'react';
import SimpleForm from '../components/form';

const FormPage = () => {
    return (
        <div className="flex h-screen">
            <div className="w-2/5 bg-[#B8DBD9] p-8">
                <h1 className="text-2xl font-bold mb-4">Generate your microgoals with just four inputs</h1>
                <ul className="space-y-6">
                    <li>Goal Type:</li>
                    <li>If you want to learn how to play the guitar, choose "skill"</li>
                    <li>Goal:</li>
                    <li>"I want to learn how to play the guitar"</li>
                    <li>Date:</li>
                    <li>Microgoals will be generated for you up until this date</li>
                    <li>Frequency:</li>
                    <li>Number of microgoals per week</li>
                </ul>
            </div>
            <div className="w-3/5 flex flex-col items-center justify-center">
                <h1>Form Page</h1>
                <SimpleForm />
            </div>
        </div>
    );
};

export default FormPage;
