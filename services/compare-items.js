const model = require("./gemini");

async function compareItems(lostDescription, foundDescription) {
  try {
    const prompt = `You are comparing a lost item report and a found item report.

            Your task is to determine whether BOTH reports are likely describing the SAME PHYSICAL OBJECT.

            Focus heavily on:
            - object type
            - category
            - brand
            - model
            - color
            - material
            - unique identifiers
            - physical characteristics

            Ignore:
            - writing style
            - grammar
            - sentence structure
            - tone

            Very Important:
            If the objects are fundamentally different (example: phone vs wallet), the score must be extremely low.

            Return a similarity score from 0 to 100.

            0 = completely different objects
            100 = almost certainly same object

            Lost Item:
            "${lostDescription}"

            Found Item:
            "${foundDescription}"

            Return ONLY raw JSON.

            Example:
            {
            "matchScore": 85,
            "reason": "Both descriptions refer to a black iPhone 13."
            }`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch {
      return {
        matchScore: null,
        reason: "Invalid Gemini JSON response",
      };
    }

    if (typeof parsedResponse.matchScore !== "number") {
      parsedResponse.matchScore = 0;
    }

    if (typeof parsedResponse.reason !== "string") {
      parsedResponse.reason = "No reason provided";
    }

    return parsedResponse;
  } catch (error) {
    console.log(error);

    return {
      matchScore: null,
      reason: "AI comparison unavailable",
    };
  }
}

module.exports = compareItems;
