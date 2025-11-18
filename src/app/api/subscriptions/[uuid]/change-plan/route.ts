import { withAuth } from "../../../../../utils/withAuth";
import { salable } from "../../../../salable";
import { z } from "zod";

const schema = z.object({
  planUuid: z.string(),
});

export const POST = withAuth(async (_state, request, context) => {
  try {
    const params = await context.params;
    const { uuid } = params;
    const rawBody = await request.json();
    const parseResult = schema.safeParse(rawBody);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation errors",
          metadata: parseResult.error.flatten(),
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const { planUuid } = parseResult.data;
    await salable.subscriptions.changePlan(uuid, {
      planUuid,
      proration: "always_invoice",
    });

    return new Response("", { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ error: "Failed to update subscription" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

