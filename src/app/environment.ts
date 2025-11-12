if(!process.env.SALABLE_API_KEY) throw new Error('Missing env SALABLE_API_KEY')
if(!process.env.MIRO_CLIENT_SECRET) throw new Error('Missing env MIRO_CLIENT_SECRET')

export const salableApiKey = process.env.SALABLE_API_KEY
export const miroClientSecret = process.env.MIRO_CLIENT_SECRET
