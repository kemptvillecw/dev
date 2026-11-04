// Run: node --test scripts/metadata-wrap.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

// The cases below are text-only. No browser or network access is required.
const window = {};
const document = {
  head: null,
  createElement(name) {
    assert.equal(name, 'template');
    return {
      content: { textContent: '', querySelectorAll: () => [] },
      set innerHTML(value) { this.content.textContent = value; }
    };
  }
};
vm.runInNewContext(readFileSync(join(__dirname, 'event-description.js'), 'utf8'), { window, document });
const { metadata } = window.KCWEventDescription;
const block = json => 'About the event\n[KCW_METADATA]\n' + json + '\n[/KCW_METADATA]';

test('reflows the real Lis Angus image-alt example without losing featured status', () => {
  const result = metadata(block('{"imageAlt":"Lis Angus\nauthor","featured":true,"status":"Published"}'));
  assert.equal(result.imageAlt, 'Lis Angus author');
  assert.equal(result.featured, true);
  assert.equal(result.status, 'Published');
});

test('handles a CRLF break introduced by the calendar rich-text editor', () => {
  const result = metadata(block('{"imageAlt":"This is an image\r\ndescription","featured":true}'));
  assert.equal(result.imageAlt, 'This is an image description');
});

test('preserves correctly escaped newlines', () => {
  assert.equal(metadata(block('{"imageAlt":"First\\nSecond"}')).imageAlt, 'First\nSecond');
});

test('does not reinterpret unrelated malformed metadata', () => {
  assert.equal(Object.keys(metadata(block('{"featured":tru,"imageAlt":"x\ny"}'))).length, 0);
  assert.equal(Object.keys(metadata(block('{"imageAlt":"unterminated}'))).length, 0);
});
