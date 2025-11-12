'use server'
import React from 'react';
import '../assets/style.css';
import {Shapes} from "../components/shapes";


export default async function Page() {
  return (
    <div className='p-6 pt-0'>
      <Shapes />
    </div>
  )
}
