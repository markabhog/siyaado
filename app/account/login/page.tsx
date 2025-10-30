"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button, Input } from "@/app/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true);
    try {
      await signIn("email", { email, callbackUrl: "/account" });
      alert("Check your email for the magic link.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="mx-auto max-w-md p-4 pb-20">
      <h1 className="mb-3 text-2xl font-semibold">Sign in</h1>
      <div className="grid gap-3">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button disabled={!email || loading} onClick={submit}>{loading ? "Sending…" : "Send magic link"}</Button>
      </div>
    </div>
  );
}


