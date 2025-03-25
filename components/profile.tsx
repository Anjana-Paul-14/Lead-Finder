import { Avatar, AvatarImage } from '@/registry/new-york-v4/ui/avatar'

export  function Profile() {
  return (
    <Avatar className='border-4 border-red-500'>
        <AvatarImage src='https://github.com/shadcn.png'/>
    </Avatar>
  )
}
