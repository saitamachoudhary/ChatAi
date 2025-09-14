import { GoogleGenAI } from "@google/genai";

// const key="AIzaSyCxSIa18RmAnZz_4RoGN3xIc5MncIQFDOY"

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMNI_API_KEY });

const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
];

const groundingTool = {
  googleSearch: {},
};

const config = {
  tools: [groundingTool],
  thinkingConfig: {
    thinkingBudget: 0,
  },
  safetySettings: safetySettings,
};

export async function AI(message) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Extract task details from this input and return the information in a JSON format. If a piece of information is not provided in the input, leave the corresponding value as an empty string.

      **Input:** "Remind me to call Mom next Tuesday. It's high priority."

      **Output:**
          {
                "createDate": "2025-09-16",
                "dueDate": "2025-09-23",
                "task": "call Mom",
                "category": "",
                "priority": "high"
          }

      **Input:** "${message}"

      **Output:**
      ...
      after the json get ready please json first then return this message also "Want to get notified about this task?"
      `,
    config
  });

  try {
    const ai_Response = response.text;
    return ai_Response;
  } catch (error) {
     console.error("Failed to parse JSON:", error);
     return {
      "createDate": "",
      "dueDate": "",
      "task": "Error: Could not parse task.",
      "category": "",
      "priority": ""
    };
  }
}



// export async function AI(message) {
//   const prompt = `Extract task details from this input and return the information in a JSON format. If a piece of information is not provided in the input, leave the corresponding value as an empty string.

//       **Input:** "Remind me to call Mom next Tuesday. It's high priority."

//       **Output:**
//           {
//                 "createDate": "2025-09-16",
//                 "dueDate": "2025-09-23",
//                 "task": "call Mom",
//                 "category": "",
//                 "priority": "high"
//           }

//       **Input:** "message"

//       **Output:**
//       ...`
//   const chat = ai.chats.create({
//     model: "gemini-2.5-flash",
//     history: [
//       {
//         role: "user",
//         parts: [{ text: "Hello" }],
//       },
//       {
//         role: "model",
//         parts: [{ text: prompt }],
//       },
//     ],
//     config
//   })




//   try {

//     const response = await chat.sendMessage({
//       message: message
//     })
//     return response.text
//   } catch (error) {
//     console.error("Failed to parse JSON:", error);
//     return {
//       "createDate": "",
//       "dueDate": "",
//       "task": "Error: Could not parse task.",
//       "category": "",
//       "priority": ""
//     };
//   }
// }