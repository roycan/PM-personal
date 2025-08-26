QUnit.module('validation: bundle + entities');

QUnit.test('validateLog catches missing fields', assert => {
  const projectIds = new Set(['p1']);
  const bad = { id:'l1', projectId:'p1', date:'2024-13-40', results:'' };
  const errors = App.utils.validateLog(bad, projectIds);
  assert.ok(errors.some(e=>e.includes('date invalid')), 'invalid date flagged');
  assert.ok(errors.some(e=>e.includes('missing results')), 'missing results flagged');
});

QUnit.test('validateBundle happy path', assert => {
  const bundle = {
    version: App.utils.DATA_VERSION || 1,
    projects: [{ id:'p1', name:'Proj 1' }],
    logs: [{ id:'l1', projectId:'p1', date:'2024-03-02', results:'Did stuff' }]
  };
  const out = App.utils.validateBundle(bundle);
  assert.ok(out.ok, 'bundle valid');
});

QUnit.test('validateBundle duplicate project id', assert => {
  const bundle = {
    version: App.utils.DATA_VERSION || 1,
    projects: [{ id:'p1', name:'A' }, { id:'p1', name:'B' }],
    logs: []
  };
  const out = App.utils.validateBundle(bundle);
  assert.notOk(out.ok, 'bundle invalid');
  assert.ok(out.errors.some(e=>e.toLowerCase().includes('duplicate project id')), 'duplicate project id detected');
});
