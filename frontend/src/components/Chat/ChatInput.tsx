import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Send } from "lucide-react";
import { sendChatMessage } from "@/store/api/chatApi";
import { type AppDispatch } from "@/store";

//interface ChatInputProps {}

export function ChatInput() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Send user message and add 'typing' indicator
    dispatch(sendChatMessage(input));
    setInput("");

    // 2. Simulate AI response after a delay

    
  };
  return (
    <div className="pt-2 border-t border-gray-200 relative dark:border-gray-700 max-h-150">
      <div className="flex items-center gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline
              handleSend();
            }
          }}
          placeholder={t("ASK_MANAGER")}
          className="w-full no-scrollbar bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 border-transparent focus:border-transparent text-gray-900 dark:text-gray-100 resize-none"
          maxRows={6}
        />

        <Send
          onClick={handleSend}
          className=" rounded-full p-1 cursor-pointer bg-primary text-primary-foreground shadow hover:bg-primary/90 h-15"
          size={25}
        />
      </div>
    </div>
  );
}
