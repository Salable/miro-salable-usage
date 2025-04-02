'use server'
import {salable} from "../../../app/salable";
import {salableBoardPlanUuid, salableProductUuid, salableUserPlanUuid} from "../../../app/constants";
import {AllowedShapes, createShape} from "../../shapes";
import {getCreditsForShape} from "../../../utils/getCreditsForShape";
import {randomUUID} from "node:crypto";

export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: string };

type CreateShapeArgs  = {
  userId: string;
  boardId: string;
  shape: AllowedShapes;
}

export async function updateUsageAndCreateShape({userId, boardId, shape}: CreateShapeArgs): Promise<Result<null>> {
  try {
    const check = await salable.licenses.check({
      productUuid: salableProductUuid,
      granteeIds: [userId, boardId],
    })
    const capabilities = check?.capabilities
    const hasUserLicense = capabilities?.find((c) => c.capability === 'shapes_user')
    const hasBoardLicense = capabilities?.find((c) => c.capability === 'shapes_board')
    const hasShapeCapability = capabilities?.find((c) => c.capability === shape)
    if (!hasUserLicense && !hasBoardLicense || !hasShapeCapability) {
      return {
        data: null,
        error: 'Unauthorised'
      }
    }
    await salable.usage.updateLicenseUsage({
      granteeId: hasBoardLicense ? boardId : userId,
      planUuid: hasBoardLicense ? salableBoardPlanUuid : salableUserPlanUuid,
      increment: getCreditsForShape(shape),
      idempotencyKey: randomUUID()
    })
    await createShape(boardId, shape)
    return {
      data: null,
      error: null
    }
  } catch (e) {
    console.log(e)
    return {
      data: null,
      error: "Failed to create shape"
    }
  }
}