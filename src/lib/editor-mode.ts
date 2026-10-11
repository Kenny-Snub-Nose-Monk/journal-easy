// Collaboration is an explicit opt-in, configured at build time.
export const collaborationEnabled = Boolean(process.env.NEXT_PUBLIC_COLLABORATE_EDIT_URL)
