const { json } = require("express");
const model = require("./gemini");

async function compareImages(req, res) {
  lostImageUrl =
    "https://res.cloudinary.com/dkg9wxu0y/image/upload/v1779912819/lost-items/hmpxioz3nrcxbscfq4ad.jpg";
  foundImageUrl =
    "https://res.cloudinary.com/dkg9wxu0y/image/upload/v1779912819/lost-items/hmpxioz3nrcxbscfq4ad.jpg";
  try {
    const prompt = `
        You are comparing two images from a lost-and-found system.

        Determine whether both images likely show the SAME PHYSICAL OBJECT.

        Focus heavily on:
        - object type
        - color
        - shape
        - brand
        - model
        - visible markings
        - scratches
        - stickers
        - unique identifiers

        Do NOT compare:
        - background
        - camera angle
        - lighting

        Return ONLY raw JSON.

        Example:

        {
        "imageScore": 85,
        "reason": "Both images appear to show the same black leather wallet."
        }`;

    const result = await model.generateContent([
      prompt,

      {
        fileData: {
          mimeType: "image/jpeg",
          fileUri: lostImageUrl,
        },
      },

      {
        fileData: {
          mimeType: "image/jpeg",
          fileUri: foundImageUrl,
        },
      },
    ]);

    const response = await result.response;

    const text = response.text();

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedText);
    } catch (error) {
      return {
        imageScore: 0,
        reason: "Invalid Gemini JSON response",
      };
    }

    if (typeof parsedResponse.imageScore !== "number") {
      parsedResponse.imageScore = 0;
    }

    if (typeof parsedResponse.reason !== "string") {
      parsedResponse.reason = "No reason provided";
    }

    return parsedResponse;
  } catch (error) {
    console.log(error);

    return {
      imageScore: null,
      reason: "Image comparison failed",
    };
  }
}

module.exports = compareImages;
