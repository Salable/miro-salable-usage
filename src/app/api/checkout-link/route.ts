import { withAuth } from "../../../utils/withAuth";
import { salable } from "../../salable";
import { z } from "zod";
import { State } from '../entitlements/check/route';

const schema = z.object({
  planUuid: z.string(),
  granteeId: z.string(),
  boardId: z.string(),
  email: z.string().optional(),
});

export const POST = withAuth(async (state: State, request) => {
  try {
    const { team } = state;
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

    const { planUuid, granteeId, boardId, email } = parseResult.data;
    const successUrl = `https://miro.com/app/board/${boardId}`;
    const cancelUrl = `https://miro.com/app/board/${boardId}`;

    const checkout = await salable.plans.getCheckoutLink(planUuid, {
      granteeId,
      owner: team,
      successUrl,
      cancelUrl,
      ...(email && { customerEmail: email }),
    });

    return new Response(JSON.stringify(checkout), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(
        JSON.stringify({ error: "Failed to create checkout link" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
  }
});
