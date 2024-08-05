import Groq from "groq-sdk";
import { NextResponse } from "next/server";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const schema = {
    $defs: {
      Ingredient: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          quantity: {
            type: "string",
          },
        },
        required: ["name", "quantity"],
      },
    },
    type: "object",
    properties: {
  recipe_name: {
        type: "string",
        title: "Recipe Name",
      },
      ingredients: {
        type: "array",
        title: "Ingredients",
        items: {
          $ref: "#/$defs/Ingredient",
        },
      },
      directions: {
        type: "array",
        title: "Directions",
        items: {
          type: "string",
        },
      },

    required: ["recipe_name", "ingredients", "directions"],
  }
};
export async function POST(req: Request) {
    try {
      const { message } = await req.json();
      const chatCompletion = await getGroqChatCompletion(message);
      return NextResponse.json(chatCompletion)
    } catch (error) {
        return NextResponse.error();
    }
  }

  
  export async function getGroqChatCompletion(message: string) {
    const jsonSchema = JSON.stringify(schema, null, 4);
    return groq.chat.completions.create({
        "messages": [
            {
              "role": "system",
              "content": `You are a world class chef that can create any recipe with the given ingredients in JSON format.  The JSON schema must match the following schema" ${jsonSchema}`,
            },
            {
              "role": "user",
              "content": `give me a recipe using ${message}`
            }
          ],
          "model": "mixtral-8x7b-32768",
          "temperature": 0,
          "stream": false,
          "response_format": {
            "type": "json_object"
          },
        })

  }