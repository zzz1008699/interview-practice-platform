import { defineStore } from 'pinia'

interface UserInfo {
  name: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as UserInfo | null
  }),
  actions: {
    login(username: string) {
      this.token = 'admin-token'
      localStorage.setItem('token', this.token)
      this.userInfo = { name: username }
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})