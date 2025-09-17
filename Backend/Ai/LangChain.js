import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";

const key = process.env.GOOGLE_API_KEY;

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: key
});

const routeSchema = z.object({
    step: z.enum(["normalChat", "task"]).describe(
        "The next step in the routing process"
    ),
});

const router = llm.withStructuredOutput(routeSchema);

const StateAnnotation = Annotation.Root({
    input: Annotation,
    decision: Annotation,
    output: Annotation,
});

async function llmCall1(state) {
    const result = await llm.invoke([{
        role: "system",
        content: "You are a helpful assistant.",
    }, {
        role: "user",
        content: state.input
    }]);
    return { output: result.content };
}

async function llmCall2(state) {
    const prompt = `Extract task details from this input and return the information in a JSON format. If a piece of information is not provided in the input, leave the corresponding value as an empty string.

      **Input:** "Remind me to call Mom next Tuesday. It's high priority."

      **Output:**
          {
                "createDate": "2025-09-16",
                "dueDate": "2025-09-23",
                "task": "call Mom",
                "category": "",
                "priority": "high"
          }

      **Input:** "User message"

      **Output:**
      ...
      `
    const result = await llm.invoke([{
        role: "system",
        content: prompt,
    }, {
        role: "user",
        content: state.input
    }]);
    return { output: result.content };
}

async function llmCallRouter(state) {
    // Route the input to the appropriate node
    const decision = await router.invoke([
        {
            role: "system",
            content: "Route the input to normalChat or task based on the user's request."
        },
        {
            role: "user",
            content: state.input
        },
    ]);

    return { decision: decision.step };
}

function routeDecision(state) {
    // Return the node name you want to visit next
    console.log(state.decision);
    if (state.decision === "normalChat") {
        return "llmCall1";
    } else if (state.decision === "task") {
        return "llmCall2";
    }
}


const routerWorkflow = new StateGraph(StateAnnotation)
    .addNode("llmCall1", llmCall1)
    .addNode("llmCall2", llmCall2)
    .addNode("llmCallRouter", llmCallRouter)
    .addEdge("__start__", "llmCallRouter")
    .addConditionalEdges(
        "llmCallRouter",
        routeDecision,
        ["llmCall1", "llmCall2"],
    )
    .addEdge("llmCall1", "__end__")
    .addEdge("llmCall2", "__end__")
    .compile();


export async function langchain(message) {
    try {
        const state = await routerWorkflow.invoke({
            input: message
        });

        return state.output;

    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return {
            "createDate": "",
            "dueDate": "",
            "task": "Error: Could not parse task.",
            "category": "",
            "priority": ""
        };
    }
}


