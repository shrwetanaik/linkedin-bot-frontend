import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]); // Chat history
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    const history = messages;
    setInput("");
    setIsLoading(true);

    // Add user message and loader
    setMessages((prev) => [
      ...prev,
      { role: "user", content: message },
      { role: "assistant", content: "..." }
    ]);

    try {
      const response = await fetch("https://linkedin-bot-ivo4.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });

      const data = await response.json();

      setMessages((prev) => {
        // Remove the last loader ("Bot is replying...")
        const updated = prev.slice(0, -1);
        return [
          ...updated,
          { role: "assistant", content: data.reply || "Bot: Sorry, I don't have a response right now. 😊" }
        ];
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        return [
          ...updated,
          { role: "assistant", content: "Bot: Oops, there was an error. Please try again!" }
        ];
      });
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">🤖 Talk to My Bot</h1>
        <div className="h-64 overflow-y-auto border p-2 rounded mb-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <p className="mb-1">
                <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
              </p>
            </div>
          ))}
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
          placeholder="Type your message..."
          className="w-full border p-2 rounded mb-2"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
