'use client'
import React, {useEffect, useState} from "react";
import {EntitlementCheck} from "@salable/node-sdk/dist/src/types";
import {TriangleIcon} from "./icons/triangle";
import {Circle} from "./icons/circle";
import {BoardInfo} from "@mirohq/websdk-types/stable/api/board";
import LoadingSpinner from "./loading-spinner";
import {getCreditsForShape} from "../utils/getCreditsForShape";
import axios from "axios";

export type AllowedShapes = 'rectangle' | 'triangle' | 'circle';

const shapes: AllowedShapes[] = ['rectangle', 'triangle', 'circle']

export const Shapes = () => {
  const [check, setCheck] = useState<EntitlementCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState<BoardInfo | null>(null)
  useEffect(() => {
    async function fetchData() {
      try {
        const boardInfo = await miro.board.getInfo()
        setBoard(boardInfo)
        const token = await miro.board.getIdToken();
        const response = await axios.get(`/api/entitlements/check`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data) setCheck(response.data)
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
        const hasFeature = check?.features?.some((c) => c.feature === shape)
        const credits = getCreditsForShape(shape)
        return (
          <div className='flex items-center justify-between p-6 mb-3 rounded-md bg-blue-50' key={`shape-${i}`}>
            <div className='mr-6 w-[120px]'>
              <Shape shape={shape} disabled={!hasFeature}  />
            </div>
            <div className='flex flex-col justify-center grow'>
              <div className='flex justify-center'>
                <AddShapeButton boardId={board?.id} shape={shape} hasFeature={!!hasFeature} />
              </div>
              <span className='text-xs text-center'>{credits} credit{credits > 1 ? 's' : null}</span>
            </div>
          </div>
        );
      })}
      {!check?.features?.length ? (
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

const AddShapeButton = ({shape, boardId, hasFeature}: {shape: AllowedShapes; boardId: string; hasFeature: boolean}) => {
  const [isCreatingShape, setIsCreatingShape] = useState<boolean>(false)
  const handleClick = async () => {
    try {
      setIsCreatingShape(true)
      const token = await miro.board.getIdToken();
      const response = await axios.post(`/api/shapes`, {
        boardId, shape
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.error) {
        console.error(response.data.error)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsCreatingShape(false)
    }
  }
  return (
    <button
      className={'py-2 px-4 mb-2 rounded-sm leading-none font-light bg-white border-2 border-solid border-blue-500 text-blue-500 disabled:text-gray-500 disabled:border-gray-500 disabled:opacity-50 cursor-pointer disabled:cursor-auto'}
      disabled={!hasFeature}
      onClick={handleClick}
    >
      {isCreatingShape ? <div className='w-[16px]'><LoadingSpinner fill="#2B7FFF"/></div> : "Add shape"}
    </button>
  )
}