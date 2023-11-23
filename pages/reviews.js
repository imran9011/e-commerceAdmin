import Layout from "@/components/Layout";
import RecipientInfo from "@/components/RecipientInfo";
import PageNav from "@/components/PageNav";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import DateRangeFilter from "@/components/DateRangeFilter";
import { getSession } from "next-auth/react";

export default function ReviewsPage({ session }) {
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [email, setEmail] = useState("");
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState(new Date(Date.now()).toISOString().substring(0, 10));
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (session) {
      axios.get("/api/reviews").then((response) => {
        const { reviews, reviewCount } = response.data;
        setReviews(reviews);
        setReviewCount(reviewCount);
      });
    }
  }, [session]);

  function filterReviews() {
    axios.post("/api/reviews", { email, fromDate, toDate, page: 0 }).then((response) => {
      const { reviews, reviewCount } = response.data;
      setReviews(reviews);
      setReviewCount(reviewCount);
      setPage(0);
    });
  }

  function changePage(pageNumber) {
    if (pageNumber < 0) pageNumber = 0;
    if (pageNumber > Math.ceil(reviewCount / 10) - 1) {
      pageNumber = Math.ceil(reviewCount / 10) - 1;
    }
    setPage(pageNumber);
    axios.post("/api/reviews", { email, fromDate, toDate, page: pageNumber }).then((response) => {
      const { reviews, reviewCount } = response.data;
      setReviews(reviews);
      setReviewCount(reviewCount);
    });
  }

  return (
    <Layout>
      <h1 className="text-center">Reviews</h1>
      <DateRangeFilter {...{ fromDate, setFromDate, toDate, setToDate, email, setEmail, filterFunction: filterReviews }} />
      <p className="">{reviewCount} results found</p>
      <PageNav {...{ changePage, page, docCount: reviewCount }} />
      <table className="basic mb-8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 &&
            reviews.map((review, i) => (
              <tr className={i % 2 == 0 ? "bg-gray-100" : ""} key={review._id}>
                <td>{new Date(review.createdAt).toLocaleString()}</td>
                <td>
                  <RecipientInfo type="Email" name={review.user.email} />
                  <RecipientInfo type="Review ID" name={review._id} />
                </td>
                <td>
                  <Link href={"/review/" + review._id} className="btn-default min-w-full h-16">
                    Show Review
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <PageNav {...{ changePage, page, docCount: reviewCount }} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
