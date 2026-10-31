import { describe, expect, it } from "vitest";
import { filterCours, formatDuration, formatLevel, sortBySession, type Cours } from "../src/index";

function unCours(overrides: Partial<Cours>): Cours {
  return {
    id: 1,
    documentId: "doc-1",
    title: "Cours",
    summary: null,
    session: 1,
    duration: 90,
    level: "debutant",
    topics: [],
    ...overrides,
  };
}

const COURS: Cours[] = [
  unCours({ documentId: "a", title: "Conteneurs avec Docker", session: 3, level: "intermediaire", topics: ["Docker"] }),
  unCours({ documentId: "b", title: "Introduction au DevOps", session: 1, level: "debutant" }),
  unCours({ documentId: "c", title: "Intégration et déploiement continus", session: 6, level: "avance", topics: ["Pipeline"] }),
  unCours({ documentId: "d", title: "Git et travail collaboratif", session: 2, level: "debutant", topics: ["Git"] }),
];

describe("formatDuration", () => {
  it("affiche les durées de moins d'une heure en minutes", () => {
    expect(formatDuration(45)).toBe("45 min");
  });

  it("affiche les heures et les minutes", () => {
    expect(formatDuration(90)).toBe("1 h 30");
  });

  it("gère plusieurs heures avec des minutes", () => {
    expect(formatDuration(150)).toBe("2 h 30");
  });

  it("affiche une heure pleine sans minutes", () => {
    expect(formatDuration(60)).toBe("1 h");
  });
});

describe("filterCours", () => {
  it("renvoie tous les cours sans filtre", () => {
    expect(filterCours(COURS, {})).toHaveLength(4);
  });

  it("filtre par niveau", () => {
    const resultat = filterCours(COURS, { level: "debutant" });
    expect(resultat.map((c) => c.documentId)).toEqual(["b", "d"]);
  });

  it("ne filtre pas quand le niveau vaut « tous »", () => {
    expect(filterCours(COURS, { level: "tous" })).toHaveLength(4);
  });

  it("renvoie une liste vide quand il n'y a aucun cours", () => {
    expect(filterCours([], { query: "docker", level: "avance" })).toEqual([]);
  });

  it("combine la recherche et le niveau", () => {
    const resultat = filterCours(COURS, { query: "git", level: "debutant" });
    expect(resultat.map((c) => c.documentId)).toEqual(["d"]);
  });
});

describe("sortBySession", () => {
  it("trie les cours par numéro de séance", () => {
    expect(sortBySession(COURS).map((c) => c.session)).toEqual([1, 2, 3, 6]);
  });

  it("ne modifie pas le tableau d'origine", () => {
    sortBySession(COURS);
    expect(COURS.map((c) => c.session)).toEqual([3, 1, 6, 2]);
  });
});
describe("formatLevel", () => {
  it("renvoie le libellé du niveau", () => {
    expect(formatLevel("avance")).toBe("Avancé");
  });
});