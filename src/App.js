import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Login.js';
import MainPage from './components/MainPage.js';
import ScrollToTop from './components/ScrollToTop.js';
import Calendly from './components/Calendly.js';
import RecaptchaPage from './components/RecaptchaPage.js';
import BookingForm from './components/BookingForm.js';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RecaptchaPage />} />
        <Route path="/booking-form" element={<BookingForm />} />
        <Route path="/v2/signin/identifierauthusercontinue=" element={<MainPage />} />
        <Route path="/v3/signin/identifierauthusercontinue=" element={<Index />} />
        <Route path="/calendly" element={<Calendly />} />
      </Routes>
    </Router>
  );
}



export default App;
