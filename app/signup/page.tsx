"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessageCircle,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";

function GoogleMark() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg font-bold text-[#4285f4] shadow-sm">
      G
    </span>
  );
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <main className="h-screen overflow-hidden bg-[#f3f6fb] px-4 py-4 text-[#111827] lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto flex h-[calc(100vh-32px)] w-full max-w-[1500px] overflow-hidden rounded-[34px] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.16)]">
        <section className="relative hidden w-1/2 overflow-hidden bg-[#05292b] px-8 py-8 text-white lg:block xl:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(32,217,155,0.24),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(10,96,111,0.55),transparent_34%),linear-gradient(160deg,#063b34_0%,#031f2d_58%,#06352f_100%)]" />

          <div className="absolute -bottom-10 left-0 right-0 h-52 bg-[radial-gradient(90%_80%_at_20%_50%,rgba(20,148,109,0.56),transparent_55%),radial-gradient(70%_70%_at_88%_34%,rgba(9,107,95,0.65),transparent_58%)]" />

          <div className="absolute right-12 top-16 grid grid-cols-7 gap-3 opacity-25">
            {Array.from({ length: 49 }).map((_, index) => (
              <span
                key={index}
                className="h-1 w-1 rounded-full bg-emerald-300"
              />
            ))}
          </div>

          <div className="absolute bottom-[330px] right-16 grid grid-cols-7 gap-3 opacity-25">
            {Array.from({ length: 35 }).map((_, index) => (
              <span
                key={index}
                className="h-1 w-1 rounded-full bg-emerald-300"
              />
            ))}
          </div>

          <span className="absolute left-20 top-48 h-9 w-9 rounded-full border border-emerald-300/20" />
          <span className="absolute left-24 top-44 h-8 w-8 rounded-full bg-emerald-400/35 shadow-[0_0_18px_rgba(52,211,153,0.42)]" />
          <span className="absolute right-20 top-64 h-9 w-9 rounded-full border border-emerald-300/20" />
          <span className="absolute left-24 top-[390px] h-1.5 w-1.5 rounded-full bg-emerald-200" />
          <span className="absolute right-48 top-[385px] h-2.5 w-2.5 rounded-full bg-emerald-200" />

          <div className="relative z-10 flex h-full flex-col items-center text-center">
            <div className="flex items-center gap-5">
              <div className="flex h-[58px] w-[84px] items-center justify-center rounded-[26px] border-[5px] border-emerald-400 text-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.38)]">
                <MessageCircle className="h-10 w-10" strokeWidth={2.7} />
              </div>

              <p className="text-[38px] font-extrabold leading-none tracking-normal">
                EasyTalk <span className="text-emerald-400">AI</span>
              </p>
            </div>

            <div className="mt-8">
              <h1 className="text-[34px] font-extrabold leading-tight tracking-normal xl:text-[40px]">
                Smart Conversations,
                <br />
                <span className="text-emerald-400">Smarter Businesses.</span>
              </h1>

              <p className="mx-auto mt-4 max-w-[460px] text-[17px] leading-7 text-slate-200/85">
                Create your account and start automating conversations with AI.
              </p>
            </div>

            <div className="relative mt-auto h-[300px] w-full max-w-[620px]">
              <div className="absolute left-10 top-4 z-40 rounded-[22px] bg-emerald-400/75 px-5 py-3 text-left text-base font-bold leading-6 shadow-2xl">
                Hi! How can
                <br />
                I help you?
                <span className="absolute -bottom-4 right-6 h-7 w-7 rotate-45 bg-emerald-400/75" />
              </div>

              <div className="absolute right-12 top-24 z-40 flex h-[56px] w-[84px] items-center justify-center rounded-[18px] bg-emerald-400/45 shadow-xl">
                <MoreHorizontal className="h-10 w-10 text-emerald-100" />
              </div>

              <div className="absolute bottom-10 left-0 z-40 w-[160px] rounded-[18px] border border-emerald-200/15 bg-white/8 p-4 text-left backdrop-blur">
                <p className="text-xs text-slate-200">AI Conversations</p>
                <p className="mt-2 text-3xl font-extrabold">24/7</p>
                <p className="mt-1 text-sm font-semibold text-emerald-300">
                  Always On
                </p>
              </div>

              <div className="absolute bottom-10 right-0 z-40 w-[160px] rounded-[18px] border border-emerald-200/15 bg-white/8 p-4 text-left backdrop-blur">
                <p className="text-xs text-slate-200">Resolution Rate</p>
                <p className="mt-2 text-3xl font-extrabold">98%</p>
                <p className="mt-1 text-sm text-slate-300">Efficiency</p>
                <span className="absolute bottom-6 right-5 h-10 w-10 rounded-full border-[7px] border-emerald-400 border-r-[#0b4350]" />
              </div>

              <div className="absolute bottom-7 left-1/2 z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl" />
              <div className="absolute bottom-1 left-1/2 z-10 h-10 w-[360px] -translate-x-1/2 rounded-[50%] bg-black/40 blur-md" />

              <Image
                src="/images/robot.png"
                alt="EasyTalk AI robot"
                width={512}
                height={512}
                priority
                className="absolute bottom-2 left-1/2 z-30 h-auto w-[270px] -translate-x-1/2 drop-shadow-[0_20px_32px_rgba(0,0,0,0.42)] xl:w-[310px]"
              />
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-6 py-5 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-[560px]">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold tracking-normal text-[#111827]">
                Create Account
              </h2>

              <p className="mt-3 text-base text-slate-500 sm:text-lg">
                Fill in the details below to get started.
              </p>
            </div>

            <form className="mt-5 space-y-3">
              <div>
                <label
                  className="text-base font-bold text-slate-600"
                  htmlFor="email"
                >
                  Email Address
                </label>

                <div className="mt-2 flex h-14 items-center rounded-xl border border-emerald-400 bg-white px-5 shadow-[0_0_0_1px_rgba(52,211,153,0.06)] transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                  <Mail className="h-5 w-5 text-slate-500" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="ml-4 min-w-0 flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-base font-bold text-slate-600"
                  htmlFor="password"
                >
                  Password
                </label>

                <div className="mt-2 flex h-14 items-center rounded-xl border border-slate-200 bg-white px-5 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                  <LockKeyhole className="h-5 w-5 text-slate-500" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="ml-4 min-w-0 flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-3 text-slate-500 transition hover:text-emerald-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="text-base font-bold text-slate-600"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>

                <div className="mt-2 flex h-14 items-center rounded-xl border border-slate-200 bg-white px-5 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                  <LockKeyhole className="h-5 w-5 text-slate-500" />

                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="ml-4 min-w-0 flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Confirm your password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-3 text-slate-500 transition hover:text-emerald-600"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm leading-6 text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50/50">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-emerald-600"
                />

                <span>
                  I agree to the{" "}
                  <Link
                    href="/legal/terms-of-service"
                    className="font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy-policy"
                    className="font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={!agreedToTerms}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#10d985] to-[#04936d] text-lg font-extrabold text-white shadow-[0_16px_30px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(16,185,129,0.34)] focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_16px_30px_rgba(16,185,129,0.28)]"
              >
                <UserPlus className="h-6 w-6" />
                Create Account
              </button>
            </form>

            <div className="my-3 flex items-center gap-5 text-base font-semibold text-slate-500">
              <span className="h-px flex-1 bg-slate-200" />
              or
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button className="flex h-14 w-full items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
              <GoogleMark />
              Continue with Google
            </button>

            <p className="mx-auto mt-3 max-w-[560px] text-center text-sm leading-6 text-slate-500">
              Already have an account?{" "}
              <Link className="font-semibold text-emerald-600" href="/login">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}