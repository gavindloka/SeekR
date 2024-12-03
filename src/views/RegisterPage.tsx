import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/firebase/firebase";
import { Label } from "@radix-ui/react-label";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { setDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


const RegisterPage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(true);

  const resetForm = () => {
    setName("");
    setAge(0);
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const skills = [
    { title: "Business Analyst" },
    { title: "Digital Marketing" },
    { title: "Data Analysis" },
    { title: "Search Engine Optimization (SEO)" },
    { title: "Content Marketing" },
    { title: "E-commerce Management" },
    { title: "Social Media Management" },
    { title: "Project Management" },
    { title: "User Experience (UX) Design" },
    { title: "Web Development" },
    { title: "Email Marketing" },
    { title: "Market Research" },
    { title: "Agile Methodology" },
    { title: "Product Management" },
    { title: "Customer Relationship Management (CRM)" },
    { title: "Brand Strategy" },
    { title: "Google Analytics" },
    { title: "Paid Media Advertising" },
    { title: "Conversion Rate Optimization (CRO)" },
    { title: "Content Strategy" },
    { title: "App Development" },
    { title: "Video Marketing" },
    { title: "Influencer Marketing" },
    { title: "Data Visualization" },
    { title: "Search Engine Marketing (SEM)" },
    { title: "Affiliate Marketing" },
    { title: "Public Relations (PR)" },
    { title: "Event Management" },
    { title: "Corporate Communication" },
    { title: "Customer Service Excellence" },
    { title: "Sales Strategy" },
    { title: "Business Intelligence" },
    { title: "Mobile Marketing" },
    { title: "Copywriting" },
    { title: "Brand Development" },
    { title: "Market Segmentation" },
    { title: "Online Advertising" },
    { title: "Customer Experience Management" },
    { title: "Mobile App Marketing" },
    { title: "CRM Software" },
    { title: "B2B Marketing" },
    { title: "B2C Marketing" },
    { title: "Product Development" },
    { title: "Viral Marketing" },
    { title: "Web Analytics" },
    { title: "Lead Generation" },
    { title: "Salesforce CRM" },
    { title: "User Interface (UI) Design" },
    { title: "Search Engine Optimization (SEO) Content Writing" },
    { title: "Chatbot Development" },
    { title: "E-mail Automation" },
    { title: "Content Creation" },
    { title: "Data-Driven Marketing" }
];


  const handleNext = async (e: FormEvent) => {
    e.preventDefault();
    setShowForm(false);
  };



  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          name: name,
          age: age,
          email: user.email,
          phone: phone,
          role: role,
          skills:selectedSkills
        });
      }
      console.log("User registered successfully");
      resetForm();
      toast({
        duration: 5000,
        title: "User registered successfully",
        description: "Account created",
      });
      navigate("/login");
    } catch (error: any) {
      console.log(error.message);
      toast({
        variant: "destructive",
        title: error.message,
        description: "There was a problem with your request.",
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center m-auto p-4 bg-white shadow-md rounded-lg">
        {showForm && (
          <form
            className="space-y-4 w-[500px] rounded-xl border px-10 py-7"
            onSubmit={handleNext}
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

            <div>
              <Label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </Label>
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger className="mt-2">
                  <SelectValue
                    placeholder="Select Role"
                    className="font-light"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="businessOwner">Business Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              Already have an account?{" "}
              <span
                className="text-sm text-lime-500 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Click Here
              </span>
            </div>
            <Button
              type="submit"
              className="w-full py-2 bg-lime-500 text-white rounded-md"
            >
              Submit
            </Button>
          </form>
        )}
        {!showForm && (
          <>
            <div className="flex flex-col justify-center">
              <motion.h1
                className="text-3xl w-11/12 mx-auto text-center font-semibold tracking-tight lg:text-5xl lg:leading-snug"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Show Us Your <span className="text-lime-500">Skills!</span>
              </motion.h1>
              <div className="mt-4">
                <Autocomplete
                onChange={(e, newValue) => {
                  const skillsTitles = newValue.map((item) => item.title);
                  setSelectedSkills(skillsTitles);
                }}
                className="max-w-[500px] min-w-[500px] mx-auto border-lime-500 focus:border-lime-500"
                  multiple
                  id="tags-outlined"
                  options={skills}
                  getOptionLabel={(option) => option.title}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Pleace Input Your Skills"
                    />
                  )}
                />
              </div>
              <div className="mt-4 mx-auto">
                  <Button className=" bg-lime-500" onClick={handleRegister}>
                    Submit
                  </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RegisterPage;
