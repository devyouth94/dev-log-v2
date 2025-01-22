import Icon from "src/components/shared/icon";

const LoadingPage = () => {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-white">
      <Icon name="Loader" className="animate-spin" size={20} />
    </div>
  );
};

export default LoadingPage;
