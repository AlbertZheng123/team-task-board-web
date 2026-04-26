import { describe, it, expect } from "vitest";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

describe("Backend summary contract", () => {
  it("excludes archived tasks from visible board summary counts", async () => {
    const createRes = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Archived task should be hidden",
        description: "This task should not count toward visible board summary.",
        assignee: "Contract Test",
        priority: "medium"
      })
    });

    expect(createRes.status).toBe(201);

    const task = await createRes.json();

    const archiveRes = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "archived"
      })
    });

    expect(archiveRes.ok).toBe(true);

    const summaryRes = await fetch(`${API_BASE_URL}/summary`);
    expect(summaryRes.ok).toBe(true);

    const summary = await summaryRes.json();

    expect(summary.total).toBe(3);
    expect(summary.todo + summary.in_progress + summary.done).toBe(summary.total);
  });
});
