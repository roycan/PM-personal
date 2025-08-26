QUnit.module('utils: date + id');

QUnit.test('generateId uniqueness basic', assert => {
  const seen = new Set();
  for(let i=0;i<100;i++){
    const id = App.utils.generateId();
    assert.ok(!seen.has(id), 'id not seen yet');
    seen.add(id);
  }
});

QUnit.test('formatDateISO and todayISO shape', assert => {
  const today = App.utils.todayISO();
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(today), 'todayISO pattern');
  const d = new Date('2024-01-05T12:34:56Z');
  const iso = App.utils.formatDateISO(d);
  assert.equal(iso, '2024-01-05', 'formatDateISO output');
});
