import { getPayload } from 'payload'
import config from '@payload-config'

export const getPayloadClient = async () => {
  const payload = await getPayload({ config })
  return payload
}
