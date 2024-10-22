const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
  }) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input
          value={username}
          onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          />
        </div>
        <p></p>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm