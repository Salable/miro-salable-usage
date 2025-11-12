import { salable } from '../../salable';
import { salableProductUuid } from '../../constants';
import { Plan, Subscription } from '@salable/node-sdk/dist/src/types';
import { withAuth } from '../../../utils/withAuth';
import { State } from '../entitlements/check/route';

export const revalidate = 0;

export type SubscriptionExpandedPlan = Subscription & {
  plan: Plan;
};

export type GetAllSubscriptionsExpandedPlan = {
  first: string;
  last: string;
  data: SubscriptionExpandedPlan[];
};

export const GET = withAuth(async (state: State, request) => {
  try {
    const { team } = state;
    const { searchParams } = new URL(request.url);
    const planUuid = searchParams.get('planUuid');

    const subscriptions = (await salable.subscriptions.getAll({
      owner: team,
      expand: ['plan'],
      sort: 'desc',
      productUuid: salableProductUuid,
      ...(planUuid && { planUuid }),
    })) as GetAllSubscriptionsExpandedPlan;

    return new Response(JSON.stringify(subscriptions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ error: 'Failed to list subscriptions' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
