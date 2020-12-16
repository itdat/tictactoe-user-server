const groupByKey = (list, key) => {
  if (!list) return []; 

  return list.reduce(function (r, a) {
    r[a[key]] = r[a[key]] || []
    r[a[key]].push(a)
    return r
  }, {});
}

const groupBy = (list, ev) => {
  if (!list) { return [] }

  return list.reduce(function (r, a) {
    const key = ev(a)
    r[key] = r[key] || []
    r[key].push(a)
    return r
  }, {})
}

module.exports = { groupByKey, groupBy };
