import Icon from "~/components/shared/icon";

const Fallback = () => {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <Icon name="Loader" className="animate-spin" size={20} />
    </div>
  );
};

export default Fallback;
