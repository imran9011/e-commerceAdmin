export default function DashboardData({ name, amount }) {
  return (
    <div className="bg-white flex mt-5 w-60 py-2 items-center text-center justify-center">
      <p className="text-xl font-semibold text-gray-700">
        {name}
        {amount}
      </p>
    </div>
  );
}
