import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { ChatInput } from "@/components/Chat/ChatInput.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatScreen = () => {
  const { chatHistory: messages } = useSelector(
    (state: RootState) => state.chat
  );
  const { t, i18n } = useTranslation();
  const direction = i18n.dir() as "ltr" | "rtl";

  return (
    <div className="flex flex-col h-full p-0">
      {/* header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("CHAT")}
        </h1>
      </header>

      {/* chat messages */}
      <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center flex-shrink-0 text-lg">
                🤓
              </div>
            )}
            {msg.type === "typing" ? (
              <div
                className={`bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl flex gap-1.5 ${
                  msg.role === "user"
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
                className={`prose max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl prose-p:my-1 prose-pre:p-2 prose-pre:bg-gray-900 prose-pre:text-white overflow-x-auto ${
                  msg.role === "user"
                    ? "bg-purple-500 text-white prose-invert"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                } ${
                  msg.role === "user"
                    ? direction === "rtl"
                      ? "rounded-tl-lg"
                      : "rounded-tr-lg"
                    : direction === "rtl"
                    ? "rounded-br-lg"
                    : "rounded-bl-lg"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* input area */}
      <ChatInput />
    </div>
  );
};

export default ChatScreen;
