import { useState } from 'react'
import LoginForm from './LoginForm'

const LoginFormContainer = ({ handleLogin }) => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const hideWhenVisible = { display: loginVisible ? 'none' : '' }
  const showWhenVisible = { display: loginVisible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setLoginVisible(true)}>Login</button>
      </div>
      <div style={showWhenVisible}>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={(event) => {
            handleLogin(event, username, password)
            setUsername('') // Tyhjennä kenttä
            setPassword('') // Tyhjennä kenttä
          }}
        />
        <button onClick={() => setLoginVisible(false)}>Cancel</button>
      </div>
    </div>
  )
}

export default LoginFormContainer