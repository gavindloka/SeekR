import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import {auth} from "@/firebase/firebase";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth,email,password);
      
      toast({
        duration:5000,
        title: "User Logged In Successfully",
      })
      navigate("/")
    } catch (error: any) {
      console.log(error.message);
      toast({
        variant:"destructive",
        duration:5000,
        title: "Logged In Failed",
        description:"Invalid Credential"
      })
    }
  };

  const navigate = useNavigate();
  return (
    <>
     <div className="w-screen h-screen flex justify-center items-center m-auto p-4 bg-white shadow-md rounded-lg">
        <form
          className="space-y-4 w-[500px] rounded-xl border p-10"
          onSubmit={handleLogin}
        >
          <h1 className="text-3xl text-center font-semibold tracking-tight lg:text-3xl lg:leading-snug">
            Login
          </h1>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              required
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Doesn't have account?{" "}
            <span className="text-sm text-lime-500 cursor-pointer hover:underline" onClick={()=>navigate("/register")}>Click Here</span>
          </div>
          <Button
            type="submit"
            className="w-full py-2 bg-lime-500 text-white rounded-md"
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
