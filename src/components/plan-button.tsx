'use client'
import React, {useState} from "react";
import LoadingSpinner from "./loading-spinner";
import {UserInfoWithEmail} from "@mirohq/websdk-types/stable/api/board";
import {salableBoardPlanUuid} from "../app/constants";
import axios from "axios";

export const PlanButton = ({
  planUuid
}: {
  planUuid: string,
}) => {
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    let url = null
    setError(null)
    try {
      setIsFetchingUrl(true)
      const token = await miro.board.getIdToken();
      const board = await miro.board.getInfo()
      const user = await miro.board.getUserInfo() as UserInfoWithEmail
      const resp = await axios.post(
        '/api/checkout-link',
        {
          planUuid,
          granteeId: planUuid === salableBoardPlanUuid ? board.id : user.id,
          boardId: board.id,
          email: user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      url = resp.data.checkoutUrl
      setIsFetchingUrl(false)
      window.open(url, '_blank')
    } catch (e) {
      setIsFetchingUrl(false)
      console.log(e)
    } 
    if (!url) {
      console.error('Failed to create checkout link')
    }
  }

  return (
    <div>
      <button
        className={`p-4 rounded-md leading-none font-light text-sm transition flex items-center justify-center w-full border-solid border-2 border-blue-700 bg-blue-700 hover:bg-blue-900 text-white cursor-pointer`}
        onClick={handleClick}
      >
        {isFetchingUrl ? <div className='w-[14px] mr-2'><LoadingSpinner fill="white"/></div> : null}
        Purchase plan
      </button>
      {error ? (<div className='mt-1 text-red-600'>{error}</div>) : null}
    </div>
  )
}