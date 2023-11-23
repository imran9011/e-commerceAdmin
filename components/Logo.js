import Link from "next/link";

export default function Logo({ className = "mb-1 w-6 h-6" }) {
  return (
    <Link className="flex gap-1 pb-2" href={"/"}>
      <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" className={className}>
        <path d="M12 3c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4m4 10.54c0 1.06-.28 3.53-2.19 6.29L13 15l.94-1.88c-.62-.07-1.27-.12-1.94-.12s-1.32.05-1.94.12L11 15l-.81 4.83C8.28 17.07 8 14.6 8 13.54c-2.39.7-4 1.96-4 3.46v4h16v-4c0-1.5-1.6-2.76-4-3.46z" />
      </svg>
      <span>Ecommerce Admin</span>
    </Link>
  );
}
