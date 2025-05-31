import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">About BookNest</h1>

      <p className="text-lg text-gray-700 mb-6">
        BookNest is your gateway to unforgettable travel experiences. Whether you're planning a solo escape, a romantic getaway, or a family vacation, Wanderlust helps you discover and book beautiful properties across the globe.
      </p>

      <p className="text-lg text-gray-700 mb-6">
        We connect curious travelers with welcoming hosts and unique stays. Our platform is built to ensure seamless bookings, transparent pricing, and verified reviews, so you can explore new places with confidence.
      </p>

      <p className="text-lg text-gray-700 mb-6">
        Founded in 2025, BookNest is on a mission to make travel more personal, meaningful, and accessible. With hundreds of listings and a growing community, we’re helping people find a place they can call home—anywhere in the world.
      </p>

      <div className="bg-blue-100 p-6 rounded-xl shadow mt-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">What Makes Us Special</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Verified properties with real-time availability</li>
          <li>Secure payments and instant booking confirmations</li>
          <li>Detailed reviews from real guests</li>
          <li>Interactive maps and weather insights</li>
          <li>Seamless communication between guests and hosts</li>
        </ul>
      </div>

      <p className="mt-10 text-center text-gray-600">
        Thank you for choosing BookNest. Let's make your next trip unforgettable!
      </p>
    </div>
  );
};

export default About;
