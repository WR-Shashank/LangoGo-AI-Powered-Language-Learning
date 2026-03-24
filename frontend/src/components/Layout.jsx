import Navbar from "./Navbar.jsx"
import  Sidebar from "./Sidebar.jsx"

function Layout({showSidebar=false,children/*,changeTheme,theme*/}) {
  return (
    <div className='h-screen flex ' >
      {showSidebar && <Sidebar/>}
      <div className='flex-col w-full '>
        
        <Navbar /*changeTheme={(newTheme)=>changeTheme(newTheme)} theme={theme}*/ />
        <div className="main">
            {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
