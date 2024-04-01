'use client';

import { useChat } from "ai/react";
import markdownToHtml from "zenn-markdown-html";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const content = messages.map(m => (
    <div key= { m.id } className="mb-2 text-gray-800 bg-gray-200 rounded p-2 znc"
      dangerouslySetInnerHTML={
        { __html: `${m.role === "user" ? "User " : "LLaMA "}${markdownToHtml(m.content.replace("User:", "").replace("</s>", ""))}` }
      }>
    </div>
  ))


  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      {content}
      { isLoading && 
        <div>
          LLaMA is typing🦙...
        </div>
      }
      <form onSubmit={handleSubmit} className="">
        <label>
          <textarea
            className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
            value={input}
            onChange={handleInputChange}
            placeholder="ここに入力してください..."
            />
        </label>
        <button type="submit" className="fixed max-w-md bottom-0 right-5 border border-gray-300 rounded mb-8 shadow-xl p-2">送信</button>
      </form>
    </div>
  );
}