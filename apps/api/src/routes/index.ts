import { Router } from "express";
import { accountRouter } from "./account.js";
import { activitiesRouter } from "./activities.js";
import { communityRouter } from "./community.js";
import { dashboardRouter } from "./dashboard.js";
import { healingChainRouter } from "./healingChain.js";
import { impactRouter } from "./impact.js";
import { journalRouter } from "./journal.js";
import { assistantRouter } from "./assistant.js";
import { notificationsRouter } from "./notifications.js";
import { squadRouter } from "./squad.js";

export const apiRouter = Router();

apiRouter.use(accountRouter);
apiRouter.use(dashboardRouter);
apiRouter.use(squadRouter);
apiRouter.use(activitiesRouter);
apiRouter.use(impactRouter);
apiRouter.use(healingChainRouter);
apiRouter.use(journalRouter);
apiRouter.use(assistantRouter);
apiRouter.use(notificationsRouter);
apiRouter.use(communityRouter);
