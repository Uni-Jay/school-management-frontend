import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold">Total Schools</h3>
          <p className="text-2xl font-bold">25</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold">Total Students</h3>
          <p className="text-2xl font-bold">1,200</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold">Total Teachers</h3>
          <p className="text-2xl font-bold">150</p>
        </div>
        {/* Add more cards as needed */}
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Enrollment Trends</h2>
        {/* Insert chart component here */}
        <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
          Chart goes here
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>New student registered in School A</li>
          <li>Fee payment pending for Student X</li>
          <li>Upcoming exam scheduled for next week</li>
          {/* Fetch real notifications dynamically */}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
