import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar'

export  function Profile() {
  return (
    <Avatar className=''>
        <AvatarImage src='https://github.com/shadcn.png' className='rounded-full'/>
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}



// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/registry/new-york-v4/ui/dropdown-menu';

// export function Profile() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Avatar className="w-12 h-12 cursor-pointer">
//           <AvatarImage src="https://github.com/shadcn.png" className="rounded-full" />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-40">
//         <DropdownMenuItem onClick={() => console.log("Settings Clicked")}>
//           Settings
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => console.log("Logout Clicked")}>
//           Logout
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
