import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { addChatMessage, setChatTyping } from "@/store/slices/chatSlice";
import type { RootState } from "@/store";

const ChatScreen = () => {
  const { chatHistory:messages } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir() as "ltr" | "rtl";
  const [input, setInput] = useState("");


  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Send user message and add 'typing' indicator
    dispatch(addChatMessage({ from: "user", text: input }));
    dispatch(setChatTyping(true));
    setInput("");

    // 2. Simulate AI response after a delay
    setTimeout(() => {
      // Remove typing indicator first
      dispatch(setChatTyping(false));

      // Add AI response
      dispatch(
        addChatMessage({
          from: "ai",
          text: `Great, I've organized that for you. I've scheduled "Finish report" as a priority task for tomorrow morning.`,
        })
      );
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full p-0">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("CHAT")}
        </h1>
      </header>
      <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "ai" && (
              <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center flex-shrink-0 text-lg">
                🤓
              </div>
            )}
            {msg.type === "typing" ? (
              <div
                className={`bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl flex gap-1.5 ${
                  msg.from === "user"
                    ? direction === "rtl"
                      ? "rounded-tl-lg"
                      : "rounded-tr-lg"
                    : direction === "rtl"
                    ? "rounded-br-lg"
                    : "rounded-bl-lg"
                }`}
              >
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-0"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
              </div>
            ) : (
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
                  msg.from === "user"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                } ${
                  msg.from === "user"
                    ? direction === "rtl"
                      ? "rounded-tl-lg"
                      : "rounded-tr-lg"
                    : direction === "rtl"
                    ? "rounded-br-lg"
                    : "rounded-bl-lg"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("ASK_MANAGER")}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 border-transparent focus:border-transparent text-gray-900 dark:text-gray-100"
          />
          <Button onClick={handleSend} size="default">
            {t("SEND")}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ChatScreen;
