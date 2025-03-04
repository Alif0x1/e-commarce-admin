
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prismadb } from '@/lib/prismadb'
import { SettingsForm } from './components/sattings-form'


interface SettingsPageProps {
  params: { storeId: string }
}

const SettingsPage: React.FC<SettingsPageProps> = async props => {
  const params = await props.params;
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
    return null // Avoid further rendering
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) {
    redirect('/') // Replace with your custom 404 page or error handling
    return null
  }

  return (
    <div className='flex-col '>
      <div>
        <div className='flex-1 space-y-4 p-8 pt-16'>
          <SettingsForm  initialData={store}/>
        </div>
      </div>
      
    </div>
  )
}

export default SettingsPage
