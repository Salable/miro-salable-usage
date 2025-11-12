import { withAuth } from "../../../../utils/withAuth";
import { salable } from "../../../salable";
import { SalableResponseError } from "@salable/node-sdk";
import { Plan, Subscription } from '@salable/node-sdk/dist/src/types';

export type SubscriptionExpandedPlan = Subscription & {
  plan: Plan;
};

export const GET = withAuth(async (_state, _request, context) => {
  try {
    const params = await context.params;
    const id = params.uuid;

    const data = await salable.subscriptions.getOne(id, { expand: ["plan"] }) as SubscriptionExpandedPlan;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    if (e instanceof SalableResponseError && (e).code === "S1002") {
      return new Response(JSON.stringify(null), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log(e);
    return new Response(JSON.stringify({ error: "Failed to fetch subscription" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
