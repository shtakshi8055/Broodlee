'use client';
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Loading from './Loading';
import Login from './Login';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Button from './Button';
import Dashboard from './Dashboard';
import Link from 'next/link';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function MoodTrackingComponent() {
  const { currentUser, loading } = useAuth();
  const [data, setData] = useState({});
  const [moodCounts, setMoodCounts] = useState({
    '😭 Sad': 0,
    '😢 Upset': 0,
    '😶 Neutral': 0,
    '😊 Good': 0,
    '😍 Elated': 0,
  });
  const [averageMood, setAverageMood] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);  // Track dark mode state

  const now = new Date();
  const LOCAL_STORAGE_KEY = 'userData';
  const MOOD_COUNTS_KEY = 'moodCounts';

  // Save to Local Storage
  const saveToLocalStorage = (uid, data) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${uid}`, JSON.stringify(data));
  };

  const loadFromLocalStorage = (uid) => {
    const savedData = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${uid}`);
    return savedData ? JSON.parse(savedData) : {};
  };

  const saveMoodCountsToLocalStorage = (uid, counts) => {
    localStorage.setItem(`${MOOD_COUNTS_KEY}_${uid}`, JSON.stringify(counts));
  };

  const loadMoodCountsFromLocalStorage = (uid) => {
    const savedCounts = localStorage.getItem(`${MOOD_COUNTS_KEY}_${uid}`);
    return savedCounts
      ? JSON.parse(savedCounts)
      : {
          '😭 Sad': 0,
          '😢 Upset': 0,
          '😶 Neutral': 0,
          '😊 Good': 0,
          '😍 Elated': 0,
        };
  };

  // Calculate stats
  function countValues() {
    let total_number_of_days = 0;
    let sum_moods = 0;
    for (let year in data) {
      for (let month in data[year]) {
        for (let day in data[year][month]) {
          let days_mood = data[year][month][day];
          total_number_of_days++;
          sum_moods += days_mood;
        }
      }
    }
    return {
      num_days: total_number_of_days,
      average_mood: sum_moods / total_number_of_days || 0,
    };
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
  };

  const moods = {
    '😭 Sad': '😭',
    '😢 Upset': '😢',
    '😶 Neutral': '😶',
    '😊 Good': '😊',
    '😍 Elated': '😍',
  };

  // Calculate average mood score
  const totalMoodValue = Object.entries(moodCounts).reduce((sum, [mood, count], index) => {
    const moodScore = index + 1; 
    return sum + moodScore * count;
  }, 0);

  const totalMoodCount = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
  const averageMoodScore = totalMoodCount > 0 ? (totalMoodValue / totalMoodCount).toFixed(2) : 0;

  // Bar chart data with dynamic colors
  const barChartData = {
    labels: ['Average Mood Score'],
    datasets: [
      {
        label: 'Average Mood Score',
        data: [averageMoodScore],
        backgroundColor: isDarkMode ? '#9e9e9e' : '#4caf50', // Light green for light mode, grey for dark mode
        borderColor: isDarkMode ? '#000000' : '#ffffff', // White border in dark mode
        borderWidth: 1,
      },
    ],
  };
  
  const barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: isDarkMode ? '#000000' : '#ffffff' // Change tick color based on theme
        },
        grid: {
          color: isDarkMode ? '#000000' : '#ffffff' // Change grid line color based on theme
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? '#000000' : '#ffffff' // Change tick color based on theme
        },
        grid: {
          color: isDarkMode ? '#000000' : '#ffffff' // Change grid line color based on theme
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const averageScore = tooltipItem.raw;
            const lastDate = new Date().toLocaleDateString();
            return `Avg Mood: ${averageScore} Date: ${lastDate}`;
          },
        },
      },
    },
  };
  
  useEffect(() => {
    if (currentUser) {
      setData(loadFromLocalStorage(currentUser.uid));
      setMoodCounts(loadMoodCountsFromLocalStorage(currentUser.uid));
    }

    // Optional: Detect if the theme is dark or light based on user preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  }, [currentUser]);

  if (loading) return <Loading />;
  if (!currentUser) return <Login />;

  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      {/* Status Bar */}
      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg text-center'>
        {Object.keys(statuses).map((status, statusIndex) => (
          <div key={statusIndex} className='flex flex-col gap-1 sm:gap-2'>
            <p className='font-medium capitalize text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
            <p className={'text-base sm:text-lg truncate ' + fugaz.className}>
            {status === "num_days" ? (
                `${statuses[status]} 🔥`
              ) : status === "average_mood" ? (
                `${averageMoodScore}`  // Display average mood here
              ) : (
                statuses[status]
              )}
            </p>
          </div>
        ))}
      </div>

      <h4 className={'text-center text-4xl textGradient ' + fugaz.className} style={{ marginBottom: '-20px' }}>
        Mood History
      </h4>

      {/* Bar Graph Section */}
      <div
        className={'textGradient items-center' + fugaz.className}
        style={{ width: '100%', height: '300px', margin: '20px auto' }}
      >
        <Bar data={barChartData} options={barChartOptions} />
      </div>
      <Link href={'/dashboard'}>
            <Button text="Go to dashboard" />
      </Link>
    </div>
  );
}

// 'use client'
// import React, { useState, useEffect } from "react";
// import { Pie } from "react-chartjs-2";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import Confetti from 'react-confetti';
// import { Modal, Button } from 'react-bootstrap';
// import { AuthContext } from './AuthContext'; // Assuming you have the AuthContext for user authentication

// // Registering chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const moodValues = {
//   '😭 Sad': 1,
//   '😢 Upset': 2,
//   '😐 Neutral': 3,
//   '😊 Good': 4,
//   '😍 Elated': 5,
// };

// const MoodTrackingComponent = () => {
//   const [mood, setMood] = useState(null);
//   const [moodCounts, setMoodCounts] = useState({});
//   const [averageMood, setAverageMood] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [confetti, setConfetti] = useState(false);

//   const { user } = React.useContext(AuthContext);

//   useEffect(() => {
//     if (user) {
//       const storedData = JSON.parse(localStorage.getItem(user.uid));
//       if (storedData) {
//         setMoodCounts(storedData.moodCounts || {});
//         setAverageMood(storedData.averageMood || []);
//       }
//     }
//   }, [user]);

//   const handleMoodSelection = (selectedMood) => {
//     const today = new Date().toLocaleDateString();
//     const newMoodCounts = { ...moodCounts, [selectedMood]: (moodCounts[selectedMood] || 0) + 1 };
//     const newAverageMood = calculateAverageMood(newMoodCounts);
    
//     setMoodCounts(newMoodCounts);
//     setAverageMood(newAverageMood);
//     localStorage.setItem(user.uid, JSON.stringify({ moodCounts: newMoodCounts, averageMood: newAverageMood }));

//     setMood(selectedMood);
//     if (selectedMood === '😍 Elated') {
//       setConfetti(true);
//       setTimeout(() => setConfetti(false), 3000);
//     }
//   };

//   const calculateAverageMood = (moodCounts) => {
//     const moodSum = Object.entries(moodCounts).reduce((sum, [mood, count]) => {
//       return sum + moodValues[mood] * count;
//     }, 0);

//     const totalCount = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
//     const average = totalCount > 0 ? moodSum / totalCount : 0;

//     return average;
//   };

//   const pieData = {
//     labels: Object.keys(moodCounts),
//     datasets: [
//       {
//         data: Object.values(moodCounts),
//         backgroundColor: ['#FF0000', '#FF8C00', '#FFFF00', '#32CD32', '#00BFFF'],
//       },
//     ],
//   };

//   const barData = {
//     labels: Object.keys(moodCounts),
//     datasets: [
//       {
//         label: 'Average Mood',
//         data: [averageMood],
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="container">
//       <h2>Track Your Mood</h2>
//       <div>
//         {Object.keys(moodValues).map((moodOption) => (
//           <button
//             key={moodOption}
//             onClick={() => handleMoodSelection(moodOption)}
//             style={{ fontSize: '20px', margin: '5px' }}
//           >
//             {moodOption}
//           </button>
//         ))}
//       </div>

//       <div style={{ marginTop: '30px' }}>
//         <h3>Your Mood Distribution</h3>
//         <Pie data={pieData} />
//         <div onClick={() => setShowModal(true)}>
//           <h4>Click here for Mood Summary</h4>
//         </div>
//       </div>

//       <div style={{ marginTop: '30px' }}>
//         <h3>Average Mood Per Day</h3>
//         <Bar data={barData} />
//       </div>

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Mood Summary</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h5>Mood Distribution:</h5>
//           <ul>
//             {Object.entries(moodCounts).map(([mood, count]) => (
//               <li key={mood}>{mood}: {count}</li>
//             ))}
//           </ul>
//           <h5>Average Mood: {averageMood.toFixed(2)}</h5>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {confetti && <Confetti />}
//     </div>
//   );
// };

// export default MoodTrackingComponent;
