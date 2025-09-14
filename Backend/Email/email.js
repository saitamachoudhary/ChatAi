import nodemailer from "nodemailer"

export const sendEmail = async (task, emailAddress) => {
    let newcreateDate = task?.createDate
        ? new Date(task.createDate).toLocaleString()
        : "—";
    let newdueDate = task?.dueDate ? new Date(task.dueDate).toLocaleString()
        : "—";
    let newTask = task?.task || "—";
    let newCategory = task?.category || "—";
    let newPriority = task?.priority || "—";

    let message_id='';

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
        <tr style="border-top: 1px solid #374151;">
          <td style="padding: 0.5rem 1rem;">
            ${newcreateDate}
          </td>
          <td style="padding: 0.5rem 1rem;">
            ${newdueDate}
          </td>
          <td style="padding: 0.5rem 1rem;">${newTask}</td>
          <td style="padding: 0.5rem 1rem;">${newCategory}</td>
          <td style="padding: 0.5rem 1rem;">${newPriority}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "abhinavlumenore2024@gmail.com",
            pass: process.env.GOOGLE_APP_PASSWORD,
        },
    });

   
    (async () => {
        const info = await transporter.sendMail({
            from: '"Abhinav Choudhary 👻" <abhinavlumenore2024@gmail.com>',
            to: emailAddress,
            subject: "Task List",
            // text: "Hello world?",
            html: html_table,
        })
        message_id = info.messageId
    })();
    return message_id;
}