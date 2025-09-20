import { NextResponse, NextRequest } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const gemini = new GoogleGenAI({});

const prompt = "Identify the shape of this face to determine which style of glasses would suit them. Also give examples of celebrities with the same face shape. Then suggest 3 styles of glasses that would suit this face shape and explain why. Finally, recommend 3 specific glasses from a popular ecommerce site with links.";

const config = {
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
                            },
                            link: {
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

        const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: config
        });
        
        return NextResponse.json({ response: response.text }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}