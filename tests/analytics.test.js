QUnit.module('analytics: summarize + activity');

QUnit.test('summarizeLogs empty', assert => {
  const out = App.utils.analytics.summarizeLogs([]);
  assert.equal(out.total, 0, 'total 0');
  assert.equal(out.firstDate, null, 'no first date');
});

QUnit.test('summarizeLogs basic', assert => {
  const logs = [
    { date:'2024-03-05' },
    { date:'2024-03-01' },
    { date:'2024-03-10' }
  ];
  const out = App.utils.analytics.summarizeLogs(logs);
  assert.equal(out.total, 3, 'count');
  assert.equal(out.firstDate, '2024-03-01', 'first');
  assert.equal(out.lastDate, '2024-03-10', 'last');
});

QUnit.test('activityLastNDays window', assert => {
  const today = new Date();
  const iso = d => d.toISOString().slice(0,10);
  const l = [];
  for(let i=0;i<5;i++){
    const d = new Date();
    d.setDate(today.getDate()-i);
    l.push({ date: iso(d) });
  }
  const out = App.utils.analytics.activityLastNDays(l, 7);
  assert.ok(out.activeDays <= 7, 'within window');
  assert.equal(out.window, 7, 'window recorded');
});
