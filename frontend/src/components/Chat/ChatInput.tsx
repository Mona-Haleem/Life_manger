// import { Textarea } from "@/components/ui/textarea";
// import { useTranslation } from "react-i18next";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Send } from "lucide-react";
// import { sendChatMessage } from "@/store/api/chatApi";
// import { type AppDispatch } from "@/store";

// //interface ChatInputProps {}

// export function ChatInput() {
//   const { t } = useTranslation();
//   const [input, setInput] = useState("");
//   const dispatch = useDispatch<AppDispatch>();

//   const handleSend = () => {
//     if (!input.trim()) return;

//     // 1. Send user message and add 'typing' indicator
//     dispatch(sendChatMessage(input));
//     setInput("");

//     // 2. Simulate AI response after a delay

//   };
//   return (
//     <div className="pt-2 border-t border-gray-200 relative dark:border-gray-700 max-h-150">
//       <div className="flex items-center gap-2">
//         <Textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault(); // prevent newline
//               handleSend();
//             }
//           }}
//           placeholder={t("ASK_MANAGER")}
//           className="w-full no-scrollbar bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 border-transparent focus:border-transparent text-gray-900 dark:text-gray-100 resize-none"
//           maxRows={6}
//         />

//         <Send
//           onClick={handleSend}
//           className=" rounded-full p-1 cursor-pointer bg-primary text-primary-foreground shadow hover:bg-primary/90 h-15"
//           size={25}
//         />
//       </div>
//     </div>
//   );
// }
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Send, Image, Paperclip, Mic, X, FileAudio } from "lucide-react";
import { sendChatMessage } from "@/store/api/chatApi";
import { type AppDispatch } from "@/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fileToBase64 } from "@/util/helpers";

interface AttachedFile {
  id: string;
  name: string;
  type: "image" | "file" | "audio";
  data: string; // base64 or text content
  mimeType: string;
}

export function ChatInput() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files || files.length === 0) return;

  //   const newFiles: AttachedFile[] = [];

  //   for (const file of Array.from(files)) {
  //     // Check file size (10MB limit)
  //     if (file.size > 10 * 1024 * 1024) {
  //       toast.error("File too large", {
  //         description: `${file.name} exceeds 10MB limit`,
  //       });

  //       continue;
  //     }

  //     // Check if image
  //     if (!file.type.startsWith("image/")) {
  //       toast.error("Invalid file type", {
  //         description: "Please select an image file",
  //       });

  //       continue;
  //     }

  //     const base64 = await fileToBase64(file);
  //     newFiles.push({
  //       id: `img-${Date.now()}-${Math.random()}`,
  //       name: file.name,
  //       type: "image",
  //       data: base64,
  //       mimeType: file.type,
  //     });
  //   }

  //   setAttachedFiles((prev) => [...prev, ...newFiles]);
  //   if (imageInputRef.current) imageInputRef.current.value = "";
  // };

  // const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files || files.length === 0) return;

  //   const newFiles: AttachedFile[] = [];

  //   for (const file of Array.from(files)) {
  //     // Check file size
  //     if (file.size > 10 * 1024 * 1024) {
  //       toast.error("File too large", {
  //         description: `${file.name} exceeds 10MB limit`,
  //       });

  //       continue;
  //     }

  //     // Handle different file types
  //     let fileData: string;

  //     if (file.type === "application/pdf") {
  //       // For PDFs, send as base64
  //       fileData = await fileToBase64(file);
  //     } else if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
  //       // For text files, read as text
  //       fileData = await fileToText(file);
  //     } else {
  //       toast.error("Unsupported file type", {
  //         description: "Please upload PDF or text files",
  //       });

  //       continue;
  //     }

  //     newFiles.push({
  //       id: `file-${Date.now()}-${Math.random()}`,
  //       name: file.name,
  //       type: "file",
  //       data: fileData,
  //       mimeType: file.type,
  //     });
  //   }

  //   setAttachedFiles((prev) => [...prev, ...newFiles]);
  //   if (fileInputRef.current) fileInputRef.current.value = "";
  // };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: AttachedFile[] = [];

    for (const file of Array.from(files)) {
      // Check file size (25MB limit)
      if (file.size > 25 * 1024 * 1024) {
        toast.error("File too large", {
          description: `${file.name} exceeds 25MB limit`,
        });
        continue;
      }

      // Determine file type and process accordingly
      const fileType = determineFileType(file);

      try {
        if (fileType === "image") {
          const processedFile = await processImage(file);
          newFiles.push(processedFile);
        } else if (fileType === "audio") {
          const processedFile = await processAudio(file);
          newFiles.push(processedFile);
        } else if (fileType === "file") {
          const processedFile = await processDocument(file);
          newFiles.push(processedFile);
        } else {
          toast.error("Unsupported file type", {
            description: `${file.name} is not supported`,
          });
        }
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        toast.error("Processing failed", {
          description: `Could not process ${file.name}`,
        });
      }
    }

    setAttachedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Determine file type based on MIME type and extension
  const determineFileType = (
    file: File
  ): "image" | "audio" | "file" | "unsupported" => {
    const mimeType = file.type.toLowerCase();
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    // Check for images
    if (
      mimeType.startsWith("image/") ||
      ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension)
    ) {
      return "image";
    }

    // Check for audio
    if (
      mimeType.startsWith("audio/") ||
      ["mp3", "wav", "m4a", "ogg", "webm", "aac", "flac", "opus"].includes(
        extension
      )
    ) {
      return "audio";
    }

    // Check for documents
    if (
      mimeType === "application/pdf" ||
      mimeType.startsWith("text/") ||
      ["pdf", "txt", "doc", "docx", "csv", "json", "xml"].includes(extension)
    ) {
      return "file";
    }

    return "unsupported";
  };

  // Process image files
  const processImage = async (file: File): Promise<AttachedFile> => {
    const base64 = await fileToBase64(file);
    return {
      id: `img-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: "image",
      data: base64,
      mimeType: file.type,
    };
  };

  // Process audio files
  const processAudio = async (file: File): Promise<AttachedFile> => {
    const base64 = await fileToBase64(file);
    return {
      id: `audio-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: "audio",
      data: base64,
      mimeType: file.type,
    };
  };

  // Process document files
  const processDocument = async (file: File): Promise<AttachedFile> => {
    let fileData: string;

    if (file.type === "application/pdf") {
      fileData = await fileToBase64(file);
    } else if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
      fileData = await fileToText(file);
    } else {
      // For other document types, convert to base64
      fileData = await fileToBase64(file);
    }

    return {
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: "file",
      data: fileData,
      mimeType: file.type,
    };
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const recorder = new MediaRecorder(stream);
  //     const audioChunks: Blob[] = [];

  //     recorder.ondataavailable = (event) => {
  //       audioChunks.push(event.data);
  //     };

  //     recorder.onstop = async () => {
  //       const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

  //       // Use Web Speech API for transcription
  //       const transcription = await transcribeAudio(audioBlob);

  //       if (transcription) {
  //         setInput((prev) =>
  //           prev ? `${prev} ${transcription}` : transcription
  //         );
  //       }

  //       // Stop all tracks
  //       stream.getTracks().forEach((track) => track.stop());
  //     };

  //     recorder.start();
  //     setMediaRecorder(recorder);
  //     setIsRecording(true);
  //   } catch (error) {
  //     console.error("Error starting recording:", error);
  //     toast.error("Recording Error", {
  //       description: "Could not access microphone",
  //     });
  //   }
  // };

  // const stopRecording = () => {
  //   if (mediaRecorder && mediaRecorder.state !== "inactive") {
  //     mediaRecorder.stop();
  //     setIsRecording(false);
  //     setMediaRecorder(null);
  //   }
  // };
  const startRecognition = () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.error("Speech recognition not supported in this browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      // Store what we've already transcribed
      let finalTranscript = "";

      recognition.onstart = () => {
        // Capture the current input value as the starting point
        finalTranscript = input; // assuming 'input' is your current state value
      };

      recognition.onresult = (event: any) => {
        // Get only interim (non-final) results for live preview
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            // Add to final transcript (this is confirmed speech)
            finalTranscript += transcript + " ";
          } else {
            // Show interim results (still being spoken)
            interimTranscript += transcript;
          }
        }

        // Update input with final + interim
        setInput(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast.error("Speech Recognition Error", {
          description: event.error,
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setMediaRecorder(recognition);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recognition:", error);
      toast.error("Recognition Error", {
        description: "Could not start speech recognition",
      });
    }
  };

  const stopRecognition = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    // Send message with attachments
    dispatch(
      sendChatMessage({
        text: input,
        attachments: attachedFiles,
      })
    );

    setInput("");
    setAttachedFiles([]);
  };

  // const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (!files || files.length === 0) return;

  //   const newFiles: AttachedFile[] = [];

  //   for (const file of Array.from(files)) {
  //     // Check file size (25MB limit for audio)
  //     if (file.size > 25 * 1024 * 1024) {
  //       toast.error("File too large", {
  //         description: `${file.name} exceeds 25MB limit`,
  //       });
  //       continue;
  //     }

  //     // Check if audio
  //     if (!file.mimetype.startsWith("audio/")) {
  //       toast.error("Invalid file type", {
  //         description: "Please select an audio file",
  //       });
  //       continue;
  //     }

  //     const base64 = await fileToBase64(file);
  //     newFiles.push({
  //       id: `audio-${Date.now()}-${Math.random()}`,
  //       name: file.name,
  //       type: "audio",
  //       data: base64,
  //       mimeType: file.type,
  //     });
  //   }

  //   setAttachedFiles((prev) => [...prev, ...newFiles]);
  //   if (audioInputRef.current) audioInputRef.current.value = "";
  // };
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image size={16} className="text-blue-500" />;
      case "audio":
        return <FileAudio size={16} className="text-purple-500" />;
      case "file":
        return <File size={16} className="text-green-500" />;
      default:
        return <Paperclip size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="pt-2 border-t border-gray-200 relative dark:border-gray-700">
      {/* Attachments Preview */}
      {attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm"
            >
              {getAttachmentIcon(file.type)}
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                onClick={() => removeAttachment(file.id)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t("ASK_MANAGER")}
          className="w-full no-scrollbar bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 border-transparent focus:border-transparent text-gray-900 dark:text-gray-100 resize-none"
          minRows={3}
          maxRows={6}
        />

        <div className="flex flex-col items-center justify-around pb-1 h-20">
          {/*    <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => imageInputRef.current?.click()}
            className="h-6 w-6 mt-1.5 rounded-full cursor-pointer shadow"
            title="Upload Image"
          >
            <Image size={18} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="h-6 w-6 mt-1.5 rounded-full cursor-pointer shadow"
            title="Upload File"
          >
            <Paperclip size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => audioInputRef.current?.click()}
            className="h-6 w-6 mt-1.5 rounded-full cursor-pointer shadow"
            title="Upload Audio File"
          >
            <FileAudio size={18} />
          </Button>
*/}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 w-7 rounded-full cursor-pointer shadow hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Upload File (Images, Audio, Documents)"
          >
            <Paperclip size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={isRecording ? stopRecognition : startRecognition}
            className={`h-7 w-7 mt-1.5 rounded-full cursor-pointer shadow ${
              isRecording ? "text-red-500 animate-pulse" : ""
            }`}
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            <Mic size={18} />
          </Button>
        </div>

        <Send
          onClick={handleSend}
          className="rounded-full p-1 cursor-pointer bg-primary text-primary-foreground shadow hover:bg-primary/90 h-20 w-10 mb-1"
          size={25}
        />
      </div>

      {/* Hidden File Inputs */}
      {/* <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,text/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac,.flac"
        multiple
        onChange={handleAudioSelect}
        className="hidden"
      /> */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,audio/*,.pdf,.txt,text/*,.mp3,.wav,.m4a,.ogg,.webm,.aac,.flac"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

// Helper Functions

async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function transcribeAudio(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if browser supports Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      resolve("");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      reject(event.error);
    };

    recognition.start();
  });
}
