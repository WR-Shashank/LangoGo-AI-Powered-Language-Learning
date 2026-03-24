import { create } from 'zustand'
// by this we can create a global state and just use where ever we want

export const useDataTheme = create((set) => ({
  theme: localStorage.getItem("data-theme") || "forest",
  setTheme : (newTheme)=>{
    set({theme:newTheme})
    localStorage.setItem("data-theme",newTheme);

  }
}))