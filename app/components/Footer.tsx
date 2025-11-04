import React from 'react'
import Next from "@/app/assets/Next.js.png"
import TypeScript from "@/app/assets/typescript.png"
import Tailwind from "@/app/assets/Tailwind CSS.png"
import Image from 'next/image'
import Link from 'next/link'
import { BsLink45Deg } from 'react-icons/bs'
const Footer = () => {
  return (
    <div className='flex justify-between p-5'>
      <div className='flex justify-around gap-5'>
        <h1>Made With</h1>
        <ul className='flex justify-around gap-5'>
            <li><Image src={TypeScript} alt="TypeScript" className='w-8 rounded bg-white p-1' /></li>
            <li><Image src={Next} alt="Next.js" className='w-8 rounded bg-white p-1' /></li>
            <li><Image src={Tailwind} alt="Tailwind CSS" className='w-8 rounded bg-white p-1' /></li>
        </ul>
      </div>
       <div className="mt-5 flex gap-5 justify-center items-center bg-black text-white w-fit p-2 rounded-2xl hover:gap-2 hover:text-purple-500 transition-all">
          <BsLink45Deg />
          <Link href={"https://mrmohammadjr.github.io/portfolio-app/"}>
            Author
          </Link>
        </div>
    </div>
  )
}

export default Footer
