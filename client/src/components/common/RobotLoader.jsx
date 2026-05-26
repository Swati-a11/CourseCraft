import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const RobotLoader = ({ text = "AI is analyzing your progress..." }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 border-4 border-green-500 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
        <div className="absolute w-32 h-32 border-2 border-green-900 border-l-transparent border-r-transparent rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
        
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="z-10 bg-black p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        >
          <Bot size={40} className="text-green-400" />
        </motion.div>
      </div>
      
      <p className="mt-8 text-green-400 font-bold animate-pulse text-xl tracking-wider">
        {text}
      </p>
    </div>
  );
};

export default RobotLoader;
