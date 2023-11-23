import Layout from "@/components/Layout";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SingleReviewPage({ session }) {
  const [review, setReview] = useState();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (session) {
      axios.post("/api/reviews", { id }).then((result) => {
        setReview(result.data);
      });
    }
  }, [session]);

  async function deleteReview() {
    if (session) {
      try {
        await axios.delete("/api/reviews", { data: { id } });
        router.push("/reviews");
      } catch (error) {}
    }
  }

  return (
    <Layout>
      {review && (
        <div className="flex flex-col max-w-3xl">
          <h1 className="my-0">Review id: {id}</h1>
          <div className="flex w-2/5 py-4">
            {confirmDelete ? (
              <div className="flex gap-4 items-center">
                <h1 className="p-0 m-0">Are you sure?</h1>
                <button onClick={deleteReview} className="btn-red h-10">
                  Yes
                </button>
                <button onClick={() => setConfirmDelete(false)} className="btn-default h-10">
                  No
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="btn-red h-10">
                Delete Review
              </button>
            )}
          </div>
          <table className="basic mb-8">
            <thead>
              <tr>
                <td className="w-36">Attribute</td>
                <td>Value</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Review Date</td>
                <td>{new Date(review.createdAt).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Rating (stars)</td>
                <td>{review.rating}</td>
              </tr>
              <tr>
                <td>Title</td>
                <td>{review.title}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  <p class="break-words overflow-hidden max-w-xl">{review.comment}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
