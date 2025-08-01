import { useTheme } from "next-themes";
import { ReactNode } from "react";
import { Toaster as Sonner, toast } from "sonner";
import {
  CircleX,
  CircleCheck,
  LoaderCircle,
  MessageCircleWarningIcon,
} from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group px-0 py-0 bg-transparent"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg text-white",
          description: "group-[.toast]:text-muted-foreground text-white ",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

type ToastProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  closeButton?: boolean;
  type: "success" | "error" | "warning" | "info";
};

type ToastType = ToastProps["type"]; // Extracting type from ToastProps

type TypeClass = {
  bgColor: string;
  borderColor: string;
};

// Define typeClasses with ToastType as the keys
const typeClasses: Record<ToastType, TypeClass> = {
  success: {
    bgColor: "!bg-white !text-green-400  dark:!bg-black/90",
    borderColor: "!border-l-4 !border-green-500",
  },
  error: {
    bgColor: "!bg-white !text-red-500 dark:!bg-black/90",
    borderColor: "!border-l-4 !border-red-500",
  },
  warning: {
    bgColor: "!bg-white !text-yellow-500 dark:!bg-black/90",
    borderColor: "!border-l-4 !border-yellow-500",
  },
  info: {
    bgColor: "!bg-white !text-blue-500 dark:!bg-black/90",
    borderColor: "!border-l-4 !border-blue-700",
  },
};

const CustomToaster = ({
  closeButton,
  description,
  icon,
  title,
  type, // Include `type` in the destructuring
}: ToastProps) => {
  const classes = typeClasses[type]; // Ensure correct type inference here

  function getIcon() {
    switch (type) {
      case "success":
        return <CircleCheck />;
      case "error":
        return <CircleX />;
      case "info":
        return <LoaderCircle className="animate-spin" />;
      case "warning":
        return <MessageCircleWarningIcon />;
      default:
        break;
    }
  }

  return toast(typeof title === "string" ? title : "Something bad happened!", {
    position: "bottom-right",
    description: description,
    closeButton: closeButton,
    icon: icon ? icon : getIcon(),
    classNames: {
      success: "",
      closeButton: `!bg-transparent !right-0 left-auto top-3 border-0 p-0`,
      title: `text-base font-bold font-sans !text-red`,
      toast: `${classes.bgColor}  ${classes.borderColor} bottom-8 !border-l-4 right-8 px-4 py-4 !rounded  !border-0 !flex !gap-5 !items-start  !font-sans `,
      icon: "pt-2",
      description: `text-base font-normal max-w-96 !text-green-400 pr-2 pt-2 font-sans`,
    },
  });
};

export { Toaster, CustomToaster };
