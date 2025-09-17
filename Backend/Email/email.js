import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendEmail = async (task, emailAddress) => {

  const rows = task.map((tsk) => {
    let createDate = tsk?.createDate
      ? new Date(tsk.createDate).toLocaleString()
      : "—";
    let dueDate = tsk?.dueDate ? new Date(tsk.dueDate).toLocaleString()
      : "—";
    let newTask = tsk?.task || "—";
    let category = tsk?.category || "—";
    let priority = tsk?.priority || "—";

    let priorityColor = "#d1d5db"; // default (gray)
        if (priority.toLowerCase() === "high") priorityColor = "#ef4444"; // red
        else if (priority.toLowerCase() === "low") priorityColor = "#10b981"; // green
        else if (priority.toLowerCase() === "medium") priorityColor = "#f59e0b"; // yellow

    return `<tr style="border-top: 1px solid #374151;">
            <td style="padding: 0.5rem 1rem;">${createDate}</td>
            <td style="padding: 0.5rem 1rem;">${dueDate}</td>
            <td style="padding: 0.5rem 1rem;">${newTask}</td>
            <td style="padding: 0.5rem 1rem;">${category}</td>
            <td style="padding: 0.5rem 1rem; color: ${priorityColor};">${priority}</td>
          </tr>`
  })
    .join("");

  const html_table = `<div style="margin-top: 1rem;">
  <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">📌Task List</h2>
  <div style="overflow-x: auto;">
    <table style="min-width: 100%; border: 1px solid #4b5563; border-radius: 0.5rem; border-collapse: collapse; overflow: hidden;">
      <thead style="background-color: #374151; color: #ffffff;">
        <tr>
          <th style="padding: 0.5rem 1rem; text-align: left;">Create Date</th>
          <th style="padding: 0.5rem 1rem; text-align: left;">Due Date</th>
          <th style="padding: 0.5rem 1rem; text-align: left;">Task</th>
          <th style="padding: 0.5rem 1rem; text-align: left;">Category</th>
          <th style="padding: 0.5rem 1rem; text-align: left;">Priority</th>
        </tr>
      </thead>
      <tbody style="background-color: #1f2937; color: #e5e7eb;">
       ${rows}
      </tbody>
    </table>
  </div>
</div>
`

  try {
    const info = await transporter.sendMail({
      from: '"Abhinav Choudhary 👻" <abhinavlumenore2024@gmail.com>',
      to: emailAddress,
      subject: "Task List",
      // text: "Hello world?",
      html: html_table,
    })
    return info.messageId
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }

}