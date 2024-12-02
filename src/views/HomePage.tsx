import BenefitCard from "@/components/BenefitCard";
import { Navbar } from "@/components/Navbar";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Button } from "@/components/ui/button";
import { Benefit } from "@/models/benefit";
import { motion } from "framer-motion";
import { useAnimation, useInView } from "motion/react";
import { useRef, useEffect } from "react";

const benefits: Benefit[] = [
  {
    title: "Flexible Job Opportunities",
    description: "Find jobs that suit your skills and schedule.",
    action: "Browse Jobs",
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-search text-lime-500"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: "Lowest Service Fee",
    description:
      "Only 3% service fee, much lower compared to other freelance platforms.",
    action: "Learn More",
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-badge-dollar-sign text-lime-500"
      >
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </svg>
    ),
  },
  {
    title: "Free Learning Access",
    description:
      "Get access to Seekr Academy to develop your skills and career.",
    action: "Go to Seekr Academy",
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-graduation-cap text-lime-500"
      >
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </svg>
    ),
  },
  {
    title: "Accurate AI Matching",
    description:
      "Find the right freelancer or jobs that fit your skills in a matter of minutes using out AI technology.",
    action: "Post a Job",
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-brain text-lime-500"
      >
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
        <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
        <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
        <path d="M6 18a4 4 0 0 1-1.967-.516" />
        <path d="M19.967 17.484A4 4 0 0 1 18 18" />
      </svg>
    ),
  },
  {
    title: "Quality Guarantee",
    description:
      "Each freelancer is strictly verified and our escrow system guarantees secure payments",
    action: "Learn More",
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-shield-check text-lime-500"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Scale Quickly",
    description:
      "Quick access to the best talent allows you to scale your team according to needs. ",
    action: "Join Today",
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-square-activity text-lime-500"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M17 12h-2l-2 5-2-10-2 5H7" />
      </svg>
    ),
  },
];
const testimonials = [
  {
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Sarah Chen",
    designation: "Product Manager at TechFlow",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Michael Rodriguez",
    designation: "CTO at InnovateSphere",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    name: "Emily Watson",
    designation: "Operations Director at CloudScale",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
    name: "James Kim",
    designation: "Engineering Lead at DataPro",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
    name: "Lisa Thompson",
    designation: "VP of Technology at FutureNet",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
const HomePage = () => {
  const controls = useAnimation();
  const controlsTestimonies = useAnimation();
  const ref = useRef(null);
  const refTestimonies = useRef(null);
  const isInView = useInView(ref, { margin: "-50px", once: true });
  const isInViewTestimonies = useInView(refTestimonies, { margin: "-50px", once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);
  useEffect(() => {
    if (isInViewTestimonies) {
      controlsTestimonies.start("visible");
    } else {
      controlsTestimonies.start("hidden");
    }
  }, [isInViewTestimonies, controlsTestimonies]);

  return (
    <>
      <div
        className="flex flex-col w-screen min-h-screen"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1), white 100%),
            linear-gradient(to left, rgba(255, 255, 255, 0.5), white 100%),
            url('banner1.jpeg')
          `,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full border-b-2 fixed top-0 left-0 z-10">
          <Navbar />
        </div>
        <div className="w-4/6 my-auto pl-32">
          <motion.h1
            className="text-3xl font-bold tracking-tight lg:text-6xl lg:leading-snug"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Empowering Freelancers and Employers: Where{" "}
            <span className="text-yellow-500">Talent</span> Meets{" "}
            <span className="text-lime-500">Opportunity</span>
          </motion.h1>
          <motion.h2
            className="text-md tracking-tight lg:text-lg lg:leading-snug mt-5 w-2/3 text-gray-700"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Use AI tools to identify exceptional talent or job vacancies, giving
            you full control over the process.
          </motion.h2>
          <div className="flex gap-7 mt-8">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <Button
                className="bg-lime-500 w-36 h-12 text-lg text-white rounded-xl hover:bg-white hover:text-lime-500 hover:border-lime-500  transition-all duration-300 transform hover:scale-105"
                variant="default"
              >
                Browse Jobs
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            >
              <Button className="bg-white w-36 h-12 text-lg  border-lime-500 rounded-xl text-lime-500 hover:bg-lime-500 hover:text-white hover:border-lime-400 transition-all duration-300 transform hover:scale-105">
                Post a Job
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col justify-center">
        <motion.h2
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-semibold tracking-tight text-center mb-12"
        >
          Why Choose Seek
          <label htmlFor="" className="text-lime-500">
            R
          </label>
          ?
        </motion.h2>
        <div className=" w-4/6 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              title={benefit.title}
              description={benefit.description}
              action={benefit.action}
              svgIcon={benefit.svgIcon}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-col justify-center">
        <motion.h2
          ref={refTestimonies}
          initial="hidden"
          animate={controlsTestimonies}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-semibold tracking-tight text-center mb-12"
        >
          Testimonies
        </motion.h2>
        <div>
          <AnimatedTestimonials testimonials={testimonials}/>
        </div>
      </div>
    </>
  );
};

export default HomePage;
