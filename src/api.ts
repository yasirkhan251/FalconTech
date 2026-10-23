const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '')
export const endpoints = { services:'/services/', faqs:'/faqs/', contact:'/contact/', quotes:'/quote-requests/' }
export class ApiError extends Error { constructor(message: string, public status?: number, public details?: unknown) { super(message); this.name = 'ApiError' } }
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new ApiError('The API is not configured yet. Please contact the site administrator.')
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...options, signal: options.signal ?? controller.signal, headers: { Accept:'application/json', ...(options.body ? {'Content-Type':'application/json'} : {}), ...options.headers } })
    const body = response.status === 204 ? null : await response.json().catch(() => null)
    if (!response.ok) throw new ApiError(typeof body?.detail === 'string' ? body.detail : 'Your request could not be completed. Please review the details and try again.', response.status, body)
    return body as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError('The request timed out. Please try again.')
    throw new ApiError('Unable to connect to the server. Your details have not been submitted.')
  } finally { window.clearTimeout(timeout) }
}
export type ContactPayload = {name:string; company_name:string; email:string; phone:string; message:string}
export type QuotePayload = {name:string; company_name:string; email:string; phone:string; service:string; project_type:string; project_location:string; estimated_budget:string; requirements:string; preferred_contact_method:string; consent:boolean}
export async function submitContactInquiry(payload: ContactPayload) { return apiRequest<{id?:string|number;message?:string}>(endpoints.contact,{method:'POST',body:JSON.stringify(payload)}) }
export async function submitQuoteRequest(payload: QuotePayload) { return apiRequest<{id?:string|number;message?:string}>(endpoints.quotes,{method:'POST',body:JSON.stringify(payload)}) }
export async function getServices<T>() { return apiRequest<T>(endpoints.services) }
export async function getServiceBySlug<T>(slug:string) { return apiRequest<T>(`${endpoints.services}${encodeURIComponent(slug)}/`) }
export async function getFAQs<T>() { return apiRequest<T>(endpoints.faqs) }
