// HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [userName, setUserName] = useState('');

  const getUserData = async () => {
    try {
      const res = await axios.get("/api/v1/user/getUserData", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data && res.data.data && res.data.data.firstname) {
        setUserName(res.data.data.firstname); // Adjusted to access firstname correctly
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <h1>Welcome, {userName}</h1> {/* Now this should display the firstname */}
    </div>
  );
};

export default HomePage;
