(function (root) {
  const STYLE_ID = 'kcw-event-description-formatting';

  // Calendar descriptions are always rendered as text. Preserve author-entered
  // paragraph/line breaks with CSS rather than inserting calendar HTML into the page.
  function ensureFormattingStyles() {
    if (!document.head || document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .featured-event-description,
      [data-public-calendar] details p {
        white-space: pre-line;
        overflow-wrap: anywhere;
      }
    `;
    document.head.appendChild(style);
  }

  // Metadata belongs to the editor, not the public event description.
  function descriptionText(value) {
    const template = document.createElement('template');
    template.innerHTML = value || '';
    template.content.querySelectorAll('script, style').forEach((node) => node.remove());
    template.content.querySelectorAll('br').forEach((node) => node.replaceWith('\n'));
    template.content.querySelectorAll('p, div').forEach((node) => node.append('\n'));
    return template.content.textContent;
  }
  function plainText(value) {
    return descriptionText(value)
      .replace(/\[KCW_METADATA\][\s\S]*?(?:\[\/KCW_METADATA\]|$)/gi, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  // Rich-text calendar edits sometimes insert a real line break in the
  // middle of a quoted JSON value. Undo only that wrapping damage.
  function unfoldWrappedMetadataJson(text) {
    let result = '';
    let insideString = false;
    let escaped = false;
    let changed = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (insideString && !escaped && (ch === '\n' || ch === '\r')) {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        const before = result[result.length - 1];
        const after = text[i + 1];
        if (before !== ' ' && before !== '\t' && after !== ' ' && after !== '\t') {
          result += ' ';
        }
        changed = true;
        continue;
      }
      result += ch;
      if (insideString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') insideString = false;
      } else if (ch === '"') {
        insideString = true;
      }
    }
    return changed ? result : null;
  }

  function metadata(value) {
    const match = descriptionText(value).match(/\[KCW_METADATA\]([\s\S]*?)\[\/KCW_METADATA\]/i);
    if (!match) return {};
    try {
      let parsed;
      try {
        parsed = JSON.parse(match[1]);
      } catch (error) {
        const unfolded = unfoldWrappedMetadataJson(match[1]);
        if (unfolded === null) return {};
        parsed = JSON.parse(unfolded);
      }
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      const result = { featured: parsed.featured === true };
      if (Object.prototype.hasOwnProperty.call(parsed, 'status')) {
        result.status = typeof parsed.status === 'string' ? parsed.status.trim() : '';
      }
      for (const key of ['type', 'eventTitle', 'learningTopic', 'learningOutcome', 'format',
        'speaker', 'speakerRole', 'speakerUrl', 'image', 'imageAlt', 'hoverText', 'address',
        'directions', 'featureStart', 'featureEnd',
        'contestOrganizer', 'contestEligibility', 'contestRegion',
        'contestOpenDate', 'contestDeadline', 'contestDeadlineTime',
        'contestDeadlineTimezone', 'contestAnnouncementDate',
        'contestUrl', 'contestTermsUrl', 'contestEntryFee',
        'contestPrize', 'contestForm', 'contestGenres',
        'contestLengthLimit', 'contestPublicationPolicy',
        'contestAiPolicy', 'contestRestrictions', 'contestVerifiedAt',
        'contestLanguage']) {
        if (typeof parsed[key] === 'string') result[key] = parsed[key].trim();
      }
      return result;
    } catch {
      return {};
    }
  }
  function isPublic(metadata) {
    // Older calendar entries without an editorial status remain visible.
    return metadata.status === undefined || metadata.status.toLowerCase() === 'published';
  }
  function isFeatured(metadata, today) {
    const validDate = (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
    return isPublic(metadata) && metadata.featured === true && validDate(metadata.featureStart) && validDate(metadata.featureEnd)
      && (!metadata.featureStart || today >= metadata.featureStart)
      && (!metadata.featureEnd || today <= metadata.featureEnd);
  }

  ensureFormattingStyles();
  root.KCWEventDescription = { plainText, metadata, isPublic, isFeatured };
})(window);
