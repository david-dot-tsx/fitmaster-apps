import { Pressable, type PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <Pressable {...props} className="rounded-md border border-slate-600 p-4 font-bold">
      {children}
    </Pressable>
  );
};
