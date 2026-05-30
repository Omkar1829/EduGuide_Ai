import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage, addMessage, clearChat, setCurrentSession } from "../../store/slices/aiSlice";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Plus, Bot, SendHorizonal } from "lucide-react";

const quickActions = [
  { label: "Career advice", message: "What career path suits me best?" },
  { label: "Skill guidance", message: "What skills should I learn next?" },
  { label: "Study tips", message: "Give me effective study strategies" },
  { label: "Interview prep", message: "Help me prepare for interviews" },
];

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md"
            : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p
          className={`text-[10px] mt-1.5 ${
            isUser ? "text-white/60" : "text-gray-500"
          }`}
        >
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </p>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
      </div>
    </div>
  </div>
);

const AIChat = () => {
  const dispatch = useDispatch();
  const { chatMessages, chatSessionId, loading, error } = useSelector(
    (s) => s.ai
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));
    setInput("");
    setIsTyping(true);

    try {
      await dispatch(
        sendChatMessage({
          message: text,
          sessionId: chatSessionId,
          history: chatMessages.slice(-10),
        })
      ).unwrap();
    } catch {
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    setInput(action.message);
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    dispatch(clearChat());
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          <span className="gradient-text">AI</span> Counselor
        </h2>
        <div className="flex gap-2">
          {chatSessionId && (
            <span className="text-xs text-gray-500 px-2 py-1 rounded-lg bg-white/5">
              Session: {chatSessionId.slice(0, 8)}...
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleNewChat}>
            <Plus className="w-3.5 h-3.5 mr-1" /> New Chat
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden !p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {chatMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                How can I help you today?
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-sm">
                I'm your AI career counselor. Ask me anything about careers,
                skills, or your academic journey.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isTyping && <TypingIndicator />}

          {error && (
            <div className="flex justify-center mb-4">
              <div className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm max-h-24"
              style={{ minHeight: "42px" }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="h-[42px] w-[42px] !px-0 !py-0 flex-shrink-0"
            >
              <SendHorizonal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
