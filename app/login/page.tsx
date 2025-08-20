import { LoginForm } from "@/components/login-form"
import * as React from "react";

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
      <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          {/* InterGastro Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full relative">
                  <div className="absolute inset-2 bg-white rounded-full">
                    <div className="absolute top-1 left-1 w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
                <span className="font-bold text-[#1E5A96] text-2xl">
                  Inter
                </span>
              <span className="font-bold text-[#4A90E2] text-2xl">
                  Gastro
                </span>
            </div>
          </div>

          {/* Welcome Text */}
          <h2 className="text-4xl font-light text-white">Bienvenido</h2>
        </div>
      </div>
    </div>
  )
}
