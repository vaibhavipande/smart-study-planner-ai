import OpenAI from "openai";

interface GeneratePlanParams {
  topic: string;
  dailyHours?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  duration?: number; // in weeks
}

interface StudyPlanResult {
  title: string;
  duration: string;
  steps: string[];
  description?: string;
  estimatedHours?: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStudyPlanWithAI({
  topic,
  dailyHours = 2,
  difficulty = "intermediate",
  duration = 8,
}: GeneratePlanParams): Promise<StudyPlanResult> {
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    // Fallback to smart mock generation
    return generateSmartMockPlan(topic, dailyHours, duration);
  }

  try {
    const prompt = `Create a comprehensive ${duration}-week study plan for learning "${topic}" at ${difficulty} level. The student can study ${dailyHours} hours per day.

Requirements:
- Create a detailed, structured learning path
- Break it down into weekly milestones
- Include practical exercises and projects
- Make it progressive (from basics to advanced)
- Include time estimates for each week
- Be specific and actionable

Format the response as a JSON object with:
{
  "title": "Study Plan for [topic]",
  "duration": "[X] Weeks",
  "description": "Brief overview of the plan",
  "estimatedHours": total hours,
  "steps": [
    "Week 1: [detailed description]",
    "Week 2: [detailed description]",
    ...
  ]
}

Make sure the steps are detailed, practical, and build upon each other.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert educational consultant specializing in creating personalized, effective study plans. Always provide structured, actionable learning paths.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(content);
    return {
      title: parsed.title || `Study Plan for ${topic}`,
      duration: parsed.duration || `${duration} Weeks`,
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      description: parsed.description,
      estimatedHours: parsed.estimatedHours,
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    // Fallback to smart mock
    return generateSmartMockPlan(topic, dailyHours, duration);
  }
}

function generateSmartMockPlan(
  topic: string,
  dailyHours: number,
  duration: number
): StudyPlanResult {
  const totalHours = dailyHours * 7 * duration; // hours per week * weeks

  const steps: string[] = [];
  const weeksPerPhase = Math.ceil(duration / 4);

  steps.push(
    `Week 1-${weeksPerPhase}: Foundation - Introduction to ${topic}, core concepts, and basic terminology`
  );
  steps.push(
    `Week ${weeksPerPhase + 1}-${weeksPerPhase * 2}: Core Learning - Deep dive into fundamental principles and hands-on practice`
  );
  steps.push(
    `Week ${weeksPerPhase * 2 + 1}-${weeksPerPhase * 3}: Advanced Topics - Complex concepts, best practices, and real-world applications`
  );
  steps.push(
    `Week ${weeksPerPhase * 3 + 1}-${duration}: Mastery - Build projects, solve problems, and consolidate knowledge`
  );

  return {
    title: `Study Plan for ${topic}`,
    duration: `${duration} Weeks`,
    description: `A comprehensive ${duration}-week learning path for ${topic}`,
    estimatedHours: totalHours,
    steps,
  };
}

// Legacy function for backward compatibility
export async function generateStudyPlan({
  subjects,
  dailyHours,
}: {
  subjects: string[];
  dailyHours: number;
}) {
  return {
    "Day 1": `${subjects[0]} – Basics`,
    "Day 2": `${subjects[0]} – Advanced`,
    "Day 3": `${subjects[1]} – Basics`,
    "Day 4": `${subjects[1]} – Advanced`,
    "Day 5": "Revision + Practice",
  };
}
