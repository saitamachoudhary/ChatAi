import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React from "react";

export default function Timeline({ tasks }) {
  const dates = tasks.map(t => new Date(t.dueDate).toDateString());

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">📅 Timeline</h2>
      <Calendar
        tileClassName={({ date }) =>
          dates.includes(date.toDateString()) ? "bg-green-200 rounded" : null
        }
      />
    </div>
  );
}
