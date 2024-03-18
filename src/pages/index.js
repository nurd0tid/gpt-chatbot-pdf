import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import supabase from '../../supabase';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const response = await axios.get('/api/get');
      if (response.status === 200) {
        setMessages(response.data);
        setInitialFetchComplete(true);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (initialFetchComplete) {
      const channel = supabase
        .channel('realtime message')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message' }, (payload) => {
          const { role, content } = payload.new;

          setMessages((prevChatMessages) => [
            ...prevChatMessages,
            { role, content }
          ]);
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [initialFetchComplete]);

  useEffect(() => {
    if (initialFetchComplete) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    try {
      const response = await axios.post('/api/chat', { text: inputText, sender: 'user' });
      if (response.status === 200) {
        toast.success(response.data.message);
        setInputText('');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex h-[75vh] w-min flex-col mx-auto my-auto mt-20 mb-20">
        {/* Prompt Messages */}
        <div
          className="flex-1 space-y-6 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-300 sm:text-base sm:leading-7"
        >
          {messages.map((message, index) => (
              message.role === 'system' ? (
                <div className="flex items-start" key={index}>
                  <img
                    className="mr-2 h-8 w-8 rounded-full"
                    src="https://dummyimage.com/128x128/363536/ffffff&text=J"
                  />
                  <div
                    className="flex rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl"
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row-reverse items-start" key={index}>
                  <img
                    className="ml-2 h-8 w-8 rounded-full"
                    src="https://dummyimage.com/128x128/354ea1/ffffff&text=G"
                  />

                  <div
                    className="flex min-h-[85px] rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl"
                  >
                    <p>
                      {message.content}
                    </p>
                  </div>
                  <div
                    className="mr-2 mt-1 flex flex-col-reverse gap-2 text-slate-500 sm:flex-row"
                  >
                    <button className="hover:text-blue-600" type="button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
                        ></path>
                        <path
                          d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
                        ></path>
                      </svg>
                    </button>
                    <button className="hover:text-blue-600" type="button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"
                        ></path>
                      </svg>
                    </button>
                    <button className="hover:text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )
          ))}
          <div style={{ marginBottom: 10 }} ref={messagesEndRef} />
        </div>
        {/* Prompt suggestions */}
        <div
          className="mt-4 flex w-full gap-x-2 overflow-x-auto whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 sm:text-sm"
        >
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Regenerate response
          </button>
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Use prompt suggestions
          </button>
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Toggle web search
          </button>
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Select a tone
          </button>
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Improve
          </button>
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Make longer
          </button>
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Explain in simple words
          </button>
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Summarize in three lines
          </button>
          <button
            className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
          >
            Translate content
          </button>
        </div>
        {/* Prompt message input */}
        <form className="mt-2">
          <label htmlFor="chat-input" className="sr-only">Enter your prompt</label>
          <div className="relative">
            <button
              type="button"
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"
                ></path>
                <path d="M5 10a7 7 0 0 0 14 0"></path>
                <path d="M8 21l8 0"></path>
                <path d="M12 17l0 4"></path>
              </svg>
              <span className="sr-only">Use voice input</span>
            </button>
            <textarea
              id="chat-input"
              className="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
              placeholder="Enter your prompt"
              rows="1"
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
              onClick={handleSendMessage}
            >
              Send <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
