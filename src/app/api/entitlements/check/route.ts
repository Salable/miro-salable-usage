import { withAuth } from "../../../../utils/withAuth";
import { salable } from "../../../salable";
import { salableProductUuid } from "../../../constants";

export type State = {
  sub: string;
  iss: string;
  team: string;
  exp: number;
  user: string;
  iat: number;
};

export const GET = withAuth(async (state) => {
  try {
    const check = await salable.entitlements.check({
      granteeIds: [state.user],
      productUuid: salableProductUuid,
    });

    return new Response(JSON.stringify(check), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ error: "Failed to check entitlements" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

