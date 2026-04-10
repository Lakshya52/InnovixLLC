import { logout } from "@/actions/auth";

export default function AdminDashboard() {
  return (
    <div className="min-h-dvh pt-24 p-10 flex flex-col gap-8 w-full">
      <div className="flex w-full items-center justify-between border-b border-(--text-main)/10 pb-6">
        <div>
          <h1 className="text-4xl font-bold font-grotesk text-(--accent)">Admin Dashboard</h1>
          <p className="font-inter text-(--text-main)/60 mt-2">Welcome to the central administrative panel.</p>
        </div>

        <form action={logout}>
          <button className="bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-inter font-medium transition-all cursor-pointer">
            Secure Logout
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-(--bg-less-dark) p-6 rounded-xl border border-(--accent)/20 shadow-lg">
          <h3 className="font-inter text-(--text-main)/60 text-sm">Total Active Users</h3>
          <p className="text-4xl font-grotesk font-bold text-(--text-main) mt-2">1,249</p>
        </div>
        <div className="bg-(--bg-less-dark) p-6 rounded-xl border border-(--accent)/20 shadow-lg">
          <h3 className="font-inter text-(--text-main)/60 text-sm">Revenue Today</h3>
          <p className="text-4xl font-grotesk font-bold text-(--accent) mt-2">$8,432</p>
        </div>
        <div className="bg-(--bg-less-dark) p-6 rounded-xl border border-(--accent)/20 shadow-lg">
          <h3 className="font-inter text-(--text-main)/60 text-sm">Pending Tickets</h3>
          <p className="text-4xl font-grotesk font-bold text-orange-400 mt-2">12</p>
        </div>
      </div>
    </div>
  );
}
