import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const useLogin = (showMessage, setUser, setUsername, setPassword) => {
  const [errorLogin] = useState('Wrong username or password!')

  const handleLogin = async (event, username, password) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      showMessage(errorLogin, 'error')
      setUser(user)

      const messageLogin = `Logged in user ${user.name}`
      showMessage(messageLogin, 'success')

      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage(errorLogin, 'error')
    }
  }

  return { handleLogin }
}

export default useLogin