import React, { useEffect } from "react";
import { useAuth, useUser } from '@clerk/clerk-react';

const TaskList = ({ tasks}) => {
  if (!tasks || tasks.length === 0) return null;
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">📌Task List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Create Date</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Task</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Priority</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 text-gray-200">
            {tasks.map((task, idx) => (
              <tr key={idx} className="border-t border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-2">
                  {task.createDate
                    ? new Date(task.createDate).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-2">{task.task || "—"}</td>
                <td className="px-4 py-2">{task.category || "—"}</td>
                <td className="px-4 py-2">{task.priority || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
