import { useState } from 'react'; // <-- ADDED
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import api from "../services/api"; // <-- ADDED

function SignUpPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  
  // --- REPLACED LOGIC ---
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', { email: data.email, password: data.password });
      navigate("/login"); // Redirect to login on success
    } catch (err) {
      setError(err.response?.data?.message || 'Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // ----------------------

  return (
    <Card className="w-full max-w-sm animate-fade-in-up bg-white text-[#040F0F] border-slate-200">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your details to get started.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Username</Label>
            <Input id="email" type="text" placeholder="Create username" {...register("email", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password", { required: true })} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-6">
          {/* --- ADDED LOGIC FOR BUTTON AND ERROR --- */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[#040F0F] text-white hover:bg-[#040F0F]/90"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
          {/* ------------------------------------------- */}
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#040F0F] hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default SignUpPage;