'use client'
import React, {useState} from "react";
import LoadingSpinner from "./loading-spinner";
import axios from "axios";
import { KeyedMutator } from 'swr';
import { SubscriptionExpandedPlanCurrency } from "./subscription-view";

export const CancelPlanButton = ({
  subscriptionUuid,
  mutate,
}: {
  subscriptionUuid: string;
  mutate: KeyedMutator<SubscriptionExpandedPlanCurrency>;
}) => {
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);

  const handleClick = async () => {
    try {
      setIsCancellingSubscription(true);
      const token = await miro.board.getIdToken();
      await axios.delete(`/api/subscriptions/${subscriptionUuid}/cancel`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await new Promise<void>(async (resolve) => {
        while (true) {
          try {
            const subscription = await axios.get(
              `/api/subscriptions/${subscriptionUuid}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (subscription.data?.status === 'CANCELED') {
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
      console.log(e);
    } finally {
      setIsCancellingSubscription(false);
    }
  }

  return (
    <button
      className={`p-4 rounded-md leading-none text-white bg-red-600 hover:bg-red-700 flex items-center justify-center transition font-light cursor-pointer`}
      onClick={handleClick}
      disabled={isCancellingSubscription}>
      {isCancellingSubscription ? (
        <div className='w-[14px] mr-2'><LoadingSpinner fill="white"/></div>) : ''}
      Cancel subscription
    </button>
  )
}