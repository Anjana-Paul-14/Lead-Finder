
"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/registry/new-york-v4/ui/dropdown-menu'

export  function Profile() {
  const router = useRouter()

const onSettings = () =>{
  console.log("Settings Clicked")
}

const handleLogout = () =>{
  console.log('logout')
      // localStorage.removeItem("token")
      // sessionStorage.clear()

      router.push('/')

}

  return (
<DropdownMenu>
  <DropdownMenuTrigger asChild>

    <Avatar className='w-10 h-10 cursor-pointer'>
        <AvatarImage src='https://github.com/shadcn.png' className='rounded-full'/>
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-40">
         <DropdownMenuItem onClick={onSettings}>
           Settings
         </DropdownMenuItem>
         <DropdownMenuItem onClick={handleLogout}>
           Logout
         </DropdownMenuItem>
       </DropdownMenuContent>
</DropdownMenu>
  )
}

