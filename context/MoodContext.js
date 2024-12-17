'use client'
import React, { createContext, useContext, useState } from 'react';
const MoodContext = createContext();
export const useMood = () => useContext(MoodContext);

export const MoodProvider = ({ children }) => {
    const [moodData, setMoodData] = useState([]);
    
    const addMood = (mood) => {
        const newMoodData = [
            ...moodData,
            { date: new Date().toISOString().split('T')[0], mood },
        ];
        setMoodData(newMoodData);
        localStorage.setItem('moodData', JSON.stringify(newMoodData)); // Persist to local storage
    };

    const getAverageMood = () => {
        if (moodData.length === 0) return 0;
        const totalMood = moodData.reduce((acc, curr) => acc + curr.mood, 0);
        return totalMood / moodData.length;
    };

    return (
        <MoodContext.Provider value={{ moodData, addMood, getAverageMood }}>
            {children}
        </MoodContext.Provider>
    );
};
