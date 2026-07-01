import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try{
            const response = await fetch("http://localhost:8000/api/thread");
            const res = await response.json();
            // console.log(res);
            const filterData = res.map(thread => ({
                threadId: thread.threadId,
                title : thread.title
            }));
            setAllThreads(filterData);

            //threadId, title
        }catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        
        try {
            const response = await fetch(`http://localhost:8000/api/thread/${newThreadId}`);

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            

            const data = await response.json();
            // console.log(data);
            setPrevChats(data.thread.messages);
            setNewChat(false);
            setReply(null);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            // console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <section className="sidebar">
                <button onClick={createNewChat}>
                    <img src="src/assets/chat-ai-4-fill.png" alt="logo" className="logo"/>
                    <span>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                        onClick={() => changeThread(thread.threadId)}>
                            {thread.title}
                            <i className="fa-solid fa-trash" onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Yuvraj Sharma &hearts;</p>
            </div>

        </section>
        </>
    )
}

export default Sidebar;
