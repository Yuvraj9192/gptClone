import { Router } from "express";
import Thread from "../models/Thread.js"
import getGeminiApiResponse from "../utils/openai.js";
import { threadId } from "node:worker_threads";

const chatRoute = Router();

//adding data
chatRoute.post("/newThread", async(req, res) => {
    
    console.log(req.body);

    try{
        const data = await Thread.create(req.body);
        res.send(data);
    }catch(error){
        console.log("eror while saving data");
        res.send("error");
    }
})

// Get all thtreads
chatRoute.get("/thread", async(req, res) => {
    try {
        const threads = await Thread.find({}).sort({updatedAt: -1});
        // descending order
        res.json(threads);
    } catch (error) {
        console.log("error : ", error);
        res.status(501).json({
            success: false,
            message: "something went wrong failed to fecth thread",
            error : error
        });
    }
});

// finding on specific thread
chatRoute.get("/thread/:threadId", async(req, res) => {
    const id = req.params.threadId;
    // console.log(id);
    try{
        const thread = await Thread.findOne({ threadId: id });
        // console.log(thread);
        res.status(200).json({
            success: true,
            thread
            // message : 
        });
    }catch(error) {
        console.log("failed to find the chat");
        res.status(401).json({
            success: false,
            message: "no such thread is available",
            error
        });
    }
});

// deleting an thread
chatRoute.delete("/thread/:threadId", async(req, res) => {
    const id = req.params.threadId;
    try{
        const thread = await Thread.findOneAndDelete({
            threadId: id});
        res.status(201).json({
            success: true,
            message : `successfully deleted the thread Id: ${id}`
        });
    }catch(error){
        res.status(401).json({
            success: false,
            message : "unable to delete"
        });
    }
});


//creating new chat
chatRoute.post("/chat", async (req, res) => {
    try {
        let { threadId, message } = req.body;

        if (!threadId || !message) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: []
            });
        }

        thread.messages.push({
            role : "user",
            content : message
        });

        const reply = await getGeminiApiResponse(message);

        thread.messages.push({
            role: "assistant",
            content: reply
        });

        thread.updatedAt = new Date();

        await thread.save();
        res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export default chatRoute;