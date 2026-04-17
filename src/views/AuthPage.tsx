"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"reader" | "writer">("reader");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/");
      } else {
        if (!username.trim()) {
          toast.error("Username is required");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username, display_name: username, role },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setCheckEmail(true);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Globe className="w-7 h-7 text-primary" />
          <span className="font-display font-bold text-2xl text-foreground">Logo</span>
        </div>

        {checkEmail ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">Check your email</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              We've sent a magic confirmation link to <strong className="text-foreground">{email}</strong>. 
              Please click the link inside to activate your account.
            </p>
            <button
              onClick={() => {
                setCheckEmail(false);
                setIsLogin(true);
                setPassword("");
              }}
              className="lux-button w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-xl text-sm font-semibold transition-all"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {isLogin ? "Sign in to your account" : "Join our community of readers & writers"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                
                <div className="flex items-center gap-4 mt-2 mb-2 p-1 bg-muted/30 rounded-lg">
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer transition-colors ${role === 'reader' ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50'}`}>
                    <input type="radio" className="hidden" name="role" value="reader" checked={role === 'reader'} onChange={() => setRole('reader')} />
                    Reader
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer transition-colors ${role === 'writer' ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50'}`}>
                    <input type="radio" className="hidden" name="role" value="writer" checked={role === 'writer'} onChange={() => setRole('writer')} />
                    Author
                  </label>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="lux-button w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>



          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-primary font-medium">
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default AuthPage;
