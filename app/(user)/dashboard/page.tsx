import { logout } from "@/actions/auth";

export default function Dashboard() {
  return (
    <div className="h-dvh flex items-center justify-center" >

    <div className="" >
      <h1>User Dashboard</h1>
      <form action={logout}>
        <button className="bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-inter font-medium transition-all cursor-pointer">
          Secure Logout
        </button>
      </form>
    </div>
    </div>
  );
}
