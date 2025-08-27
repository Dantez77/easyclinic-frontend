import { LoginForm } from "@/components/login-form"
import * as React from "react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Geometric diamond pattern background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(45deg, transparent 35%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.1) 65%, transparent 65%),
              linear-gradient(-45deg, transparent 35%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.1) 65%, transparent 65%)
            `,
              backgroundSize: "60px 60px",
              backgroundPosition: "0 0, 30px 30px",
            }}
          />
        </div>

        {/* Login Form Container */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <LoginForm />
        </div>
      </div>

      {/* Right side - Welcome Section */}
      <div className="flex-1 bg-card flex flex-col items-center justify-center p-8">
        <div className="text-center">
          {/* InterGastro Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo2.png"
              alt="InterGastro Logo"
              width={300}
              height={300}
              className="h-41 w-41"
              priority // Prioritize logo loading
            />

          </div>


          {/* Welcome Text */}
          <h2 className="text-4xl font-light text-white">Bienvenido</h2>
        </div>
      </div>
    </div>
  )
}
