import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase/firebase";
import { Label } from "@radix-ui/react-label";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { FormEvent, useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handleRegister = async(e:FormEvent) =>{
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth,email,password);
      const user = auth.currentUser;
      console.log(user)
      console.log("Users registered successfully")
    } catch (error:any) {
      console.log(error.message);
    }
  }
  return (
    <>
      <div className="max-w-sm mx-auto p-4 bg-white shadow-md rounded-lg">
      <form className="space-y-4" onSubmit={handleRegister}>
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>
        
        <Button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Submit
        </Button>
      </form>
    </div>
    </>
  );
};

export default RegisterPage;
