import {Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import React from 'react';
import AddTimeslot from './components/addTimeslot';
import TimeslotList from './components/timeslotList';
import ReportPage from './components/reportPage';


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<AddTimeslot />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/list" element={<TimeslotList />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
