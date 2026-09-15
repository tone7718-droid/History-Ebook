import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { QuizPanel } from "@/components/QuizPanel";
const quiz={questions:[{id:"q1",prompt:"첫 문항의 정답은?",choices:[{id:"a",text:"정답1"},{id:"b",text:"오답1"},{id:"c",text:"오답2"}],answer:"a",explanation:"해설1"},{id:"q2",prompt:"둘째 문항의 정답은?",choices:[{id:"a",text:"오답3"},{id:"b",text:"정답2"},{id:"c",text:"오답4"}],answer:"b",explanation:"해설2"}]};
it("freezes submitted score and retries only wrong questions",async()=>{const u=userEvent.setup();render(<QuizPanel quiz={quiz} lessonKey="korean/a/b/c"/>);await u.click(screen.getByLabelText("정답1"));await u.click(screen.getByLabelText("오답3"));await u.click(screen.getByRole("button",{name:"제출하기"}));expect(screen.getByRole("status")).toHaveTextContent("50점");await u.click(screen.getByRole("button",{name:"오답만 다시 풀기"}));expect(screen.queryByText(/첫 문항/)).not.toBeInTheDocument();expect(screen.getByText(/둘째 문항/)).toBeInTheDocument()});
