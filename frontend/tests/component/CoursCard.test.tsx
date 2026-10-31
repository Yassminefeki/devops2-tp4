import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CoursCard from "@/components/CoursCard";
import type { Cours } from "@devops2/cours-utils";

const COURS: Cours = {
  id: 3,
  documentId: "abc123",
  title: "Conteneurs avec Docker",
  summary: "Images, conteneurs et Dockerfile multi-stage.",
  session: 3,
  duration: 90,
  level: "intermediaire",
  topics: ["Docker", "Images"],
};

describe("CoursCard", () => {
  it("affiche le titre sous forme de lien vers la fiche du cours", () => {
    render(<CoursCard cours={COURS} />);
    const lien = screen.getByRole("link", { name: "Conteneurs avec Docker" });
    expect(lien).toHaveAttribute("href", "/cours/abc123");
  });

  it("affiche la durée formatée et le libellé du niveau", () => {
    render(<CoursCard cours={COURS} />);
    expect(screen.getByText("1 h 30")).toBeInTheDocument();
    expect(screen.getByText("Intermédiaire")).toBeInTheDocument();
  });

  it("affiche les mots-clés", () => {
    render(<CoursCard cours={COURS} />);
    const motsCles = screen.getByRole("list", { name: "Mots-clés" });
    expect(within(motsCles).getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Docker", "Images"]);
  });

  it("n'affiche pas de liste de mots-clés quand il n'y en a pas", () => {
    render(<CoursCard cours={{ ...COURS, topics: [] }} />);
    expect(screen.queryByRole("list", { name: "Mots-clés" })).not.toBeInTheDocument();
  });
});
