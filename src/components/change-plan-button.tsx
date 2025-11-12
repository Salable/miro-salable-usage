'use client'
import React, {useState} from "react";
import LoadingSpinner from "./loading-spinner";
import axios from "axios";
import { KeyedMutator } from 'swr';
import { SubscriptionExpandedPlanCurrency } from "./subscription-view";

export const ChangePlanButton = ({
  subscriptionUuid,
  planUuid,
  planName,
  mutate,
}: {
  subscriptionUuid: string;
  planUuid: string;
  planName: string;
  mutate: KeyedMutator<SubscriptionExpandedPlanCurrency>;
}) => {
  const [isChangingSubscription, setIsChangingSubscription] = useState(false);

  const handleClick  = async () => {
    try {
      setIsChangingSubscription(true)
      const token = await miro.board.getIdToken();
      await axios.post(`/api/subscriptions/${subscriptionUuid}/change-plan`, {
        planUuid
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await new Promise<void>(async (resolve) => {
        while (true) {
          try {
            const subscription = await axios.get(
              `/api/subscriptions/${subscriptionUuid}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (subscription.data?.planUuid === planUuid) {
              await mutate();
              resolve();
              break;
            }
            await new Promise((r) => setTimeout(r, 500));
          } catch (e) {
            console.log(e);
            break;
          }
        }
      });
    } catch (e) {
      console.error(e)
    } finally {
      setIsChangingSubscription(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      className='p-4 text-white font-light rounded-md leading-none bg-blue-700 hover:bg-blue-900 transition flex items-center justify-center mr-2'
      disabled={isChangingSubscription}
    >
      {isChangingSubscription ? (
        <div className='w-[14px] mr-2'><LoadingSpinner fill="white"/></div>
      ) : ''}
      Move to {planName}
    </button>
  )
}