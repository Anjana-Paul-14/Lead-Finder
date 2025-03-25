import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar'

export  function Profile() {
  return (
    <Avatar className=''>
        <AvatarImage src='https://github.com/shadcn.png' className='rounded-full'/>
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
