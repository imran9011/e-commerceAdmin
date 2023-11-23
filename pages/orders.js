import Layout from "@/components/Layout";
import PageNav from "@/components/PageNav";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import DateRangeFilter from "@/components/DateRangeFilter";
import RecipientInfo from "@/components/RecipientInfo";
import { getSession } from "next-auth/react";

export default function OrdersPage({ session }) {
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [email, setEmail] = useState("");
  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState(new Date(Date.now()).toISOString().substring(0, 10));
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (session) {
      axios.get("/api/orders").then((response) => {
        const { orders, orderCount } = response.data;
        setOrders(orders);
        setOrderCount(orderCount);
      });
    }
  }, [session]);

  function filterOrders() {
    axios.post("/api/orders", { email, fromDate, toDate, page }).then((response) => {
      const { orders, orderCount } = response.data;
      setOrders(orders);
      setOrderCount(orderCount);
      setPage(0);
    });
  }

  function changePage(pageNumber) {
    if (pageNumber < 0) pageNumber = 0;
    if (pageNumber > Math.ceil(orderCount / 10) - 1) {
      pageNumber = Math.ceil(orderCount / 10) - 1;
    }
    setPage(pageNumber);
    axios.post("/api/orders", { email, fromDate, toDate, page: pageNumber }).then((response) => {
      const { orders, orderCount } = response.data;
      setOrders(orders);
      setOrderCount(orderCount);
    });
  }

  return (
    <Layout>
      <h1 className="text-center">Orders</h1>
      <DateRangeFilter {...{ fromDate, setFromDate, toDate, setToDate, email, setEmail, filterFunction: filterOrders }} />
      <p className="">{orderCount} results found</p>
      <PageNav {...{ changePage, page, docCount: orderCount }} />
      <table className="basic mb-8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order, i) => (
              <tr className={i % 2 == 0 ? "bg-gray-100" : ""} key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={"text-center " + (order.paid ? "text-green-600" : "text-red-600")}>{order.paid ? "YES" : "NO"}</td>
                <td>
                  <RecipientInfo type="Email" name={order.email} />
                  <RecipientInfo type="Order ID" name={order._id} />
                </td>
                <td>
                  <Link href={"/order/" + order._id} className="btn-default min-w-full h-16">
                    Show Order
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <PageNav {...{ changePage, page, docCount: orderCount }} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
