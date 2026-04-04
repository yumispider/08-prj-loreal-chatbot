/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content
  fetchAIResponse();

  // Show message
  //chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

const workerURL = "https://loreal-ai-assistant-worker.yumispider.workers.dev/";

let messages = [
  {
    role: "system",
    content:
      "You are a L'Oreal expert that specializes in recommending products and routines to those who are interested in trying the brand. More particularly, you lead them to products and routines that pertain the most to their question at hand. If they try to ask about anything that is not related to skin and hair care, make up, or other services that L'Oreal offers, politely tell them that you do not know. Ensure that your reply fits within the tokens allotted, and that it is not cut-off mid-sentence. Use a conversational tone and incorporate emojis.",
  },
];

async function fetchAIResponse() {
  chatWindow.textContent = "Thinking...";

  messages.push({
    role: "user",
    content: userInput.value,
  });

  try {
    const response = await fetch(workerURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    const responseFromAI = await response.json();

    const responseText =
      responseFromAI.choices[0].message.content || "Could not form a response.";
    chatWindow.textContent = responseText;

    messages.push({
      role: "assistant",
      content: responseText,
    });
  } catch (error) {
    console.error(error);
    chatWindow.textContent =
      "Sorry, something went wrong. Please try again later.";
  }

  //userInput.value = "";
}
