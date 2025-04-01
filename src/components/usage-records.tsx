'use client'
import {useEffect, useState} from "react";
import {PaginatedUsageRecords} from "@salable/node-sdk/dist/src/types";
import {FetchError} from "./fetch-error";
import {format} from "date-fns";
import {getUsageRecords} from "../actions/usage";

export const UsageRecords = ({subscriptionUuid, planUuid}: {subscriptionUuid: string; planUuid: string}) => {
  const [records, setRecords] = useState<PaginatedUsageRecords | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const board = await miro.board.getInfo()
        const data = await getUsageRecords({
          subscriptionUuid,
          planUuid,
          boardId: board.id,
        })
        if (data.data) setRecords(data.data)
        if (data.error) setError(data.error)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        setError('Failed to fetch subscription invoices')
      }
    }
    fetchData()
  }, []);
  if (loading) return <Loading />
  if (error) return <FetchError error={error} />
  return (
    <div className='rounded-sm'>
      {records?.data.map((record, index) => (
        <div className='bg-white mb-3 flex justify-between items-center shadow rounded-sm p-3' key={`usage-record-${index}`}>
          <div>
            {record.type === 'current' ? (
              <>From {format(new Date(record.createdAt), "d LLL yyy")}</>
            ) : (
              <>{format(new Date(record.createdAt), "d LLL yyy")} - {format(new Date(record.recordedAt), "d LLL yyy")}</>
            )}
          </div>
          <div className='flex items-center'>
            {record.type !== 'recorded' ? (
              <span
                className='mr-2 p-1 leading-none uppercase rounded-sm bg-green-100 text-green-700 text-xs font-bold'>{record.type}</span>
            ) : null}
            <span>{record.unitCount} credit{record.unitCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export const Loading = () => {
  return (
    <div>
      {[...new Array(2)].map((_, index) => (
        <div className="shadow bg-white mb-3 flex justify-between items-center rounded-sm p-3" key={`loading-${index}`}>
          <div className="animate-pulse flex justify-between w-full">
            <div className='flex'>
              <div className="mr-2 h-2 bg-slate-300 rounded w-[100px]"></div>
            </div>
            <div className='flex'>
              <div className="mr-2 h-2 bg-slate-300 rounded w-[20px]"></div>
              <div className="h-2 bg-slate-300 rounded w-[50px]"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}