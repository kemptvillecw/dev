import { PublicContentService } from './service.js';
import { validatePublicList, validatePublicDetail } from '../scripts/public-content-contract.js';
class CatalogueService extends PublicContentService { summary(record) { return record; } }
export function queryCatalogue(snapshot, params) {
  const query = {}; for (const key of ['type', 'author', 'tag', 'from', 'to', 'page']) query[key] = params.getAll(key);
  for (const key of Object.keys(query)) if (!query[key].length) delete query[key];
  query.size = ['12'];
  const service = new CatalogueService({ labels: () => ({}), listPublic: () => snapshot.items }, { now: () => new Date(snapshot.generatedAt) });
  return validatePublicList(service.list(query));
}
export function createContentClient() {
  let snapshot = JSON.parse(document.getElementById('static-catalogue').textContent);
  const initial = document.getElementById('static-detail'); let initialDetail = initial ? JSON.parse(initial.textContent) : null;
  async function refresh(signal) {
    const response = await fetch(new URL('./catalogue.json', import.meta.url), { signal, cache: 'no-cache', credentials: 'omit' });
    if (!response.ok) throw new Error('Content updates are temporarily unavailable. Please try again.');
    const next = await response.json(); queryCatalogue(next, new URLSearchParams());
    if (!/^snapshot-[0-9]+$/.test(next.version)) throw new Error('Invalid catalogue version');
    snapshot = next;
  }
  return {
    async list(params, signal, reload = false) {
      if (reload) await refresh(signal);
      try { return queryCatalogue(snapshot, params); } catch { throw new Error('Check the selected filters and dates.'); }
    },
    async get(id, signal) {
      if (initialDetail) { const result = initialDetail; initialDetail = null; return validatePublicDetail(result); }
      await refresh(signal);
      const envelope = { schemaVersion: 1, generatedAt: snapshot.generatedAt, dataAsOf: snapshot.generatedAt, snapshotId: 'read-' + Date.parse(snapshot.generatedAt) };
      if (!snapshot.items.some(item => item.id === id && item.type !== 'LINK')) return { ...envelope, item: null };
      const response = await fetch(new URL(`./${snapshot.version}/${encodeURIComponent(id)}.json`, import.meta.url), { signal, credentials: 'omit' });
      if (!response.ok) throw new Error('Content updates are temporarily unavailable. Please try again.');
      const result = validatePublicDetail(await response.json());
      if (result.item?.id !== id) throw new Error('Content could not be loaded.');
      return result;
    }
  };
}
