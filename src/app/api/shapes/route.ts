import { withAuth } from "../../../utils/withAuth";
import { salable } from "../../salable";
import { salableBoardPlanUuid, salableProductUuid, salableUserPlanUuid } from "../../constants";
import { AllowedShapes, getCreditsForShape } from "../../../utils/getCreditsForShape";
import initMiroAPI from "../../../utils/initMiroAPI";
import { NextRequest } from "next/server";
import { State } from "../entitlements/check/route";
import { z } from "zod";
import { randomUUID } from 'node:crypto';

const schema = z.object({
  boardId: z.string(),
  shape: z.enum(["rectangle", "triangle", "circle"]),
});

function getShapeColour(shape: AllowedShapes) {
  switch (shape) {
    case 'rectangle':
      return '#fe9a00';
    case 'triangle':
      return '#53eafd';
    case 'circle':
      return '#ad46ff';
    default:
      throw new Error(`Unsupported shape ${shape}`);
  }
}

async function createShape(boardId: string, shape: AllowedShapes, userId: string) {
  const { miro } = initMiroAPI();
  const api = miro.as(userId);
  const board = await api.getBoard(boardId);
  await board.createShapeItem({
    data: {
      shape,
    },
    style: {
      fillColor: getShapeColour(shape),
    },
    geometry: {
      width: 120,
      height: 120,
    },
  });
}

export const POST = withAuth(async (state: State, request: NextRequest) => {
  try {
    const body = await request.json();
    const parseResult = schema.safeParse(body);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation errors",
          metadata: parseResult.error.flatten(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { boardId, shape } = parseResult.data;

    const check = await salable.entitlements.check({
      productUuid: salableProductUuid,
      granteeIds: [state.user, boardId],
    });

    const features = check?.features;
    const hasUserLicense = features?.find((f) => f.feature === 'shapes_user');
    const hasBoardLicense = features?.find((f) => f.feature === 'shapes_board');
    const hasShapeCapability = features?.find((f) => f.feature === shape);

    if (!hasUserLicense && !hasBoardLicense || !hasShapeCapability) {
      return new Response(JSON.stringify({ error: "Unauthorised" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await salable.usage.updateLicenseUsage({
      granteeId: hasBoardLicense ? boardId : state.user,
      planUuid: hasBoardLicense ? salableBoardPlanUuid : salableUserPlanUuid,
      increment: getCreditsForShape(shape as AllowedShapes),
      idempotencyKey: randomUUID(),
    });

    await createShape(boardId, shape as AllowedShapes, state.user);

    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to create shape" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
