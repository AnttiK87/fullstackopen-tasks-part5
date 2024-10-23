import { useState } from 'react'

const useShowMessage = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  const showMessage = (message, type) => {
    setErrorMessage(message)
    setMessageType(type)

    // If message type is error display time is longer
    const displayTime = type === 'error' ? 10000 : 5000 // error message 10 s, other 5 s

    setTimeout(() => {
      setErrorMessage(null)
    }, displayTime)
  }

  return { errorMessage, messageType, showMessage }
}

export default useShowMessage