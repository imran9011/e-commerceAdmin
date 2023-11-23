import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { withSwal } from "react-sweetalert2";

export default withSwal((props, ref) => {
  const { swal, ...rest } = props;
  return <ProductForm swal={swal} {...rest} />;
});

function ProductForm({ _id, title: prevTitle, description: prevDescription, price: prevPrice, images: prevImages, category: prevCategory, properties: prevProperties, swal }) {
  const [title, setTitle] = useState(prevTitle || "");
  const [description, setDescription] = useState(prevDescription || "");
  const [price, setPrice] = useState(prevPrice || "");
  const [productProperties, setProductProperties] = useState(prevProperties || {});

  const [redirect, setRedirect] = useState(false);
  const [images, setImages] = useState(prevImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCateg, setSelectedCateg] = useState(prevCategory || "");
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      selectedCateg,
      properties: productProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setRedirect(true);
  }

  if (redirect) {
    router.push("/products");
    return;
  }

  function addImageLink() {
    swal
      .fire({
        title: "Enter Image Link",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Add",
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (!result?.value) return;
          setImages((current) => [...current, result?.value]);
        }
      });
  }

  async function uploadImage(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      const { imageUrl } = res.data;
      setImages((current) => [...current, imageUrl]);
    }
    setIsUploading(false);
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function removeImage(index) {
    setImages(images.filter((image, i) => i !== index));
  }

  function changeProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories?.length > 0 && selectedCateg) {
    let catInfo = categories.find(({ _id }) => _id === selectedCateg);
    catInfo && propertiesToFill.push(...catInfo?.properties);
    while (catInfo?.parent?.id) {
      const parent = categories.find(({ _id }) => id === catInfo);
      propertiesToFill.push(...parent.properties);
      catInfo = parent;
    }
  }
  return (
    <form onSubmit={saveProduct} className="md:max-w-screen-md">
      <label>Product name</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter product name" />
      <label>Category</label>
      <select value={selectedCateg} onChange={(e) => setSelectedCateg(e.target.value)}>
        <option value="">No Category</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              <></>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p, i) => {
          return (
            <div key={i} className="">
              <label>{p.name}</label>
              <div>
                <select value={productProperties[p.name]} onChange={(e) => changeProductProp(p.name, e.target.value)}>
                  {p.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <label className="w-32 h-32 flex cursor-pointer border border-violet-700 text-sm text-violet-700 gap-1 items-center justify-center rounded-lg bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path
              fillRule="evenodd"
              d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Link
          <button type="button" onClick={addImageLink} />
        </label>
        <label className="w-32 h-32 flex cursor-pointer border border-violet-700 text-sm text-violet-700 gap-1 items-center justify-center rounded-lg bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          Add File
          <input type="file" className="hidden" onChange={uploadImage} />
        </label>
        {images && (
          <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-2">
            {!!images?.length &&
              images.map((link, i) => (
                <div key={link + i} className="h-32 w-32 relative bg-white p-1 rounded-sm">
                  <img className="w-32 h-32 object-contain rounded-sm" src={link} />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 items-center flex bg-gray-300 bg-opacity-80 rounded-full h-6 w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              ))}
          </ReactSortable>
        )}
        {isUploading ? (
          <div className="h-32 w-32 p-1 flex items-center">
            <Spinner />
          </div>
        ) : (
          <></>
        )}
      </div>
      <label>Description</label>
      <textarea className="h-60" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"></textarea>
      <label>Price (USD)</label>
      <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" placeholder="Enter price" />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
