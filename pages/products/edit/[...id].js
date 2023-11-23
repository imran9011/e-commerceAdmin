import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((res) => {
      setProductInfo(res.data);
    });
  }, [id]);

  return (
    <>
      {id ? (
        <Layout>
          <h1>Edit Product</h1>
          {productInfo && <ProductForm {...productInfo} />}
        </Layout>
      ) : (
        <div className="h-screen w-screen flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
}
