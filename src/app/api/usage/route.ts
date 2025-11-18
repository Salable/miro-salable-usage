import { withAuth } from '../../../utils/withAuth';
import { salable } from '../../salable';
import { State } from '../entitlements/check/route';

export const GET = withAuth(async (state: State, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const planUuid = searchParams.get('planUuid');
    const subscriptionUuid = searchParams.get('subscriptionUuid');

    if (!planUuid || !subscriptionUuid) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const records = await salable.usage.getAllUsageRecords({
      granteeId: state.user,
      planUuid,
      subscriptionUuid,
    });

    return new Response(JSON.stringify(records), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch usage records' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
