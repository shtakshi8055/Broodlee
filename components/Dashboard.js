// 'use client';
// import { Fugaz_One } from 'next/font/google';
// import React, { useEffect, useState } from 'react';
// import Calendar from './Calendar';
// import { useAuth } from '@/context/AuthContext';
// import Loading from './Loading';
// import Login from './Login';
// import { FaUserCircle } from 'react-icons/fa';

// const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

// export default function Dashboard() {
//   const { currentUser, loading } = useAuth();
//   const [data, setData] = useState({});
//   const [userMood, setUserMood] = useState(null); // Track the current user's mood
//   const [confetti, setConfetti] = useState(false); // State to trigger confetti
//   const [windowWidth, setWindowWidth] = useState(0);
//   const [windowHeight, setWindowHeight] = useState(0);
//   const now = new Date();

//   // Helper functions to interact with local storage
//   const LOCAL_STORAGE_KEY = 'userData';

//   const saveToLocalStorage = (uid, data) => {
//     // Save data for the current user using the user's UID
//     localStorage.setItem(`${LOCAL_STORAGE_KEY}_${uid}`, JSON.stringify(data));
//   };

//   const loadFromLocalStorage = (uid) => {
//     // Load data for the current user using the user's UID
//     const savedData = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${uid}`);
//     return savedData ? JSON.parse(savedData) : {};
//   };

//   // Calculate stats
//   function countValues() {
//     let total_number_of_days = 0;
//     let sum_moods = 0;
//     for (let year in data) {
//       for (let month in data[year]) {
//         for (let day in data[year][month]) {
//           let days_mood = data[year][month][day];
//           total_number_of_days++;
//           sum_moods += days_mood;
//         }
//       }
//     }
//     return { num_days: total_number_of_days, average_mood: sum_moods / total_number_of_days || 0 };
//   }

//   const statuses = {
//     ...countValues(),
//     time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
//   };

//   // Handle mood selection and persist to local storage
//   const handleSetMood = (mood) => {
//     const day = now.getDate();
//     const month = now.getMonth();
//     const year = now.getFullYear();

//     const newData = { ...data };
//     if (!newData[year]) newData[year] = {};
//     if (!newData[year][month]) newData[year][month] = {};

//     newData[year][month][day] = mood;

//     setData(newData); // Update state
//     saveToLocalStorage(currentUser.uid, newData); // Save to local storage with the current user's UID
//     setUserMood(mood); // Update the user mood state

//     if (mood === 'Elated') {
//       setConfetti(true);
//       setTimeout(() => setConfetti(false), 5000); // Stop confetti after 5 seconds
//     }
//   };



//   const moods = {
//     '&*@#$': '😭',
//     'Sad': '😢',
//     'Existing': '😶',
//     'Good': '😊',
//     'Elated': '😍',
//   };

//   // Load data from local storage on component mount
//   useEffect(() => {
//     if (currentUser) {
//       const savedData = loadFromLocalStorage(currentUser.uid); // Load data based on current user's UID
//       setData(savedData);

//       // Load user's mood from localStorage, if exists
//       const userMoodFromStorage = localStorage.getItem(`user_mood_${currentUser.uid}`);
//       if (userMoodFromStorage) {
//         setUserMood(userMoodFromStorage);
//       }
//     }
    
//   }, [currentUser]);

//   // Store the user's mood in localStorage when it changes
//   useEffect(() => {
//     if (currentUser && userMood !== null) {
//       localStorage.setItem(`user_mood_${currentUser.uid}`, userMood);
//     }
//   }, [userMood, currentUser]);

//   if (loading) {
//     return <Loading />;
//   }

//   if (!currentUser) {
//     return <Login />;
//   }

//   return (
//     <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
//       {confetti && <Confetti width={windowWidth} height={windowHeight} recycle={false} numberOfPieces={200} />}
//       {/* Shared Content Visible to All Users */}
//       <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'>
//         {Object.keys(statuses).map((status, statusIndex) => (
//           <div key={statusIndex} className='flex flex-col gap-1 sm:gap-2'>
//             <p className='font-medium capitalize text-xs sm:text-sm truncate'>
//               {status.replaceAll('_', ' ')}
//             </p>
//             <p className={'text-base sm:text-lg truncate ' + fugaz.className}>
//               {statuses[status]}{status === 'num_days' ? ' 🔥' : ''}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Mood Section (User Specific) */}
//       <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
//         How do you <span className='textGradient'>feel</span> today?
//       </h4>
//       <div className='flex items-stretch flex-wrap gap-4'>
//         {Object.keys(moods).map((mood, moodIndex) => (
//           <button
//             onClick={() => handleSetMood(moodIndex + 1)}
//             className='p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1'
//             key={moodIndex}
//           >
//             <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
//             <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>
//               {mood}
//             </p>
//           </button>
//         ))}
//       </div>

//       {/* Calendar (Shared Content) */}
//       <Calendar completeData={data} handleSetMood={handleSetMood} />
//     </div>
//   );
// }

'use client';
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import Loading from './Loading';
import Login from './Login';
import { FaUserCircle } from 'react-icons/fa';
import ReactModal from 'react-modal'; // Modal library for journal notes
import Confetti from 'react-confetti'; // For the existing confetti feature

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

export default function Dashboard() {
  const { currentUser, loading } = useAuth();
  const [data, setData] = useState({});
  const [userMood, setUserMood] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); 
  const [journalNotes, setJournalNotes] = useState('');
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const now = new Date();

  const LOCAL_STORAGE_KEY = 'userData';

  // Save and load data for user-specific storage
  const saveToLocalStorage = (uid, data) => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${uid}`, JSON.stringify(data));
  };

  const loadFromLocalStorage = (uid) => {
    const savedData = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${uid}`);
    return savedData ? JSON.parse(savedData) : {};
  };

  const saveJournalToLocalStorage = (uid, journalData) => {
    localStorage.setItem(`journal_${LOCAL_STORAGE_KEY}_${uid}`, JSON.stringify(journalData));
  };

  const loadJournalFromLocalStorage = (uid) => {
    const savedData = localStorage.getItem(`journal_${LOCAL_STORAGE_KEY}_${uid}`);
    return savedData ? JSON.parse(savedData) : {};
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
    return { num_days: total_number_of_days, average_mood: sum_moods / total_number_of_days || 0 };
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

    if (mood === 'Elated') {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
    }
  };

  const moods = {
    '&*@#$': '😭',
    'Sad': '😢',
    'Existing': '😶',
    'Good': '😊',
    'Elated': '😍',
  };

  // Journal Modal Handling
  const handleDateClick = (year, month, day) => {
    setSelectedDate({ year, month, day });
    const journal = data[year]?.[month]?.[day]?.note || '';
    setJournalNotes(journal);
  };

  const handleSaveJournal = () => {
    if (selectedDate) {
      const { year, month, day } = selectedDate;

      const updatedData = { ...data };
      if (!updatedData[year]) updatedData[year] = {};
      if (!updatedData[year][month]) updatedData[year][month] = {};

      if (!updatedData[year][month][day]) {
        updatedData[year][month][day] = {};
      }

      updatedData[year][month][day].note = journalNotes;

      setData(updatedData);
      saveToLocalStorage(currentUser.uid, updatedData);
      setSelectedDate(null); // Close the modal
    }
  };

  // Load data on mount
  useEffect(() => {
    if (currentUser) {
      setData(loadFromLocalStorage(currentUser.uid));
    }
  }, [currentUser]);

  // Responsive confetti sizing
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  if (loading) return <Loading />;
  if (!currentUser) return <Login />;

  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      {confetti && <Confetti width={windowWidth} height={windowHeight} recycle={false} numberOfPieces={200} />}

      {/* Status Bar */}
      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'>
        {Object.keys(statuses).map((status, statusIndex) => (
          <div key={statusIndex} className='flex flex-col gap-1 sm:gap-2'>
            <p className='font-medium capitalize text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
            <p className={'text-base sm:text-lg truncate ' + fugaz.className}>
              {statuses[status]}{status === 'num_days' ? ' 🔥' : ''}
            </p>
          </div>
        ))}
      </div>

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
      <Calendar completeData={data} handleDateClick={handleDateClick} />

      {/* Journal Modal */}
      <ReactModal isOpen={!!selectedDate} onRequestClose={() => setSelectedDate(null)} className="journal-modal">
        <h2>Journal Notes</h2>
        <textarea
          value={journalNotes}
          onChange={(e) => setJournalNotes(e.target.value)}
          className="textarea"
        />
        <button onClick={handleSaveJournal} className="save-button">Save</button>
      </ReactModal>
    </div>
  );
}
