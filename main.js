document.addEventListener("DOMContentLoaded", setupChat);

function setupChat() {
    const chatInput = document.querySelector("#chat-input");
    const sendButton = document.querySelector("#send-btn");
    const chatContainer = document.querySelector(".chat-container");
    const themeButton = document.querySelector("#theme-btn");
    const deleteButton = document.querySelector("#delete-btn");

    if (!chatContainer) {
        console.error("Chat container not found.");
        return;
    }

    let userText = null;
    

    const createElement = (html, className) => {
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("chat", className);
        chatDiv.innerHTML = html;
        return chatDiv;
    };

    const getChatResponse = async (incomingChatDiv) => {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        const pElement = document.createElement("p");
        const requestData = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant.",
                },
                {
                    role: "user",
                    content: `${userText}`,
                },
            ],
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(requestData),
        };

        try {
            const response = await fetch(API_URL, requestOptions);
            const responseData = await response.json();
            pElement.textContent = responseData.choices[0].message.content;
        } catch (error) {
            console.log(error);
            pElement.classList.add("error");
            pElement.textContent = "Oops!";
        }

        incomingChatDiv.querySelector(".typing-animation").remove();
        incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
        chatInput.value = "";
    };

    const showTypingAnimation = () => {
        const html = `
            <div class="chat-content">
                <div class="chat-details">
                    <img src="./images/chatbot.jpg" alt="" />
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
            </div>
        `;
        const incomingChatDiv = createElement(html, "incoming");
        chatContainer.appendChild(incomingChatDiv);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
        getChatResponse(incomingChatDiv);
    };

    const handleOutGoingChat = () => {
        userText = chatInput.value.trim();
        if (!userText) return;
        const html = `
            <div class="chat-content">
                <div class="chat-details">
                    <img src="./images/user.jpg" alt="" />
                    <p></p>
                </div>
            </div>
        `;
        const outgoingChatDiv = createElement(html, "outgoing");
        document.querySelector(".default-text")?.remove();
        outgoingChatDiv.querySelector("p").textContent = userText;
        chatContainer.appendChild(outgoingChatDiv);
        setTimeout(showTypingAnimation, 500);
    };

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleOutGoingChat();
        }
    });

    sendButton.addEventListener("click", handleOutGoingChat);

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        themeButton.innerText = document.body.classList.contains("light-mode")
            ? "dark_mode"
            : "light_mode";
    });

    deleteButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all chats?")) {
            chatContainer.innerHTML = "";
            document.body.innerHTML = defaultText;
            setupChat();
        }
    });
}
