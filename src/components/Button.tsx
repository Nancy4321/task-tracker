
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    buttonType?: "button" | "submit" | "reset";
    className?: string;
    [key: string]: any; // eslint-disable-line
}

export default function Button({ children, onClick, buttonType = "button", className, ...props }: ButtonProps) {
  return (
    <button
    type={buttonType}
    className={className}
    onClick={onClick}
    {...props}
    >
    {children}
    </button>
  );
}
