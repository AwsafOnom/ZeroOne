import { getPrisma } from "../db.js";
import { simulateSquadMemberActivity } from "../services/activityCompletion.js";

const SEEDED_SQUAD_IDS = ["squad-green-harmony", "squad-blue-horizon", "squad-quiet-current"] as const;

function randomDelayMs(): number {
  const min = 20_000;
  const max = 40_000;
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function startAmbientSquadActivity() {
  const enabled = process.env.AMBIENT_SQUAD_ACTIVITY === "true";
  if (!enabled) {
    console.log("Ambient squad activity simulation is disabled.");
    return;
  }

  console.log("Ambient squad activity simulation is enabled for seeded squads.");

  async function tick() {
    try {
      const prisma = getPrisma();
      const squads = await prisma.squad.findMany({
        where: { id: { in: [...SEEDED_SQUAD_IDS] } },
        select: { id: true },
      });

      if (squads.length > 0) {
        const squad = squads[Math.floor(Math.random() * squads.length)];
        await simulateSquadMemberActivity(squad.id);
      }
    } catch (error) {
      console.error("Ambient squad activity simulation failed:", error);
    } finally {
      setTimeout(() => void tick(), randomDelayMs());
    }
  }

  setTimeout(() => void tick(), randomDelayMs());
}
