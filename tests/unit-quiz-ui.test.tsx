import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { UnitQuiz } from "@/components/UnitQuiz";
import { readProgress } from "@/lib/progress";
it("starts a fresh selection after submitting and preserves original mistake IDs", async () => {
  const user = userEvent.setup();
  const questions = Array.from({ length: 12 }, (_, i) => ({
    id: `lesson::q${i}`, sourceLessonKey: "korean/a/b/c", sourceQuestionId: `q${i}`,
    sourceHref: "/korean/a/b/c", prompt: `문제 ${i}`, answer: "a",
    choices: [{ id: "a", text: "정답" }, { id: "b", text: "오답" }],
  }));
  render(<UnitQuiz quiz={{ questions }} lessonKey="review/korean/a/b" />);
  for (const group of screen.getAllByRole("group")) await user.click(within(group).getByLabelText("오답"));
  await user.click(screen.getByRole("button", { name: "제출하기" }));
  expect(readProgress().mistakes?.[0].id).toMatch(/^korean\/a\/b\/c::q/);
  await user.click(screen.getByRole("button", { name: "새 문제로 다시 풀기" }));
  expect(screen.getByText(/문제 10$/)).toBeInTheDocument();
  expect(screen.getByText(/문제 11$/)).toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "제출하기" })).toBeDisabled();
});
