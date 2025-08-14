import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import ToastError from "./Toast/ToastError";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "#353742",
  border: "2px solid #000",
  borderRadius: "16px",
  boxShadow: 24,
  p: 6,
  minHeight: 450,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

export default function MyModal({ children, btn }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const inputRef = useRef(null);
  const { user } = useUser();
  const toast = useToast();

  // Focus the input after modal opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Delay to ensure DOM is ready
      return () => clearTimeout(timer);
    }
  }, [open]);

  function handleUnVerifiedUser() {
    toast.open(
      <ToastError
        headline="Email isn't verified"
        subHeadline="To avail all features, verify email"
      />
    );
    return;
  }

  // Clone the trigger node and inject onClick
  // Clone the trigger node and inject onClick
  let TriggerBtn;
  if (user.isEmailVerified)
    TriggerBtn = cloneElement(btn, { onClick: handleOpen });
  else TriggerBtn = cloneElement(btn, { onClick: handleUnVerifiedUser });

  // Clone children and pass closeModal function
  const childrenWithClose = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        closeModal: handleClose,
        inputRef: inputRef,
      });
    }
    return child;
  });

  return (
    <div>
      {TriggerBtn}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ outline: 0 }}
      >
        <Box sx={{ ...style, outline: 0 }}>{childrenWithClose}</Box>
      </Modal>
    </div>
  );
}
