import Layout from "@/components/Layout";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SingleOrderPage({ session }) {
  const [order, setOrder] = useState();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (session) {
      axios.post("/api/orders", { id }).then((result) => {
        setOrder(result.data);
      });
    }
  }, [session]);

  return (
    <Layout>
      {order && (
        <>
          <h1 className="my-2">Order id: {id}</h1>
          <p className="my-2 text-gray-700">Order Date: {new Date(order.createdAt).toLocaleString()}</p>
          <table className="basic mb-8">
            <thead>
              <tr className="border border-t-2 border-gray-200">
                <th>Name</th>
                <th>Q</th>
                <th>Unit Price (GBP)</th>
                <th>Total Price (GBP)</th>
              </tr>
            </thead>
            <tbody>
              {order?.line_items.map((item, i) => {
                return (
                  <tr className={i % 2 == 0 ? "bg-gray-100" : ""} key={item.price_data.product_data._id}>
                    <td>{item.price_data.product_data.name}</td>
                    <td>{item.quantity}</td>
                    <td>£{item.price_data.unit_amount / 100}</td>
                    <td>£{(item.price_data.unit_amount * item.quantity) / 100}</td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                <td>
                  <p className="font-semibold">TOTAL:</p>
                </td>
                <td>
                  <p className="font-semibold">£{order?.total / 100}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </>
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
