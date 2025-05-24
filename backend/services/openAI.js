import axios from "axios";
import nlp from "compromise";
export const suggestTagsFromContent = async (content) => {
  if (!content || content.trim().length < 10) {
    return [];
  }

  const doc = nlp(content);
  const nouns = doc.nouns().out("array");

  let cleanTags = nouns.map((tag) => tag.toLowerCase().trim());
  cleanTags = cleanTags.filter((tag) => tag.length > 3);
  cleanTags = [...new Set(cleanTags)];
  cleanTags = cleanTags.sort((a, b) => b.length - a.length);
  const topTags = cleanTags.slice(0, 3); 
  return topTags;
};

export const generateSummaryFromContent = async (content) => {
  const maxRetries = 5;
  let retryCount = 0;

  const huggingFaceAPI =
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

  while (retryCount < maxRetries) {
    try {
      const response = await axios.post(
        huggingFaceAPI,
        {
          inputs: content,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const summary = response.data[0]?.summary_text?.trim();
      if (!summary) throw new Error("No summary returned.");

      return summary;
    } catch (error) {
      const status = error.response?.status;
      // if (status === 429 || status === 503) {
      //   const delay = Math.pow(2, retryCount) * 1000;
      //   console.warn(
      //     `Rate limited or model loading. Retrying in ${delay / 1000}s...`
      //   );
      //   await new Promise((res) => setTimeout(res, delay));
      //   retryCount++;
      // } else {
      //   console.error("Error from Hugging Face:", error.message);
      //   throw error;
      // }
    }
  }

  throw new Error("Max retries exceeded. Please try again later.");
};
