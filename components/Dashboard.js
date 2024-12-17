'use client';
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import Loading from './Loading';
import Login from './Login';
import { FaUserCircle } from 'react-icons/fa';
import ReactModal from 'react-modal';
import Confetti from 'react-confetti';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useMood } from '@/context/MoodContext';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function Dashboard() {
  const { currentUser, loading } = useAuth();
  const [data, setData] = useState({});
  const [userMood, setUserMood] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [moodCounts, setMoodCounts] = useState({
    '😭 Sad': 0,
    '😢 Upset': 0,
    '😶 Neutral': 0,
    '😊 Good': 0,
    '😍 Elated': 0,
  });
  const [showModal, setShowModal] = useState(false); // For the pie chart modal
  const [averageMood, setAverageMood] = useState(0); // Store average mood value
  const [barGraphData, setBarGraphData] = useState(null); // Store data for bar graph
  const [currentDate, setCurrentDate] = useState(new Date()); // Track current date to detect day change
  
  const now = new Date();
  const LOCAL_STORAGE_KEY = 'userData';
  const MOOD_COUNTS_KEY = 'moodCounts';

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
    return savedCounts ? JSON.parse(savedCounts) : {
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
  
  // Handle mood selection
  const handleSetMood = (mood) => {
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    const newData = { ...data };
    if (!newData[year]) newData[year] = {};
    if (!newData[year][month]) newData[year][month] = {};

    newData[year][month][day] = mood;

    setData(newData);
    saveToLocalStorage(currentUser.uid, newData);
    setUserMood(mood);

    // Update moodCounts
    const moodLabel = Object.keys(moods)[mood - 1];
    const updatedMoodCounts = {
      ...moodCounts,
      [moodLabel]: (moodCounts[moodLabel] || 0) + 1,
    };
    setMoodCounts(updatedMoodCounts);
    saveMoodCountsToLocalStorage(currentUser.uid, updatedMoodCounts);

    if (moodLabel === '😍 Elated') {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
    }
  };

  const moods = {
    '😭 Sad': '😭',
    '😢 Upset': '😢',
    '😶 Neutral': '😶',
    '😊 Good': '😊',
    '😍 Elated': '😍',
  };

  // Prepare data for the pie chart
  const pieChartData = {
    labels: Object.keys(moods),
    datasets: [
      {
        label: 'Mood Counts',
        data: Object.values(moodCounts),
        backgroundColor: ['#ff4b5c', '#ffc93c', '#a1de93', '#6a4c93', '#00a896'],
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Load data on mount
  useEffect(() => {
    if (currentUser) {
      setData(loadFromLocalStorage(currentUser.uid));
      setMoodCounts(loadMoodCountsFromLocalStorage(currentUser.uid));
    }
  }, [currentUser]);

  // Responsive confetti sizing
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  // Calculate average mood when mood counts change
  useEffect(() => {
    const totalMoods = Object.entries(moodCounts).reduce((acc, [mood, count], index) => {
      const moodValue = index + 1; // Map '😭' to 1, '😢' to 2, etc.
      return acc + (moodValue * count);
    }, 0);
    const totalCount = Object.values(moodCounts).reduce((acc, count) => acc + count, 0);
    setAverageMood(totalCount > 0 ? (totalMoods / totalCount).toFixed(2) : 0);
  }, [moodCounts]);

  // Open modal with mood summary
  const handlePieChartClick = () => {
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Check for day change and reset the pie chart
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      if (newDate.getDate() !== currentDate.getDate()) {
        setMoodCounts({
          '😭 Sad': 0,
          '😢 Upset': 0,
          '😶 Neutral': 0,
          '😊 Good': 0,
          '😍 Elated': 0,
        });
        setCurrentDate(newDate); // Update the currentDate to track the new day
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [currentDate]);

  if (loading) return <Loading />;
  if (!currentUser) return <Login />;

  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      {confetti && <Confetti width={windowWidth} height={windowHeight} recycle={false} numberOfPieces={500} />}

      {/* Status Bar */}
      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg text-center '>
        {Object.keys(statuses).map((status, statusIndex) => (
          <div key={statusIndex} className='flex flex-col gap-1 sm:gap-2'>
            <p className='font-medium capitalize text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
            <p className={"text-base sm:text-lg truncate " + fugaz.className}>
              {status === "num_days" ? (
                `${statuses[status]} 🔥`
              ) : status === "average_mood" ? (
                `${averageMood}`  // Display average mood here
              ) : (
                statuses[status]
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Mood Distribution Title */}
      <h4 className={'text-center text-4xl textGradient ' + fugaz.className} style={{ marginBottom: '-20px' }}>
        Mood Distribution
      </h4>

      {/* Pie Chart Section */}
      <div
        className={'textGradient' + fugaz.className}
        style={{ width: '300px', height: '300px', margin: '0 auto' }}
        onClick={handlePieChartClick} // Add click handler
      >
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>

      {/* Modal for Mood Summary */}
      <ReactModal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Mood Summary"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className={'text-center text-4xl textGradient ' + fugaz.className}>Mood Summary</h2>
        <div className="p-4">
          <p>Total Moods Recorded: {Object.values(moodCounts).reduce((a, b) => a + b, 0)}</p>
          <p>Average Mood: {averageMood}</p>
          <ul>
            {Object.keys(moodCounts).map((mood) => (
              <li key={mood}>
                {mood}: {moodCounts[mood]} times
              </li>
            ))}
          </ul>
        </div>
        <button onClick={closeModal} className='rounded-full overflow-hidden duration-200 hover:opacity-60 border-2 border-solid border-indigo-600 '>Close</button>
      </ReactModal>

      {/* Mood Section */}
      <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
        How do you <span className='textGradient'>feel</span> today?
      </h4>
      <div className='flex items-stretch flex-wrap gap-4'>
        {Object.keys(moods).map((mood, moodIndex) => (
          <button
            onClick={() => handleSetMood(moodIndex + 1)}
            className='p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1'
            key={moodIndex}
          >
            <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
            <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>
              {mood}
            </p>
          </button>
        ))}
      </div>

      {/* Calendar */}
      <Calendar completeData={data} />
    </div>
  );
}

