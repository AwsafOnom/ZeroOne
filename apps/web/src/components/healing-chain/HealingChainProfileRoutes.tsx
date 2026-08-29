import { useHealingChain } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { HealingChainProfilePage } from "./HealingChainProfilePage";

export function HealingChainMentorPage() {
  const { token } = useAuth();
  const chain = useHealingChain({ token });
  return (
    <HealingChainProfilePage
      connection={chain.isLoading ? undefined : (chain.data?.mentor ?? null)}
      role="mentor"
    />
  );
}

export function HealingChainMenteePage() {
  const { token } = useAuth();
  const chain = useHealingChain({ token });
  return (
    <HealingChainProfilePage
      connection={chain.isLoading ? undefined : (chain.data?.mentee ?? null)}
      role="mentee"
    />
  );
}
