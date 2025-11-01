import { NextResponse, NextRequest } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini AI client
const gemini = new GoogleGenAI({});

//  prompt
const prompt = "Identify the shape of this face to determine which style of glasses would suit them. Also give examples of celebrities with the same face shape. Then suggest 3 styles of glasses that would suit this face shape and explain why. Finally, recommend 3 specific glasses.";


//  config
const config1 = {
    responseMimeType: 'application/json',
    responseSchema: {
            type: Type.OBJECT,
            properties: {
                face_shape: {
                    type: Type.STRING,
                },
                explanation_face_shape: {
                    type: Type.STRING,
                },
                celebrities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                recommended_styles: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            style: {
                                type: Type.STRING,
                            },
                            reason: {
                                type: Type.STRING,
                            }
                        }
                    }
                }
            }
        }
};

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { image } = await req.json();
        const contents = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: image,
                },
            },
            { text: prompt }
        ]

        const data = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: config1
        });
         
        if (!data.text) {
            console.log("No text response from Gemini AI");
            return NextResponse.json({ error: "No response from Gemini AI" }, { status: 500 });
        }

        console.log(data.text);
        
        return NextResponse.json(data.text, { status: 200 });
        
    } catch (error: unknown) {
        console.log(error);

        // Narrow the type safely
        const message =
            error instanceof Error ? error.message : String(error);

        return NextResponse.json({ error: message }, { status: 500 });
    }
}