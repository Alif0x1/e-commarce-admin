"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import { UseOrigin } from './../../hooks/use-origin';
import ApiAlert from './../api-alert';

interface ApiListProps {
    entityName: string,
    entityIDName: string
}

const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIDName
}) => {

    const params = useParams()
    const origin = UseOrigin()

    const baseUrl = `${origin}/api/${params.storeId}`


  return (
    <>
    <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}`} />
    <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}/{${entityIDName}}`} />
    <ApiAlert title='POST' variant='admin' description={`${baseUrl}`} />
    <ApiAlert title='PATCH' variant='admin' description={`${baseUrl}/${entityName}/{${entityIDName}}`} />
    <ApiAlert title='DELETE' variant='admin' description={`${baseUrl}/${entityName}/{${entityIDName}}`} />
    </>
  )
}

export default ApiList
