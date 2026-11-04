(function () {
  'use strict';
  const root = document.querySelector('[data-contests]');
  if (!root) return;
  const config = window.KCW_CALENDAR;
  const description = window.KCWEventDescription;
  const status = root.querySelector('[data-contest-status]');
  const cards = root.querySelector('[data-contest-results]');
  const retry = root.querySelector('[data-contest-retry]');
  const formFilter = root.querySelector('[data-contest-form]');
  const genreFilter = root.querySelector('[data-contest-genre]');
  const freeFilter = root.querySelector('[data-contest-free]');
  const searchInput = root.querySelector('[data-contest-search]');
  const count = root.querySelector('[data-contest-count]');
  const previous = root.querySelector('[data-contest-previous]');
  const next = root.querySelector('[data-contest-next]');
  const pageLabel = root.querySelector('[data-contest-page-label]');
  const pageSize = 6;
  let contests = [];
  let page = 0;

  function dateParts(date, timezone) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    const get = type => parts.find(part => part.type === type)?.value || '';
    return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function today(timezone = 'America/Toronto') {
    try { return dateParts(new Date(), timezone); }
    catch { return dateParts(new Date(), 'America/Toronto'); }
  }
  function dateLabel(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return 'Date not specified';
    const date = new Date(`${iso}T12:00:00Z`);
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'
    }).format(date);
  }
  function safeUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(value, document.baseURI);
      return (url.protocol === 'https:' || url.protocol === 'http:') ? url.href : null;
    } catch { return null; }
  }
  function addText(element, tag, className, content) {
    if (!content) return null;
    const child = document.createElement(tag);
    if (className) child.className = className;
    child.textContent = content;
    element.append(child);
    return child;
  }
  function link(parent, value, text, className) {
    const url = safeUrl(value);
    if (!url) return;
    const anchor = document.createElement('a');
    anchor.className = className || 'button';
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = text;
    parent.append(anchor);
  }
  function endsOn(event) {
    if (event.metadata.contestDeadline) return event.metadata.contestDeadline;
    // All-day Google Calendar events have an exclusive end date.
    if (event.raw.end?.date) {
      const end = new Date(`${event.raw.end.date}T00:00:00Z`);
      end.setUTCDate(end.getUTCDate() - 1);
      return end.toISOString().slice(0, 10);
    }
    return event.raw.end?.dateTime
      ? dateParts(new Date(event.raw.end.dateTime), config.timezone)
      : '';
  }
  function beginsOn(event) {
    if (event.metadata.contestOpenDate) return event.metadata.contestOpenDate;
    if (event.raw.start?.date) return event.raw.start.date;
    return event.raw.start?.dateTime
      ? dateParts(new Date(event.raw.start.dateTime), config.timezone)
      : '';
  }
  function deadlinePassed(record) {
    const zone = record.metadata.contestDeadlineTimezone || config.timezone;
    const dateNow = today(zone);
    if (record.deadline < dateNow) return true;
    if (record.deadline > dateNow || !record.metadata.contestDeadlineTime) return false;
    // Compare wall-clock components in the contest's stated time zone.
    try {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      const get = type => parts.find(part => part.type === type)?.value || '00';
      return `${get('hour')}:${get('minute')}` > record.metadata.contestDeadlineTime;
    } catch {
      return false; // Do not prematurely hide a contest with an invalid zone.
    }
  }
  function state(record) {
    if (record.openDate && record.openDate > today()) return 'Opening soon';
    if (!record.metadata.contestOpenDate) return 'Deadline upcoming';
    return 'Open';
  }
  function splitTags(value) {
    return String(value || '').split(/[,;]+/).map(x => x.trim()).filter(Boolean);
  }
  function isFree(entryFee) {
    return /^(free|no fee|none|0|\$0(?:\.00)?(?:\s*[a-z]+)?)$/i.test(String(entryFee || '').trim());
  }
  function field(group, label, value) {
    if (!value) return;
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = value;
    group.append(dt, dd);
  }
  function createCard(record) {
    const m = record.metadata;
    const card = document.createElement('article');
    card.className = 'contest-card';
    if (record.id) card.id = record.id;
    const heading = document.createElement('div');
    heading.className = 'contest-card-heading';
    const headingText = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = m.eventTitle || record.raw.summary || 'Writing contest';
    headingText.append(title);
    addText(headingText, 'p', 'contest-organizer', m.contestOrganizer);
    const tag = document.createElement('span');
    tag.className = 'contest-state';
    tag.textContent = state(record);
    heading.append(headingText, tag);
    card.append(heading);

    const photoUrl = safeUrl(m.image);
    if (photoUrl) {
      const photo = document.createElement('img');
      photo.src = photoUrl;
      photo.alt = m.imageAlt || '';
      photo.className = 'contest-image';
      photo.loading = 'lazy';
      card.append(photo);
    }

    const main = document.createElement('div');
    main.className = 'contest-facts';
    const deadline = document.createElement('div');
    addText(deadline, 'small', '', 'Submission deadline');
    addText(deadline, 'strong', '', dateLabel(record.deadline));
    if (m.contestDeadlineTime) addText(deadline, 'small', '',
      `${m.contestDeadlineTime} ${m.contestDeadlineTimezone || config.timezone}`);
    main.append(deadline);
    const eligibility = document.createElement('div');
    addText(eligibility, 'small', '', 'Who can enter');
    addText(eligibility, 'strong', '', m.contestEligibility || 'Check official rules');
    main.append(eligibility);
    card.append(main);

    const descriptionText = description.plainText(record.raw.description);
    addText(card, 'p', 'contest-summary', descriptionText);
    const chips = document.createElement('div');
    chips.className = 'contest-chips';
    for (const text of [
      m.contestForm, ...splitTags(m.contestGenres), m.contestLengthLimit,
      m.contestEntryFee && `Entry fee: ${m.contestEntryFee}`
    ].filter(Boolean)) addText(chips, 'span', 'contest-chip', text);
    if (chips.childElementCount) card.append(chips);

    const actions = document.createElement('div');
    actions.className = 'contest-actions';
    link(actions, m.contestUrl, 'Official contest website', 'button button-primary');
    link(actions, m.contestTermsUrl, 'Complete rules', 'button');
    card.append(actions);

    const more = document.createElement('details');
    more.className = 'contest-details';
    const summary = document.createElement('summary');
    summary.textContent = 'Additional contest details';
    const details = document.createElement('dl');
    field(details, 'Submissions open', m.contestOpenDate ? dateLabel(m.contestOpenDate) : '');
    field(details, 'Region', m.contestRegion);
    field(details, 'Results expected', m.contestAnnouncementDate ? dateLabel(m.contestAnnouncementDate) : '');
    field(details, 'Prizes', m.contestPrize);
    field(details, 'Languages', m.contestLanguage);
    field(details, 'Previously published work', m.contestPublicationPolicy);
    field(details, 'AI assistance', m.contestAiPolicy);
    field(details, 'Additional restrictions', m.contestRestrictions);
    field(details, 'Listing last verified', m.contestVerifiedAt ? dateLabel(m.contestVerifiedAt) : '');
    if (details.childElementCount) {
      more.append(summary, details);
      card.append(more);
    }
    const share = document.createElement('button');
    share.type = 'button'; share.className = 'contest-share';
    share.textContent = 'Copy listing link';
    share.addEventListener('click', async () => {
      const url = new URL('contests.html', document.baseURI);
      url.hash = encodeURIComponent(record.id);
      try {
        await navigator.clipboard.writeText(url.href);
        share.textContent = 'Copied';
      } catch { share.textContent = 'Unable to copy'; }
    });
    card.append(share);
    return card;
  }

  function filtered() {
    const query = searchInput.value.trim().toLowerCase();
    return contests.filter(c => {
      const m = c.metadata;
      if (formFilter.value && m.contestForm !== formFilter.value) return false;
      if (genreFilter.value && !splitTags(m.contestGenres).includes(genreFilter.value)) return false;
      if (freeFilter.checked && !isFree(m.contestEntryFee)) return false;
      if (query && ![
        m.eventTitle, c.raw.summary, m.contestOrganizer, m.contestEligibility,
        m.contestRegion, m.contestForm, m.contestGenres,
        description.plainText(c.raw.description)
      ].join(' ').toLowerCase().includes(query)) return false;
      return true;
    });
  }
  function render() {
    const items = filtered();
    const pages = Math.max(1, Math.ceil(items.length / pageSize));
    page = Math.min(page, pages - 1);
    const visible = items.slice(page * pageSize, (page + 1) * pageSize);
    cards.replaceChildren(...visible.map(createCard));
    count.textContent = `${items.length} contest${items.length === 1 ? '' : 's'} found`;
    pageLabel.textContent = `Page ${page + 1} of ${pages}`;
    previous.disabled = page === 0;
    next.disabled = page + 1 >= pages;
    root.querySelector('[data-contest-pagination]').hidden = items.length <= pageSize;
    status.textContent = items.length
      ? ''
      : (contests.length ? 'No contests match these filters.' : 'No upcoming published contests are listed. Please check back soon.');
  }
  function populateFilters() {
    const addOptions = (control, values) => {
      for (const value of [...new Set(values.filter(Boolean))].sort()) {
        const option = document.createElement('option');
        option.value = value; option.textContent = value; control.append(option);
      }
    };
    addOptions(formFilter, contests.map(c => c.metadata.contestForm));
    addOptions(genreFilter, contests.flatMap(c => splitTags(c.metadata.contestGenres)));
  }
  async function load() {
    retry.hidden = true;
    status.textContent = 'Loading writing contests…';
    cards.replaceChildren();
    root.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      if (location.protocol === 'file:') throw new Error('Use a local preview server.');
      const now = new Date();
      const start = new Date(now); start.setUTCDate(start.getUTCDate() - 366);
      const end = new Date(now); end.setUTCDate(end.getUTCDate() + 366);
      const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.id)}/events`);
      url.search = new URLSearchParams({
        key: config.apiKey,
        timeMin: start.toISOString(), timeMax: end.toISOString(),
        timeZone: config.timezone, singleEvents: 'true',
        orderBy: 'startTime', showDeleted: 'false', maxResults: '250'
      }).toString();
      const gathered = [];
      let token;
      do {
        if (token) url.searchParams.set('pageToken', token);
        else url.searchParams.delete('pageToken');
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Calendar service unavailable.');
        const data = await response.json();
        if (!Array.isArray(data.items)) throw new Error('Invalid calendar response.');
        for (const raw of data.items) {
          if (raw.status === 'cancelled') continue;
          const metadata = description.metadata(raw.description);
          if (!description.isPublic(metadata) ||
              !/^(?:writing\s+)?contests?$/i.test(metadata.type || '')) continue;
          if (!raw.id || (!raw.start?.date && !raw.start?.dateTime) ||
              (!raw.end?.date && !raw.end?.dateTime)) continue;
          const record = { id: raw.id, raw, metadata };
          record.deadline = endsOn(record);
          record.openDate = beginsOn(record);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(record.deadline) ||
              deadlinePassed(record)) continue;
          gathered.push(record);
        }
        token = data.nextPageToken;
      } while (token);
      const unique = new Map(gathered.map(r => [r.id, r]));
      contests = [...unique.values()].sort((a, b) =>
        a.deadline.localeCompare(b.deadline) || (a.raw.summary || '').localeCompare(b.raw.summary || ''));
      formFilter.replaceChildren(formFilter.firstElementChild);
      genreFilter.replaceChildren(genreFilter.firstElementChild);
      populateFilters();
      let hashId = '';
      try { hashId = decodeURIComponent(location.hash.slice(1)); }
      catch { hashId = location.hash.slice(1); }
      const target = contests.findIndex(c => c.id === hashId);
      page = target < 0 ? 0 : Math.floor(target / pageSize);
      render();
      if (target >= 0) document.getElementById(hashId)?.scrollIntoView({ block: 'center' });
    } catch (error) {
      console.error('Contest calendar loading failed:', error.name, error.message);
      status.textContent = location.protocol === 'file:'
        ? 'Open this page through a local web server to load contests.'
        : 'Contests could not be loaded. Please try again.';
      retry.hidden = false;
    } finally {
      clearTimeout(timeout);
      root.setAttribute('aria-busy', 'false');
    }
  }
  for (const input of [formFilter, genreFilter, freeFilter, searchInput]) {
    input.addEventListener(input === searchInput ? 'input' : 'change', () => { page = 0; render(); });
  }
  previous.addEventListener('click', () => { page -= 1; render(); root.scrollIntoView({ block: 'start' }); });
  next.addEventListener('click', () => { page += 1; render(); root.scrollIntoView({ block: 'start' }); });
  retry.addEventListener('click', load);
  root.querySelector('.contest-controls').addEventListener('submit', event => event.preventDefault());
  window.addEventListener('hashchange', () => {
    let targetId = '';
    try { targetId = decodeURIComponent(location.hash.slice(1)); }
    catch { targetId = location.hash.slice(1); }
    const index = contests.findIndex(item => item.id === targetId);
    if (index >= 0) {
      formFilter.value = ''; genreFilter.value = ''; freeFilter.checked = false; searchInput.value = '';
      page = Math.floor(index / pageSize);
      render();
      document.getElementById(targetId)?.scrollIntoView({ block: 'center' });
    }
  });
  load();
})();
