import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2 } from "lucide-react";

const glassStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.8)", // Increased transparency
  backgroundImage:
    "linear-gradient(315deg, rgba(0, 0, 0, 0.8) 0%, rgba(111, 60, 40, 0.5) 74%)", // Increased transparency
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(144, 144, 144, 0.49)",
};

const SuccessDialog = ({ message, open, onClose }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          style={glassStyle}
          className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl"
        >
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="text-green-200 w-16 h-16" />
            <Dialog.Title className="text-lg font-semibold mt-4 text-[#f2f2f2]">
              Success
            </Dialog.Title>
            <Dialog.Description className="text-[#f2f2f2] mt-2">
              {message}
            </Dialog.Description>
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition"
              >
                OK
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SuccessDialog;
