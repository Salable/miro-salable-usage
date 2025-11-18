import { withAuth } from "../../../../../utils/withAuth";
import { salable } from "../../../../salable";
import { NextRequest } from "next/server";
import { State } from "../../../entitlements/check/route";

export const DELETE = withAuth(async (_state: State, _request: NextRequest, context) => {
  try {
    const { uuid } = await context.params;

    await salable.subscriptions.cancel(uuid, { when: "now" });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to cancel subscription" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
