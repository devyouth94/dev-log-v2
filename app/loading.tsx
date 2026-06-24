import { Loader } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-white">
      <Loader className="animate-spin" size={20} strokeWidth={1} />
    </div>
  );
};

export default LoadingPage;
