// analytics.mod.js - ES module extraction of analytics helpers once under legacy App.utils.analytics

export function summarizeLogs(logs){
  if(!Array.isArray(logs) || logs.length===0){
    return { total:0, firstDate:null, lastDate:null };
  }
  let first = logs[0].date, last = logs[0].date;
  for(const l of logs){
    if(l.date < first) first = l.date;
    if(l.date > last) last = l.date;
  }
  return { total: logs.length, firstDate:first, lastDate:last };
}

export function activityLastNDays(logs, days){
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate()-days);
  const active = new Set();
  for(const l of logs){
    const d = new Date(l.date);
    if(d>cutoff) active.add(l.date);
  }
  return { activeDays: active.size, window: days };
}
