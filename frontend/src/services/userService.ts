import api from './api'
import { AuthUser } from './authService'

export type UserDetail = AuthUser & {
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type PagedUsers = {
  page: number
  pageSize: number
  totalCount: number
  items: UserDetail[]
}

export const fetchUsers = async (page: number, pageSize: number, search: string) => {
  const { data } = await api.get<PagedUsers>('/users', { params: { page, pageSize, search } })
  return data
}

export const fetchUser = async (id: string) => {
  const { data } = await api.get<UserDetail>(`/users/${id}`)
  return data
}

export const updateProfile = async (id: string, payload: { name?: string; email?: string }) => {
  const { data } = await api.patch<UserDetail>(`/users/${id}`, payload)
  return data
}

export const createUser = async (payload: { name: string; email: string; password: string; role: string }) => {
  const { data } = await api.post<UserDetail>('/users', payload)
  return data
}

export const updateUserStatus = async (id: string, isActive: boolean) => {
  const { data } = await api.patch<UserDetail>(`/users/${id}/status`, { isActive })
  return data
}

export const updateUserRole = async (id: string, role: string) => {
  const { data } = await api.patch<UserDetail>(`/users/${id}`, { role })
  return data
}

export const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`)
}
