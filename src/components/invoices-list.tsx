'use client'
import {useEffect, useState} from "react";
import {PaginatedSubscriptionInvoice} from "@salable/node-sdk/dist/src/types";
import {FetchError} from "./fetch-error";
import {format} from "date-fns";
import Link from "next/link";
import axios from "axios";

export const InvoicesList = ({uuid}: {uuid: string}) => {
  const [invoices, setInvoices] = useState<PaginatedSubscriptionInvoice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const token = await miro.board.getIdToken();
        const response = await axios.get(`/api/subscriptions/${uuid}/invoices`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data?.error) {
          setError(response.data.error)
        } else if (response.data) {
          setInvoices(response.data)
        }
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
    <div>
      {invoices ? (
        <div className='rounded-sm'>
          {invoices?.data.sort((a, b) => a.created + b.created).map((invoice) => {
            return (
              <div className='bg-white mb-3 flex justify-between items-center shadow rounded-sm p-3' key={`invoice-${invoice.id}`}>
                <div>
                  {invoice.effective_at ? (
                    <span>{format(new Date(invoice.effective_at * 1000), "d LLL yyy")}</span>
                  ) : null}
                  {invoice.automatically_finalizes_at ? (
                    <span>Finalises at {format(new Date(invoice.automatically_finalizes_at * 1000), 'd LLL yyy H:mm')}</span>
                  ) : null}
                </div>
                <div className='flex items-center'>
                  <span className='mr-2'>£{(invoice.lines.data[0].quantity * invoice.lines.data[0].price.unit_amount) / 100}</span>
                  {invoice.automatically_finalizes_at && invoice.lines.data[0].price.unit_amount ? (
                    <span className='p-1 leading-none uppercase rounded-sm bg-gray-200 text-gray-500 text-xs font-bold'>DRAFT</span>
                  ) : null}
                  {invoice.hosted_invoice_url ? (
                    <Link className='text-blue-700 hover:underline' href={invoice.hosted_invoice_url} target='_blank'>View</Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ): null}
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