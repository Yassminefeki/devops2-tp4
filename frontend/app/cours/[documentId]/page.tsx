import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getCoursById } from "@/lib/api";
import { formatDuration, LEVEL_LABELS } from "@devops2/cours-utils";

async function CoursDetail({ params }: { params: Promise<{ documentId: string }> }) {
  await connection();
  const { documentId } = await params;
  const cours = await getCoursById(documentId);
  if (!cours) {
    notFound();
  }

  return (
    <article className="cours-detail">
      <div className="eyebrow">Séance {String(cours.session).padStart(2, "0")}</div>
      <h1>{cours.title}</h1>
      {cours.summary && <p className="lead">{cours.summary}</p>}
      <dl className="cours-meta">
        <div>
          <dt>Séance</dt>
          <dd>{cours.session}</dd>
        </div>
        <div>
          <dt>Durée</dt>
          <dd>{formatDuration(cours.duration)}</dd>
        </div>
        <div>
          <dt>Niveau</dt>
          <dd>{LEVEL_LABELS[cours.level]}</dd>
        </div>
      </dl>
      {cours.topics.length > 0 && (
        <ul className="topics" aria-label="Mots-clés">
          {cours.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function CoursPage({ params }: PageProps<"/cours/[documentId]">) {
  return (
    <main>
      <section>
        <div className="container">
          <Link className="back" href="/#cours">← Tous les cours</Link>
          <Suspense fallback={<p>Chargement du cours…</p>}>
            <CoursDetail params={params} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
