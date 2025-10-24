import { StackHandler } from "@stackframe/stack";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { stackServerApp } from "@/lib/stack-server";

export default function Handler(props: any) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Aesthetic Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/images/aesthetic/wp13154126-writing-aesthetic-wallpapers.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-primary-50/80 to-white/90" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-700 shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">
            Welcome to NoobBlog
          </h1>
          <p className="text-neutral-600">
            Join our community of writers and readers
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-neutral-200/50 p-8 sm:p-10">
          <StackHandler 
            fullPage={false} 
            app={stackServerApp} 
            routeProps={props}
          />
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-neutral-600">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-primary hover:text-primary-700 font-medium">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:text-primary-700 font-medium">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
