import React, { useState, useEffect } from 'react';
import { Datepicker } from '@mobiscroll/react-lite';
import '@mobiscroll/react-lite/dist/css/mobiscroll.min.css';
import axios from 'axios';

// BookingCalendar component
//from react-range .i imported this code from react-range

const BookingCalendar = ({ listingId }) => {
  const [openPicker, setOpenPicker] = useState(false);
  const [disabledRanges, setDisabledRanges] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);



  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Book This Property</h2>

      <Datepicker
        controls={['calendar']}
        select="range"
        touchUi={true}
        inputComponent="input"
        inputProps={props}
        showOnClick={false}
        showOnFocus={false}
        isOpen={openPicker}
        onClose={() => setOpenPicker(false)}
        invalid={disabledRanges}
        value={selectedRange}
        onChange={(e) => setSelectedRange(e.value)}
      />

      <button
        onClick={() => setOpenPicker(true)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Show Calendar
      </button>

      {selectedRange && (
        <div className="text-sm text-gray-700">
          <p><strong>Check-in:</strong> {selectedRange[0]?.toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {selectedRange[1]?.toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
