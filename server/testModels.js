import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBfbOZezlshJUyRyq6ihPkXZKwQQvSyOiM");

async function test() {
  const modelsToTry = [
    "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`\nTesting: ${modelName}`);

      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      const result = await model.generateContent("Say hello");
      const response = await result.response;

      console.log("✅ WORKING MODEL:", modelName);
      console.log("RESPONSE:", response.text());

      break; // stop when first working model found
    } catch (err) {
      console.log(`❌ Failed: ${modelName}`);
      console.log(err.message);
    }
  }
}

test();