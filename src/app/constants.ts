if(!process.env.NEXT_PUBLIC_SALABLE_USER_PLAN_UUID) throw new Error('Missing env SALABLE_USER_PLAN_UUID')
if(!process.env.NEXT_PUBLIC_SALABLE_PRODUCT_UUID) throw new Error('Missing env SALABLE_PRODUCT_UUID')
if(!process.env.NEXT_PUBLIC_SALABLE_BOARD_PLAN_UUID) throw new Error('Missing env NEXT_PUBLIC_BOARD_BASE_URL')

export const salableUserPlanUuid = process.env.NEXT_PUBLIC_SALABLE_USER_PLAN_UUID
export const salableProductUuid = process.env.NEXT_PUBLIC_SALABLE_PRODUCT_UUID
export const salableBoardPlanUuid = process.env.NEXT_PUBLIC_SALABLE_BOARD_PLAN_UUID
