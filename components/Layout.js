import Navbar from "@/components/Navbar.js";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  async function login() {
    signIn("credentials", { email: "test@mail.com", password: "test@mail.com" });
  }

  if (!session) {
    return (
      <div className="bg-gray-100 w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col gap-4 -mt-32 w-72">
          <div className="flex flex-col items-center text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-sm"> Please add your gmail account in the settings page with test admin before logging in with Google</p>
          </div>
          <button onClick={() => signIn("google")} className="btn-default w-full">
            Login with Google
          </button>
          <button onClick={login} className="btn-default w-full">
            Login with test admin account
          </button>
        </div>
      </div>
    );
  } else
    return (
      <div className="bg-gray-100  min-h-screen h-full">
        <div className="block md:hidden flex items-center p-2">
          <button onClick={() => setShowNav(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex grow justify-center mr-6 h-4">{<Logo />}</div>
        </div>
        <div className="flex h-full">
          <Navbar setShowNav={setShowNav} show={showNav} />
          <div className="flex-grow p-4">{children}</div>
        </div>
      </div>
    );
}
