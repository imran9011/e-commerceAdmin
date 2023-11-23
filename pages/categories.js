import Layout from "@/components/Layout";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal, session }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editCat, setEditCat] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (session) {
      fetchCategories();
    }
  }, [session]);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => {
        if (Array.isArray(p.values)) return p;
        else {
          return {
            name: p.name,
            values: p.values.split(","),
          };
        }
      }),
    };
    if (editCat) {
      data._id = editCat._id;
      await axios.put("/api/categories", data);
      setEditCat(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setParentCategory("");
    setName("");
    setProperties([]);
    fetchCategories();
  }

  async function editCategory(category) {
    setEditCat(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
    setProperties(category.properties);
  }

  function deletePopup(category) {
    swal
      .fire({
        title: `Are you sure you want to delete ${category.name}`,
        showCancelButton: true,
        confirmButtonText: "Delete",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function updatePropertyName(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function updatePropertyValues(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(i) {
    setProperties((prev) => {
      return prev.filter((p, index) => index !== i);
    });
  }

  return (
    <Layout>
      <h1 className="text-center">Categories</h1>
      <label>{editCat ? `Edit Category ${editCat.name}` : "Create category name"}</label>
      <form onSubmit={saveCategory} className="flex flex-col gap-1 mb-4">
        <div className="flex gap-1">
          <input onChange={(e) => setName(e.target.value)} value={name} className="mb-0" type="text" placeholder="Category name" />
          <select className="mb-0" value={parentCategory} onChange={(e) => setParentCategory(e.target.value)}>
            <option value="">No Parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  <></>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Properties</label>
          <button onClick={addProperty} type="button" className="btn-default mb-2">
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, i) => (
              <div key={i} className="flex gap-1 mb-2">
                <input onChange={(e) => updatePropertyName(i, property, e.target.value)} value={property.name} className="mb-0" type="text" placeholder="property name" />
                <input onChange={(e) => updatePropertyValues(i, property, e.target.value)} value={property.values} className="mb-0" type="text" placeholder="values, comma seperated" />
                <button type="button" onClick={() => removeProperty(i)} className="btn-default">
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div>
          <div className="flex gap-1">
            {editCat && (
              <button
                type="button"
                onClick={() => {
                  setEditCat(null);
                  setName("");
                  setParentCategory("");
                  setProperties([]);
                }}
                className="btn-default py-1">
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary py-1">
              Save
            </button>
          </div>
        </div>
      </form>
      {!editCat && (
        <table className="basic">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Parent Category</th>
              <th>Modify</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <div className="flex justify-center p-0">
                      <Link href="" onClick={() => editCategory(category)} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit
                      </Link>
                      <Link href="" onClick={() => deletePopup(category)} className="btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal, session }, ref) => <Categories swal={swal} session={session} />);

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
