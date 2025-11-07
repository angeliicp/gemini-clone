// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node
// import 'dotenv/config';

import {
  GoogleGenAI,
} from '@google/genai';

async function main(prompt) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    // config,
    contents,
  });

  console.log(response.text);
  return response.text;
}

export default main;
