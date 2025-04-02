'use client'
import {licenseCheck} from "../actions/licenses/check";
import {AllowedShapes} from "../actions/shapes";
import React, {useEffect, useState} from "react";
import {CheckLicensesCapabilitiesResponse} from "@salable/node-sdk/dist/src/types";
import {TriangleIcon} from "./icons/triangle";
import {Circle} from "./icons/circle";
import {BoardInfo} from "@mirohq/websdk-types/stable/api/board";
import LoadingSpinner from "./loading-spinner";
import {getCreditsForShape} from "../utils/getCreditsForShape";
import {updateUsageAndCreateShape} from "../actions/licenses/usage";

const shapes: AllowedShapes[] = ['rectangle', 'triangle', 'circle']

export const Shapes = ({userId}: {userId: string}) => {
  const [check, setCheck] = useState<CheckLicensesCapabilitiesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState<BoardInfo | null>(null)
  useEffect(() => {
    async function fetchData() {
      try {
        const boardInfo = await miro.board.getInfo()
        setBoard(boardInfo)
        const data = await licenseCheck([userId, boardInfo.id])
        if (data.data) setCheck(data.data)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        console.log(e)
      }
    }
    fetchData()
  }, []);

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }
  if (!board) {
    return (
      <div>No board found</div>
    )
  }
  return (
    <>
      {shapes.map((shape, i) => {
        const hasCapability = check?.capabilities.find((c) => c.capability === shape)
        const credits = getCreditsForShape(shape)
        return (
          <div className='flex items-center justify-between p-6 mb-3 rounded-md bg-blue-50' key={`shape-${i}`}>
            <div className='mr-6 w-[120px]'>
              <Shape shape={shape} disabled={!hasCapability}  />
            </div>
            <div className='flex flex-col justify-center grow'>
              <div className='flex justify-center'>
                <AddShapeButton userId={userId} boardId={board?.id} shape={shape} hasCapability={!!hasCapability} />
              </div>
              <span className='text-xs text-center'>{credits} credit{credits > 1 ? 's' : null}</span>
            </div>
          </div>
        );
      })}
      {!check?.capabilities.length ? (
        <div>
          <p>To start using shapes subscribe to our product and get started!</p>
          <button
            className='p-4 mt-3 rounded-md leading-none font-light transition flex items-center justify-center w-full bg-blue-700 hover:bg-blue-900 text-white cursor-pointer'
            onClick={async () => {
              await miro.board.ui.openModal({url: '/dashboard/pricing'})
            }}
          >
            Pricing
          </button>
        </div>
      ) : null}
    </>
  )
}

const Shape = ({shape, disabled}:{shape: string, disabled: boolean}) => {
  switch (shape) {
    case 'rectangle':
      return (
        <div className={`h-[120px] w-[120px] rounded-lg ${disabled ? 'bg-gray-500 opacity-50' : 'bg-amber-500'}`} />
      )
    case 'circle':
      return (
        <div className={disabled ? 'opacity-50' : ''}>
          <Circle fill={disabled ? 'fill-gray-500' : 'fill-purple-500'} />
        </div>
      )
    case 'triangle':
      return (
        <div className={disabled ? 'opacity-50' : ''}>
          <TriangleIcon fill={disabled ? 'fill-gray-500' : 'fill-cyan-300'} />
        </div>
      )
    default:
      return null
  }
}

const AddShapeButton = ({shape, boardId, userId, hasCapability}: {shape: AllowedShapes; boardId: string; userId: string; hasCapability: boolean}) => {
  const [isCreatingShape, setIsCreatingShape] = useState<boolean>(false)
  const handleClick = async () => {
    try {
      setIsCreatingShape(true)
      await updateUsageAndCreateShape({userId, boardId, shape})
      setIsCreatingShape(false)
    } catch (e) {
      setIsCreatingShape(false)
      console.log(e)
    }
  }
  return (
    <button
      className={'py-2 px-4 mb-2 rounded-sm leading-none font-light bg-white border-2 border-solid border-blue-500 text-blue-500 disabled:text-gray-500 disabled:border-gray-500 disabled:opacity-50 cursor-pointer disabled:cursor-auto'}
      disabled={!hasCapability}
      onClick={handleClick}
    >
      {isCreatingShape ? <div className='w-[16px]'><LoadingSpinner fill="#2B7FFF"/></div> : "Add shape"}
    </button>
  )
}