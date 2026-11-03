"use client";

import { useEffect, useState } from "react";
import { CenterDialog } from "@/components/center-dialog";

export function PanelAlerts({
  error,
  message,
  onDismissError,
  onDismissMessage,
  errorTitle = "Something went wrong",
  messageTitle = "Success",
}: {
  error?: string | null;
  message?: string | null;
  onDismissError?: () => void;
  onDismissMessage?: () => void;
  errorTitle?: string;
  messageTitle?: string;
}) {
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [messageDismissed, setMessageDismissed] = useState(false);

  useEffect(() => {
    setErrorDismissed(false);
  }, [error]);

  useEffect(() => {
    setMessageDismissed(false);
  }, [message]);

  const showError = Boolean(error) && !errorDismissed;
  const showMessage = Boolean(message) && !messageDismissed && !showError;

  return (
    <>
      <CenterDialog
        open={showError}
        title={errorTitle}
        variant="error"
        onClose={() => {
          setErrorDismissed(true);
          onDismissError?.();
        }}
      >
        {error}
      </CenterDialog>
      <CenterDialog
        open={showMessage}
        title={messageTitle}
        variant="success"
        onClose={() => {
          setMessageDismissed(true);
          onDismissMessage?.();
        }}
      >
        {message}
      </CenterDialog>
    </>
  );
}
