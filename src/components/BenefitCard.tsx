import { FC, useEffect, useRef } from "react";
import { Benefit } from "@/models/benefit";
import { motion, useAnimation, useInView } from "motion/react";

const BenefitCard: FC<Benefit> = ({ title, description, svgIcon, action }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-72 h-80 mx-auto shadow-md mb-8 rounded-xl border-lime-500 border pb-4"
    >
      <div className="w-full h-32 flex justify-center items-center rounded-xl">
        <div className="flex justify-center p-3 rounded-xl bg-lime-200">
          {svgIcon}
        </div>
      </div>
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-2 h-16">{description}</p>
        <div className="mt-2 flex justify-center items-center">
          <label className="mt-4 text-lime-500 font-bold hover:text-lime-700 hover:scale-105 transition-all duration-500 cursor-pointer">
            {action}
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default BenefitCard;
