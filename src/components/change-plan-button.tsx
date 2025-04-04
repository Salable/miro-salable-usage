'use client'
import React, {useState} from "react";
import {changeSubscription} from "../actions/subscriptions";
import LoadingSpinner from "./loading-spinner";

export const ChangePlanButton = ({subscriptionUuid, planUuid, planName}: {subscriptionUuid: string; planUuid: string, planName: string}) => {
  const [isChangingSubscription, setIsChangingSubscription] = useState(false);

  const handleClick  = async () => {
    setIsChangingSubscription(true)
    const change = await changeSubscription(subscriptionUuid, planUuid)
    if (change?.error) console.error(change?.error)
    setIsChangingSubscription(false)
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