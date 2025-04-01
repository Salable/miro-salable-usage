'use client'
import {CancelPlanButton} from "./cancel-plan-button";
import {FetchError} from "./fetch-error";
import React, {useEffect, useState} from "react";
import {getOneSubscription, SubscriptionExpandedPlanCurrency} from "../actions/subscriptions";
import {notFound} from "next/navigation";
import Link from "next/link";
import {getCurrentUsage} from "../actions/usage";
import {format} from "date-fns";
import {CurrentUsageRecord} from "@salable/node-sdk/dist/src/types";
import {UsageRecords} from "./usage-records";

export const SubscriptionView = ({uuid}: {uuid: string}) => {
  const [loading, setLoading] = useState(true)
  const [boardId, setBoardId] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionExpandedPlanCurrency | null>(null)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  useEffect(() => {
    async function fetchData() {
      try {
        const boardInfo = await miro.board.getInfo()
        setBoardId(boardInfo.id)
        const data = await getOneSubscription(uuid, boardInfo.id)
        if (data.data) setSubscription(data.data)
        if (data.error) setSubscriptionError(data.error)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        console.log(e)
      }
    }
    fetchData()
  }, []);
  if (loading) return <Loading />
  if (subscriptionError) return <FetchError error={subscriptionError}/>
  if (!subscription) return notFound()
  return (
    <>
      <Link href='/dashboard/subscriptions' className='text-sm text-blue-700 hover:underline'>Back to subscriptions</Link>
      <h1 className='text-3xl mb-6 flex items-center'>
        Subscription
        <span className={`px-2 ml-2 py-2 rounded-md leading-none ${subscription.status === 'CANCELED' ? 'bg-red-200 text-red-500' : 'bg-green-200 text-green-700'} uppercase text-lg font-bold`}>
          {subscription.status}
        </span>
      </h1>
      <div className='mb-3'>
        <div className='flex justify-between items-end mb-3'>
          <div>
            <div className='text-gray-500'>Plan</div>
            <div className='text-xl'>{subscription.plan.displayName}</div>
          </div>
        </div>
      </div>
      {subscription.status !== 'CANCELED' && boardId ? (
        <>
          <div className='mb-3'>
            <CurrentUsage planUuid={subscription.plan.uuid} />
          </div>
          <CancelPlanButton subscriptionUuid={uuid}/>
        </>
      ) : null}
      <div className='mt-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Usage Records</h2>
        <div className='mt-3'>
          <UsageRecords subscriptionUuid={uuid} planUuid={subscription.planUuid} />
        </div>
      </div>
    </>
  )
}

const CurrentUsage = ({planUuid}: {planUuid: string}) => {
  const [loading, setLoading] = useState(true)
  const [currentUsage, setCurrentUsage] = useState<CurrentUsageRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    async function fetchData() {
      try {
        const boardInfo = await miro.board.getInfo()
        const data = await getCurrentUsage(planUuid, boardInfo.id);
        if (data.data) setCurrentUsage(data.data)
        if (data.error) setError(data.error)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        console.log(e)
      }
    }
    fetchData()
  }, []);
  if (loading) return <CurrentUsageLoading />
  if (error) return <FetchError error={error}/>
  if (!currentUsage) {
    return (
      <FetchError error={'Current usage not found'}/>
    )
  }
  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-900'>
        <span className='mr-1'>{currentUsage.unitCount}</span>
        <span className='text-xs text-gray-500 font-normal'>credit{currentUsage.unitCount !== 1 ? 's' : ''} used</span>
      </h2>
      {currentUsage.updatedAt ? (
        <div className='text-gray-500'>Last updated at {format(new Date(currentUsage.updatedAt), 'd LLL yyy H:mm')}</div>
      ) : null}
    </div>
  )
}

const Loading = () => {
  return (
    <div>
      <Link href='/dashboard/subscriptions' className='text-sm text-blue-700 hover:underline'>Back to subscriptions</Link>
      <div>
        <div className="flex items-center mb-6">
          <h1 className='text-3xl flex items-center'>
            Subscription
            <div className="ml-2 h-[34px] w-[95px] bg-slate-300 rounded-md animate-pulse"></div>
          </h1>
        </div>
        <CurrentUsageLoading />
        <div className='mb-3'>
          <div className='flex justify-between items-end'>
            <div>
              <div className='text-gray-500'>Plan</div>
              <div className="mr-2 h-[28px] bg-slate-300 rounded w-[100px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CurrentUsageLoading = () => {
  return (
    <div>
      <div className='flex items-end mb-1'>
        <span className='h-[29px] w-[20px] bg-slate-300 animate-pulse rounded-md mr-1' />
        <span className='text-xs text-gray-500 font-normal'>credits used</span>
      </div>
      <div className='text-gray-500 flex items-center'>
        Last updated at
        <span className='h-[20px] w-[115px] bg-slate-300 animate-pulse rounded-md ml-1'/>
      </div>
    </div>
  )
}