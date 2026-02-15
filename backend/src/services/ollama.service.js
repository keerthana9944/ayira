import ollama from "ollama";

export async function askAyira(prompt){
    const response = await ollama.chat({
        model: "gemma3:1b",
        messages: [
            { role: "system", content: "You are AYIRA, an offline reproductive health awareness assistant." },
            { role: "user", content: prompt }
        ],
    });

    return response.message.content;
}

