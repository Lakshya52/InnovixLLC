import Link from "next/link";
import { login } from "@/actions/auth";

export default function Login() {
  return (
    <div className=" w-full min-h-dvh flex flex-col items-center justify-center">
      {/* Small glowing blob in background for aesthetics to match landing page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-(--accent)/20 blur-[100px] -z-10 rounded-full" />

      <form action={login} className="bg-(--bg-less-dark) p-10 rounded-2xl shadow-xl shadow-black/50 border border-(--accent)/20 flex flex-col gap-6 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-grotesk text-(--text-main)">Welcome Back</h1>
          <p className="text-(--text-main)/60 mt-2 font-inter text-sm">Please enter your details to sign in</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-(--text-main) font-inter">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="admin@gmail.com"
              required
              className="bg-(--bg-dark) border border-(--text-main)/20 text-(--text-main) rounded-lg p-3 outline-none focus:border-(--accent) transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-(--text-main) font-inter">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-(--bg-dark) border border-(--text-main)/20 text-(--text-main) rounded-lg p-3 outline-none focus:border-(--accent) transition-all"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-(--accent) hover:bg-(--accent)/90 text-(--accent-dark) font-inter font-semibold py-3 rounded-lg shadow-md hover:shadow-[0px_0px_15px_var(--accent)] transition-all cursor-pointer">
          Sign In
        </button>

        <div className="text-center flex justify-center gap-1 font-inter items-center text-sm">
          <span className="text-(--text-main)/60">Don't have an account?</span>
          <Link href="/registration" className="text-(--accent) hover:underline font-medium">Register here</Link>
        </div>
      </form>
    </div>
  );
}
