"use client"

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

function SimpleForm() {
  const formRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission initiated.');

    const formData = new FormData(formRef.current);
    const data = {
      type: selectedType,
      goal: formData.get('goal'),
      date: formData.get('date'),
      frequency: formData.get('frequency'),
    };

    const pathname = '/loading'; // Ensure this is a string
    console.log('Navigating to:', pathname);

    if (typeof pathname !== 'string') {
      console.error('Pathname is not a string:', pathname);
      return;
    }

    const queryString = new URLSearchParams(data).toString();
    router.push(`${pathname}?${queryString}`);
  };

  const typeOptions = ['Skill', 'Habit', 'Project'];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 w-2/3 mx-auto text-[#F4F4F9]">
      <div className="flex space-x-4 mb-4">
        {typeOptions.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full border ${
              selectedType === type
                ? 'bg-blue-500 text-white'
                : 'bg-white text-black'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="goal" className="block mb-1">Goal:</label>
        <input
          type="text"
          id="goal"
          name="goal"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="date" className="block mb-1">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block mb-1">Frequency per week:</label>
        <select
          id="frequency"
          name="frequency"
          required
          className="w-full px-3 py-2 border rounded"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
}

export default SimpleForm;