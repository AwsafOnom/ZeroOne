import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAssistant } from "../context/AssistantContext";
import { useAuth } from "../context/AuthContext";
import { disconnectRecoverySocket } from "../lib/socket";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { signOut } = useAuth();
  const { clearMessages, closeAssistant } = useAssistant();

  return useCallback(async () => {
    disconnectRecoverySocket();
    queryClient.clear();
    clearMessages();
    closeAssistant();
    await signOut();
    navigate("/auth/login", { replace: true });
  }, [clearMessages, closeAssistant, navigate, queryClient, signOut]);
}
