import {NavLink, NavBar} from "../../../components/nav-bar";
import React from "react";
import {PricingTable} from "../../../components/pricing-table";

export const metadata = {
  title: 'Pricing',
}

const modalLinks: NavLink[] = [
  {
    label: 'Plans',
    url: '/dashboard/pricing',
  },
  {
    label: 'Subscriptions',
    url: '/dashboard/subscriptions',
  },

]

export default async function Pricing() {
  return (
    <div>
      <NavBar links={modalLinks} currentLink='/dashboard/pricing' />
      <div className='bg-gray-100 p-6'>
        <PricingTable />
      </div>
    </div>
  )
}