import { withAuth } from '../../../../utils/withAuth';
import { salable } from '../../../salable';
import { State } from '../../entitlements/check/route';

export const GET = withAuth(async (state: State, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const planUuid = searchParams.get('planUuid');

    if (!planUuid) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const currentUsage = await salable.usage.getCurrentUsageRecord({
      granteeId: state.user,
      planUuid,
    });

    return new Response(JSON.stringify(currentUsage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch current usage record' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
