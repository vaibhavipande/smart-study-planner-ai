export async function generateStudyPlan({
  subjects,
  dailyHours,
}: {
  subjects: string[];
  dailyHours: number;
}) {
  // 🔴 MOCK AI (no OpenAI billing needed)
  return {
    "Day 1": `${subjects[0]} – Basics`,
    "Day 2": `${subjects[0]} – Advanced`,
    "Day 3": `${subjects[1]} – Basics`,
    "Day 4": `${subjects[1]} – Advanced`,
    "Day 5": "Revision + Practice",
  };
}
