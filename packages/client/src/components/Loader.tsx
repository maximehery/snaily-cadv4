interface Props {
  className?: string;
}

export const Loader = ({ className = "" }: Props) => {
  return (
    <div
      style={{ borderTopColor: "transparent" }}
      className={`w-5 h-5 border-2  border-gray-400  border-solid rounded-full animate-spin ${className}`}
    />
  );
};
