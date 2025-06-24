import { startOfDay, differenceInDays } from "date-fns";
import { prisma } from "@/lib/prisma";

// 기준 날짜
const BASE_DATE = new Date("2025-06-01");

export async function getTodaySubjectId(): Promise<number> {
  const totalSubjects = await prisma.subject.count();
  if (totalSubjects === 0) {
    throw new Error("등록된 주제가 없습니다.");
  }

  const today = startOfDay(new Date());
  const dayOffset = differenceInDays(today, startOfDay(BASE_DATE));
  const index = dayOffset % totalSubjects;

  const subject = await prisma.subject.findFirst({
    orderBy: { subjectId: "asc" },
    skip: index,
    select: { subjectId: true },
  });

  if (!subject) {
    console.log("주제를 찾을 수 없습니다.");
    return 0;
  }

  return subject.subjectId;
}
