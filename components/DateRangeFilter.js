export default function DateRangeFilter({ fromDate, setFromDate, toDate, setToDate, email, setEmail, filterFunction }) {
  function clearFilters() {
    setEmail("");
    setFromDate("2023-01-01");
    setToDate(new Date(Date.now()).toISOString().substring(0, 10));
  }
  // setting date maximum and minimum limits
  let toMaxDate = new Date(Date.now()).toISOString().substring(0, 10);

  let fromMaxDate = new Date(toDate);
  fromMaxDate = fromMaxDate.setDate(fromMaxDate.getDate() - 1);

  let toMinDate = new Date(fromDate);
  toMinDate = toMinDate.setDate(toMinDate.getDate() + 1);

  fromMaxDate = new Date(fromMaxDate).toISOString().substring(0, 10);
  toMinDate = new Date(toMinDate).toISOString().substring(0, 10);

  return (
    <>
      <h2>Filter:</h2>
      <div className="my-3 flex gap-x-4">
        <div className="w-60">
          <h2 className="text-gray-600">Date (from-to):</h2>
          <input max={fromMaxDate} value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-10" type="date" />
          <input min={toMinDate} max={toMaxDate} value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-10" type="date" />
        </div>
        <div className="w-60">
          <h2 className="text-gray-600">Email: </h2>
          <input className="h-10" onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter email..." />
          <button className="btn-default w-full h-10" onClick={filterFunction}>
            Filter
          </button>
        </div>
        <div className="h-28 pt-6">
          <button className="btn-primary h-full w-20" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>
    </>
  );
}
