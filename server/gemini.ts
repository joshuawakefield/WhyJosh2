
// This file runs on the server and interacts with the Google GenAI SDK.
import { GoogleGenAI, Type } from "@google/genai";
import { contextPack } from "./context";
import { Brief } from "./types";

// In a real server environment, the API key would be loaded from environment variables.
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You generate a JD-relative one-pager plan for Joshua. Only ground flattering claims in proof_ledger. Prefer skills.proven; mark others as Working or Ramp-in-2-weeks with a micro-plan. Start from an optimism prior 65; clamp final Fit Score to 55–96. If a hard blocker (e.g., mandatory clearance/timezone) exists in the JD, cap score ≤70 and make the first bullet a mitigation plan. Output strict JSON matching the provided schema. Do not include prose outside JSON. Use up to 3 links total by pulling from cited proof_ledger items; never invent URLs. Avoid copying JD text verbatim; paraphrase and compress.`;

// This schema representation should be generated from the Zod schema in a real project.
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        fit_score: { type: Type.NUMBER },
        rationale: { type: Type.STRING },
        summary_bullets: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING },
                    evidence_ids: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        skills_matrix: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['Proven', 'Working', 'Ramp-in-2-weeks'] },
                    ramp_note: { type: Type.STRING, nullable: true }
                }
            }
        },
        outcomes_alignment: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    jd_outcome: { type: Type.STRING },
                    evidence_id: { type: Type.STRING },
                    metric: { type: Type.STRING, nullable: true }
                }
            }
        },
        ramp_2w: { type: Type.ARRAY, items: { type: Type.STRING } },
        plan_30_60_90: {
            type: Type.OBJECT,
            properties: {
                '30': { type: Type.STRING },
                '60': { type: Type.STRING },
                '90': { type: Type.STRING }
            }
        },
        risks: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    risk: { type: Type.STRING },
                    mitigation: { type: Type.STRING }
                }
            }
        },
        cta: { type: Type.STRING },
        jd_fields: {
            type: Type.OBJECT,
            properties: {
                role: { type: Type.STRING },
                company: { type: Type.STRING }
            }
        }
    }
};


export async function generateJsonFromJd(jdText: string, role?: string, company?: string): Promise<Brief> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const userContent = {
        jd_text: jdText,
        role: role || "Not specified",
        company: company || "Not specified",
        context_pack: contextPack,
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: JSON.stringify(userContent),
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.2
        },
    });

    const jsonText = response.text.trim();
    // In a real app, we would validate this with Zod before parsing.
    return JSON.parse(jsonText) as Brief;
}
