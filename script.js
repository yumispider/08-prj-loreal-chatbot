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

let messages = [{ role: "system", content: "" }];

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

    const responseText = responseFromAI.choices[0].message.content; // ||"Could not form a response.";
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
