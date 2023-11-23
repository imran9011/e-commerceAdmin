import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  return (
    <Layout>
      <h1 className="text-center md:max-w-screen-md">Add New Product</h1>
      <ProductForm />
    </Layout>
  );
}
