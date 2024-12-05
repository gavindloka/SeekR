import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography";
import React, { FormEvent, useState } from "react";
import { db } from "@/firebase/firebase";
import { toast } from "@/hooks/use-toast";
import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const languages = ["English", "Indonesia", "Chinese"];
const steps = ["Job Details", "Requirements", "Budget & Duration"];
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
  { title: "Data-Driven Marketing" },
];
const PostJobPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const isStepSkipped = (step: number) => skipped.has(step);
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(0);
  const [duration, setDuration] = useState(0);

  const navigate = useNavigate();

  const handleNext = async (event: FormEvent) => {
    if (activeStep === steps.length - 1) {
      await handlePostJob(event);
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleReset = () => setActiveStep(0);
  const handleLangChange = (event: any, newValue: string | null) => {
    setLanguage(newValue || "");
  };
  function generateRandomString(length:number) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
  }
  
  const handlePostJob = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (image) {

        const randomPrefix = generateRandomString(10);
        const data = new FormData();
        const currentDate = Date.now();
        const imageName = currentDate + "_" + randomPrefix + "_" + image.name;
        data.append("file",image, imageName)
        data.append("upload_preset","gavindloka")
        data.append("cloud_name","dsscbt1sr")
       const res= await fetch("https://api.cloudinary.com/v1_1/dsscbt1sr/image/upload",{
          method:"POST",
          body:data,
        })
        const uploadedImageURL = await res.json();
        console.log(uploadedImageURL.url)
        imageUrl = uploadedImageURL.url
      }
      const jobPost = {
        title: title,
        description: description,
        language: language,
        skills: selectedSkills,
        minBudget: minBudget,
        maxBudget: maxBudget,
        duration: duration,
        imageUrl: imageUrl,
        createdAt: new Date(),
      };
      const newPostRef = doc(collection(db, "Jobs"));
      await setDoc(newPostRef, jobPost);
      console.log("Post added successfully");
      toast({
        duration: 5000,
        title: "Post added successfully",
        description: "Post created",
      });
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
      toast({
        variant: "destructive",
        title: error.message,
      });
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        marginX: "auto",
        gap: 5,
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          "& .MuiStepIcon-root": {
            backgroundColor: "transparent",
          },
          "& .MuiStepIcon-text": { fill: "#fff" },
          "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed": {
            color: "#65a30d",
          },
        }}
      >
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you're finished!
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <div className="border p-10">
          <React.Fragment>
            <h1 className="my-2 text-3xl text-center font-semibold tracking-tight lg:text-3xl lg:leading-snug">
              Step {activeStep + 1}: {steps[activeStep]}
            </h1>

            <React.Fragment>
              {activeStep === 0 && (
                <form className="space-y-4 w-[500px] rounded-xl">
                  <div>
                    <Label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      required
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      className=" resize-none mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Image
                    </Label>
                    <Input
                      type="file"
                      id="image"
                      name="image"
                      required
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleImageChange}
                    />
                  </div>
                </form>
              )}

              {activeStep === 1 && (
                <form className="space-y-4 w-[500px] rounded-xl">
                  <div>
                    <Label
                      htmlFor="skills"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Skills Required
                    </Label>
                    <Autocomplete
                      onChange={(e, newValue) => {
                        if (newValue.length <= 3) {
                          const skillsTitles = newValue.map(
                            (item) => item.title
                          );
                          setSelectedSkills(skillsTitles);
                        }
                      }}
                      multiple
                      id="tags-outlined"
                      options={skills}
                      getOptionLabel={(option) => option.title}
                      filterSelectedOptions
                      getOptionDisabled={(option) =>
                        selectedSkills.length >= 3 &&
                        !selectedSkills.includes(option.title)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderRadius: "6px",
                            borderWidth: "1px",
                          },
                          "&:hover fieldset": {
                            borderWidth: "2px",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                            borderWidth: "2px",
                          },
                          marginTop: "7px",
                        },
                        maxWidth: 500,
                        minWidth: 500,
                        margin: "0 auto",
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Communication Language
                    </Label>
                    <Autocomplete
                      value={language}
                      disablePortal
                      onChange={handleLangChange}
                      options={languages}
                      sx={{
                        width: "full",
                        marginTop: "7px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderRadius: "6px",
                            borderWidth: "1px",
                          },
                          "&:hover fieldset": {
                            borderWidth: "2px",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                            borderWidth: "2px",
                          },
                        },
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </form>
              )}

              {activeStep === 2 && (
                <form className="space-y-4 w-[500px] rounded-xl">
                  <div className="flex justify-between items-center gap-10">
                    <div className="flex flex-col w-1/2">
                      <Label
                        htmlFor="minBudget"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Min Budget
                      </Label>
                      <Input
                        type="number"
                        id="minBudget"
                        name="minBudget"
                        required
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setMinBudget(Number(e.target.value))}
                        value={minBudget}
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <Label
                        htmlFor="maxBudget"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Max Budget
                      </Label>
                      <Input
                        type="number"
                        id="maxBudget"
                        name="maxBudget"
                        required
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setMaxBudget(Number(e.target.value))}
                        value={maxBudget}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Project Duration (Days)
                    </Label>
                    <Input
                      type="number"
                      id="duration"
                      name="duration"
                      required
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setDuration(Number(e.target.value))}
                      value={duration}
                    />
                  </div>
                </form>
              )}
            </React.Fragment>

            <div className="mt-8 flex justify-center gap-8">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className="rounded-lg w-1/4 text-lime-500 hover:border-lime-500 hover:text-lime-500"
                variant="secondary"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="rounded-lg bg-lime-500 w-1/4 hover:bg-lime-500 hover:border-lime-500"
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </React.Fragment>
        </div>
      )}
    </Box>
  );
};

export default PostJobPage;
