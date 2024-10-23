const useLogout = (showMessage, setUser) => {
  const handleLogout = async (user) => {
    window.localStorage.clear()
    const messageLogout = 'Logged out succesfully!'

    showMessage(messageLogout, 'success')
    setUser(null)
  }

  return { handleLogout }
}

export default useLogout