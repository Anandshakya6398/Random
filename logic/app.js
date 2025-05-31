// Dummy bot responses
const botResponses = [
    "Hello! How can I assist you today?",
    "MY pleasure to help!",
    "My name is Anu",
    "Sure, I'll get back to you.",
    "Thanks for your message!",
    "Let me check and update you.",
    "That's interesting!",
    "Can you clarify that?",
    "Noted.",
    "I'll take care of it.",
    "Sounds good!",
    "👍"
];

// Contacts data
const contacts = [
    {
        name: "Emma Thompson",
        avatar: { bg: "#e5e5fe", color: "#696efe", online: true, initials: "EM" },
        snippet: "I've sent you the latest project f...",
        time: "12:45 PM",
        messages: [
            { type: "incoming", text: "Oh, I almost forgot - do you have the latest version of the client presentation? I want to make sure we're all on the same page for tomorrow.", time: "12:05 PM" },
            { type: "outgoing", text: "I've just sent it to your email. It includes all the updates we discussed in the last meeting. Let me know if you need anything else!", time: "12:15 PM" },
            { type: "incoming", text: "Got it, thanks! I'll review it before our lunch. See you soon!", time: "12:20 PM" },
            { type: "outgoing", text: "Looking forward to it! 🔥", time: "12:25 PM" }
        ]
    },
    {
        name: "Michael Johnson",
        avatar: { bg: "#bcf3c6", color: "#19a72e", online: true, initials: "MJ" },
        snippet: "Are we still meeting for coffee to...",
        time: "Yesterday",
        messages: [
            { type: "incoming", text: "Hey! Are we still meeting for coffee today?", time: "9:00 AM" },
            { type: "outgoing", text: "Yes, see you at 11!", time: "9:05 AM" }
        ]
    },
    {
        name: "Sophia Lee",
        avatar: { bg: "#e6dee9", color: "#af54d6", online: false, initials: "SL" },
        snippet: "The design team loved your pre...",
        time: "Yesterday",
        messages: [
            { type: "incoming", text: "The design team loved your presentation!", time: "3:30 PM" },
            { type: "outgoing", text: "Thank you so much! 😊", time: "3:32 PM" }
        ]
    },
    {
        name: "Robert Brown",
        avatar: { bg: "#ede6e0", color: "#cd895e", online: false, initials: "RB" },
        snippet: "Can you review the budget prop...",
        time: "Tuesday",
        messages: [
            { type: "incoming", text: "Can you review the budget proposal?", time: "10:10 AM" }
        ]
    },
    {
        name: "Amelia Wilson",
        avatar: { bg: "#e4d5d8", color: "#f94288", online: false, initials: "AW" },
        snippet: "Thanks for your help with the cli...",
        time: "Monday",
        messages: [
            { type: "incoming", text: "Thanks for your help with the client call.", time: "6:00 PM" }
        ]
    },
    {
        name: "Daniel Martinez",
        avatar: { bg: "#e5e5fe", color: "#696efe", online: false, initials: "DM" },
        snippet: "Let's schedule a call to discuss t...",
        time: "May 25",
        messages: [
            { type: "incoming", text: "Let's schedule a call to discuss the next steps.", time: "2:00 PM" }
        ]
    }
];

let currentContact = 0;
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const darkToggle = document.getElementById('darkToggle');
let darkMode = false;

// Sidebar drag-to-resize (desktop only)
const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('sidebarResizer');
let isResizing = false;

resizer.addEventListener('mousedown', function (e) {
    if (window.innerWidth <= 900) return; // Disable on mobile/tablet
    isResizing = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', function (e) {
    if (!isResizing) return;
    let newWidth = e.clientX - sidebar.getBoundingClientRect().left;
    const min = 200;
    const max = 400;
    if (newWidth < min) newWidth = min;
    if (newWidth > max) newWidth = max;
    sidebar.style.width = newWidth + 'px';
});

document.addEventListener('mouseup', function () {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }
});

// Dark mode toggle
darkToggle.addEventListener('click', function () {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
    darkToggle.textContent = darkMode ? '☀️' : '🌙';
});

// Auto expand textarea, but reset to min-height if empty
chatInput.addEventListener('input', function () {
    this.style.height = 'auto';
    if (this.value.trim() === '') {
        this.style.height = '44px';
    } else if (this.scrollHeight <= 120) {
        this.style.height = this.scrollHeight + 'px';
    } else {
        this.style.height = '120px';
    }
});

// Send on Enter (without Shift)
chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

// Render contacts in sidebar
function renderContacts() {
    const chatList = document.querySelector('.chat-list');
    chatList.innerHTML = '';
    contacts.forEach((c, i) => {
        const item = document.createElement('div');
        item.className = 'chat-item' + (i === currentContact ? ' active' : '');
        item.dataset.index = i;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.style.background = c.avatar.bg;
        avatar.style.color = c.avatar.color;
        avatar.textContent = c.avatar.initials;
        if (c.avatar.online) {
            const dot = document.createElement('div');
            dot.className = 'online-dot';
            avatar.appendChild(dot);
        }

        const details = document.createElement('div');
        details.className = 'chat-details';
        details.innerHTML = `<div class="chat-name">${c.name}</div>
                    <div class="chat-snippet">${c.snippet}</div>`;

        const time = document.createElement('div');
        time.className = 'timestamp';
        time.textContent = c.time;

        item.appendChild(avatar);
        item.appendChild(details);
        item.appendChild(time);

        item.addEventListener('click', () => {
            if (currentContact !== i) {
                currentContact = i;
                renderContacts();
                renderChat();
            }
        });

        chatList.appendChild(item);
    });
}

// Render chat window for selected contact
function renderChat() {
    chatWindow.innerHTML = '';
    const messages = contacts[currentContact].messages;
    messages.forEach(msg => {
        const row = document.createElement('div');
        row.className = 'message-row' + (msg.type === 'outgoing' ? ' outgoing' : '');

        // Message bubble
        const bubble = document.createElement('div');
        bubble.className = 'message';
        bubble.textContent = msg.text;

        // Time and ticks container (side by side, right inside bubble)
        const meta = document.createElement('span');
        meta.className = 'msg-meta';

        const time = document.createElement('span');
        time.className = 'msg-time';
        time.textContent = msg.time;
        meta.appendChild(time);

        // Double tick for outgoing messages
        if (msg.type === 'outgoing') {
            const ticks = document.createElement('span');
            ticks.className = 'msg-ticks';
            // Gray for sent, blue for delivered
            if (msg.status === 'delivered') {
                ticks.innerHTML = `<svg width="22" height="16" viewBox="0 0 22 16" style="vertical-align:middle"><polyline points="2,9 8,14 20,2" fill="none" stroke="#4d53e0" stroke-width="2"/><polyline points="7,9 13,14 21,6" fill="none" stroke="#4d53e0" stroke-width="2"/></svg>`;
            } else {
                ticks.innerHTML = `<svg width="22" height="16" viewBox="0 0 22 16" style="vertical-align:middle"><polyline points="2,9 8,14 20,2" fill="none" stroke="#bbb" stroke-width="2"/><polyline points="7,9 13,14 21,6" fill="none" stroke="#bbb" stroke-width="2"/></svg>`;
            }
            meta.appendChild(ticks);
        }

        bubble.appendChild(meta);
        row.appendChild(bubble);
        chatWindow.appendChild(row);
    });
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Update topbar
    const profile = document.querySelector('.chat-profile');
    const avatar = profile.querySelector('.avatar');
    avatar.style.background = contacts[currentContact].avatar.bg;
    avatar.style.color = contacts[currentContact].avatar.color;
    avatar.innerHTML = contacts[currentContact].avatar.initials +
        (contacts[currentContact].avatar.online ? '<div class="online-dot"></div>' : '');
    profile.querySelector('.name').textContent = contacts[currentContact].name;
    profile.querySelector('.status').textContent = contacts[currentContact].avatar.online ? 'Online' : 'Offline';
}

// Send message for selected contact
function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    const now = getTime();
    contacts[currentContact].avatar.online = true;
    contacts[currentContact].snippet = msg.length > 30 ? msg.slice(0, 27) + '...' : msg;
    contacts[currentContact].time = now;
    renderContacts();
    // Add status: sent (for double tick)
    contacts[currentContact].messages.push({ type: 'outgoing', text: msg, time: now, status: 'sent' });
    renderChat();
    chatInput.value = '';
    chatInput.style.height = '44px';
    setTimeout(() => {
        markLastOutgoingDelivered();
        botReply();
    }, 700);
}

// Mark last outgoing message as delivered (for double tick)
function markLastOutgoingDelivered() {
    const msgs = contacts[currentContact].messages;
    for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].type === 'outgoing' && msgs[i].status === 'sent') {
            msgs[i].status = 'delivered';
            break;
        }
    }
    renderChat();
}

// Typing indicator
function showTyping() {
    const oldTyping = document.getElementById('typing-indicator');
    if (oldTyping) oldTyping.remove();

    const row = document.createElement('div');
    row.className = 'message-row';
    row.id = 'typing-indicator';

    const bubble = document.createElement('div');
    bubble.className = 'message';
    bubble.style.opacity = '0.7';
    bubble.innerHTML = `
                <span class="typing-dots">
                    <span></span><span></span><span></span>
                </span>
            `;
    row.appendChild(bubble);
    chatWindow.appendChild(row);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// Bot reply for selected contact
function botReply() {
    showTyping();
    setTimeout(() => {
        hideTyping();
        const reply = botResponses[Math.floor(Math.random() * botResponses.length)];
        const now = getTime();
        contacts[currentContact].messages.push({ type: 'incoming', text: reply, time: now });
        renderChat();
    }, 1000);
}

function getTime() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m} ${ampm}`;
}

{/* // Initial render */ }
renderContacts();
renderChat();
