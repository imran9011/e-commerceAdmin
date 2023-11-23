export default function PageNav({ changePage, page, docCount }) {
  return (
    <div className="flex gap-2 items-center justify-center mb-4">
      <button onClick={() => changePage(0)} className="btn-default rounded-full">
        First
      </button>
      <button onClick={() => changePage(page - 1)} className="btn-default">
        Prev
      </button>
      <p>{page}</p>
      <button onClick={() => changePage(page + 1)} className="btn-default">
        Next
      </button>
      <button onClick={() => changePage(Math.ceil(docCount / 10 - 1))} className="btn-default">
        Last
      </button>
    </div>
  );
}
