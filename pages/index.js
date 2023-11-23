import DashboardData from "@/components/DashboardData";
import Layout from "@/components/Layout";
import LineChart from "@/components/linechart";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home({ session }) {
  const [productCount, setProductCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);

  let total = 0;

  if (orders.length > 0) {
    orders.map((order) => (total += order.total / 100 || 0));
    total = total.toFixed(2);
  }

  useEffect(() => {
    if (session) {
      axios
        .get("/api/dashboard", {
          params: {
            count: true,
          },
        })
        .then((res) => {
          setProductCount(res.data.productCount);
          setReviewCount(res.data.reviewCount);
          setUserCount(res.data.userCount);
          setOrderCount(res.data.orderCount);
        });
      axios
        .get("/api/orders", {
          params: {
            dashboard: true,
          },
        })
        .then((result) => setOrders(result.data));
    }
  }, [session]);

  return (
    <Layout>
      {session && (
        <div className="text-blue-900 flex justify-between">
          <h2>
            hello, <b>{session?.user?.name}</b>
          </h2>
          <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
            <img className="w-6 h-6" src={session?.user?.image} alt="" />
            <span className="px-2">{session?.user?.name}</span>
          </div>
        </div>
      )}
      <div className="flex w-full justify-center">
        <div className="flex w-4/5">
          <LineChart orders={orders} />
        </div>
      </div>
      <div className="flex justify-center flex-wrap gap-x-6">
        <DashboardData name={"Number of products: "} amount={productCount} />
        <DashboardData name={"Number of review: "} amount={reviewCount} />
        <DashboardData name={"Number of users: "} amount={userCount} />
        <DashboardData name={"Number of orders: "} amount={orderCount} />
        <DashboardData name={"Total Revenue 2023: £"} amount={total} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
