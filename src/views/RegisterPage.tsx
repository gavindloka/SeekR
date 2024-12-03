import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth,db } from "@/firebase/firebase";
import { Label } from "@radix-ui/react-label";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import {setDoc, doc} from "firebase/firestore"
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";



const RegisterPage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast()
  const navigate = useNavigate();

  const resetForm = () => {
    setName("");
    setAge(0);
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if(user){
        await setDoc(doc(db,"Users", user.uid),{
          name:name,
          age:age,
          email:user.email,
          phone:phone,
        })
      }
      console.log("User registered successfully");
      resetForm();  
      toast({
        duration:5000,
        title: "User registered successfully",
        description: "Account created",
      })
      navigate("/login")
    } catch (error: any) {
      console.log(error.message);
      toast({
        variant: "destructive",
        title: error.message,
        description: "There was a problem with your request.",
      })
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center m-auto p-4 bg-white shadow-md rounded-lg">
        <form
          className="space-y-4 w-[500px] rounded-xl border p-10"
          onSubmit={handleRegister}
        >
          <h1 className="text-3xl text-center font-semibold tracking-tight lg:text-3xl lg:leading-snug">
            Register
          </h1>
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </Label>
            <Input
              type="name"
              id="name"
              name="name"
              required
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </Label>
            <Input
              type="number"
              id="age"
              name="age"
              min={17}
              required
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>
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
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </Label>
            <Input
              type="phone"
              id="phone"
              name="phone"
              required
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPhone(e.target.value)}
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
            Already have an account?{" "}
            <span className="text-sm text-lime-500 cursor-pointer hover:underline" onClick={()=>navigate("/login")}>Click Here</span>
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

export default RegisterPage;
