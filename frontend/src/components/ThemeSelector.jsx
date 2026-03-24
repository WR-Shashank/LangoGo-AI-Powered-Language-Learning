import React from 'react'
import { THEMES } from '../constant/index.js'
import { Palette } from 'lucide-react'
import {  useDataTheme } from '../hooks/useDataTheme.jsx'

function ThemeSelector({display/*,changeTheme,theme*/}) {

    const {theme,setTheme} = useDataTheme()

    const changeTheme =(newTheme)=>{
        setTheme(newTheme)
    }


  return (
    <div  className={` ${display ? "hidden" : "block"} absolute rounded-lg w-52 p-4 top-14 right-14 bg-base-300 h-56 overflow-auto`}>
        {THEMES?.map((themee,idx)=>{
            return <button onClick={()=>changeTheme(themee.name)} key={idx} className={`flex items-center w-full m-.5 rounded-full p-1 gap-2 ${themee.name==theme? "bg-base-100 border-2 border-primary" : "bg-base-300"}`}>
                
                <div className='size-5 items-center flex'><Palette className='size-4 text-primary'/></div>
                <h1 className='text-sm'>{themee.label}</h1>
                <div  className='flex gap-1 w-full justify-end'>

                {themee.colors.map((color,idx)=>{
                   
                   return <div  key={idx} style={{ backgroundColor: color }} className={`size-2 text-transparent rounded-full`}>.</div>
                })}
                </div>
            </button>


        })}
      
    </div>
  )
}

export default ThemeSelector
