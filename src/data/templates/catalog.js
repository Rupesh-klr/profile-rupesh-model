/**
 * Template catalog — the single index of all sample profile templates.
 * Add a new template: drop a JSON in this folder, import it, add to `sources`.
 * Each JSON carries its own meta: { template (id), role, level, model }.
 */
import student1 from './student-1.json';
import fullstack231 from './dev-2to3-fullstack-1.json';
import frontend231 from './dev-2to3-frontend-1.json';
import backend231 from './dev-2to3-backend-1.json';
import devops231 from './dev-2to3-devops-1.json';

const sources = [student1, fullstack231, frontend231, backend231, devops231];

const txt = (v) => (v && typeof v === 'object' ? v.en : v);

const make = (data) => ({
  id: data.meta.template,
  level: data.meta.level,
  role: data.meta.role,
  model: data.meta.model,
  name: txt(data.person.name),
  title: txt(data.person.title),
  tagline: txt(data.person.tagline),
  data,
});

export const templates = sources.map(make);

export function getTemplate(id) {
  return templates.find((t) => t.id === id) || null;
}

const LEVEL_ORDER = ['Student', '2-3 yrs', '5-6 yrs', '10+ yrs'];

export function templatesByLevel() {
  const groups = {};
  for (const t of templates) (groups[t.level] ||= []).push(t);
  return Object.keys(groups)
    .sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b))
    .map((level) => ({ level, items: groups[level] }));
}
