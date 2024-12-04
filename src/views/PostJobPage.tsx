import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

const steps = ["Job Details", "Requirements", "Budget & Duration"];

const PostJobPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleReset = () => setActiveStep(0);

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
          "& .MuiStepIcon-root": { color: "#84cc16" },
          "& .MuiStepIcon-text": { fill: "#fff" },
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
                    />
                  </div>
                </form>
              )}

              {activeStep === 1 && (
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      required
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    />
                  </div>
                </form>
              )}

              {activeStep === 2 && (
                <div>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Review the information you've entered and submit.
                  </Typography>
                  <ul>
                    <li>Name: John Doe</li>
                    <li>Email: johndoe@gmail.com</li>
                  </ul>
                </div>
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
