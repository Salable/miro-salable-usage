import { withAuth } from "../../../../../utils/withAuth";
import { salable } from "../../../../salable";
import { NextRequest } from "next/server";
import { State } from "../../../entitlements/check/route";

export const GET = withAuth(async (_state: State, _request: NextRequest, context) => {
  try {
    const { uuid } = await context.params;

    const data = await salable.subscriptions.getInvoices(uuid);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch invoices" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
