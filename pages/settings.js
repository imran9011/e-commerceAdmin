import Layout from "@/components/Layout";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Products({ session }) {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios.get("api/admin").then((response) => {
      setAdmins(response.data);
    });
  }, []);

  async function addAdmin() {
    if (!email) return;
    const adminArr = admins.filter((admin) => admin.email === email);
    if (email === session.user.email || adminArr.length > 0) {
      setEmail("Already added");
      return;
    }
    const domain = email.split("@")?.[1];
    if (domain.toLowerCase() !== "gmail.com") {
      setEmail("Can only add gmail accounts");
      return;
    }
    try {
      await axios.post("/api/admin", {
        email,
      });
    } catch (error) {
      setEmail("Invalid request");
      return;
    }
    window.location.reload();
  }

  async function deleteAdmin() {
    if (!email) return;
    if (email === session.user.email) {
      setEmail("Cannot delete own account");
      return;
    }
    if (email === "test@mail.com") {
      setEmail("Cannot delete account");
      return;
    }
    const adminArr = admins.filter((admin) => admin.email === email);
    if (adminArr.length === 0) return;
    try {
      await axios.delete("/api/admin", {
        data: { email },
      });
    } catch (error) {
      setEmail("Invalid request");
      return;
    }
    window.location.reload();
  }

  return (
    <Layout>
      <h1>Add or Delete Administrator</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="Please add a gmail account" />
      <button onClick={addAdmin} className="btn-primary mr-4">
        Add Administrator
      </button>
      <button onClick={deleteAdmin} className="btn-default">
        Delete Administrator
      </button>
      <h2 className="my-4 font-semibold">All Administrators</h2>
      {admins.length > 0 &&
        admins.map((admin) => (
          <div key={admin._id} className="mt-2">
            {admin.email}
          </div>
        ))}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
