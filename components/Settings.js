'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Button from './Button';
const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [chartType, setChartType] = useState('Pie');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [customMoods, setCustomMoods] = useState([]);
  const [newMood, setNewMood] = useState('');

  // Handlers for settings
  const handleThemeToggle = () => setDarkMode((prev) => !prev);
  const handleChartTypeChange = (e) => setChartType(e.target.value);
  const handleNotificationToggle = () => setNotificationEnabled((prev) => !prev);

  const handleAddMood = () => {
    if (newMood) {
      setCustomMoods([...customMoods, newMood]);
      setNewMood('');
    }
  };

  const handleDeleteMood = (mood) => {
    setCustomMoods(customMoods.filter((item) => item !== mood));
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Theme Toggle */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Theme</h2>
        <button
          onClick={handleThemeToggle}
          className={`mt-2 py-2 px-4 rounded ${
            darkMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* Chart Type Selector */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Default Chart Type</h2>
        <select
          value={chartType}
          onChange={handleChartTypeChange}
          className="mt-2 p-2 border rounded"
        >
          <option value="Pie">Pie Chart</option>
          <option value="Bar">Bar Graph</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={notificationEnabled}
            onChange={handleNotificationToggle}
            className="w-5 h-5"
          />
          Enable Daily Mood Reminder
        </label>
      </div>

      {/* Custom Moods */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Custom Moods</h2>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            placeholder="Add new mood"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddMood}
            className="py-2 px-4 bg-indigo-600 text-white rounded"
          >
            Add
          </button>
        </div>
        <ul className="mt-4">
          {customMoods.map((mood, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 bg-gray-100 rounded mb-2"
            >
              {mood}
              <button
                onClick={() => handleDeleteMood(mood)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Link href={'/dashboard'}>
            <Button text="Go to dashboard" />
      </Link>
    </div>
  );
};

export default Settings;
