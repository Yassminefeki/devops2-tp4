import Link from "next/link";
import { formatDuration, LEVEL_LABELS, type Cours } from "@devops2/cours-utils";

export default function CoursCard({ cours }: { cours: Cours }) {
  return (
    <article className="card cours-card">
      <div className="num">Séance {String(cours.session).padStart(2, "0")}</div>
      <h3>
        <Link href={`/cours/${cours.documentId}`}>{cours.title}</Link>
      </h3>
      {cours.summary && <p>{cours.summary}</p>}
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
