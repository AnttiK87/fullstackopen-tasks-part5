import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState("")


  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const errorLogin = `Wrong username or password!`
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    //console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      showMessage(errorLogin, "error")
      setUser(user)
      
      const messageLogin = `Logged in user ${user.name}`
      showMessage(messageLogin, "success")

      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage(errorLogin, "error")
    }
  }

  const handleLogout = async () => {
    window.localStorage.clear()
    const messageLogout = `Logged out user ${user.name}`
    showMessage(messageLogout, "success")
    setUser(null)
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return(
      <>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Login</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </>
    )
  }

  const addBlog = (blogObject) => {
    const messageBlogAdded = `Added a new blog ${blogObject.title} by ${blogObject.author} to the list!`

    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showMessage(messageBlogAdded, "success")
      })
      .catch(error => {
        const errorMessage = error.response && error.response.data.error 
          ? error.response.data.error
          : "Failed to add blog"
        
        showMessage(errorMessage, "error")
      })
  }

  const updateBlog = id => {
    const errorMessage = `Something went wrong!`
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    
    blogService
    .update(id, changedBlog)
    .then(returnedBlog => {
      console.log(returnedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    })
    .catch(error => {
      showMessage(errorMessage, error)
    })
  }

  const deleteBlog = id => {
    const blog = blogs.find(b => b.id === id)
    const messageDeleted = `${blog.title} deleted from the list!`
    const errorMessage = `${blog.title} was already deleted from the list!`

    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          showMessage(messageDeleted, "success")
        })
        .catch(error => {
          if (error.response.status === 404) {
            console.error("Failed to delete blog", error)
            showMessage(errorMessage, "error")
            setBlogs(blogs.filter(blog => blog.id !== id))
          } else {
            //for other errors
            showMessage("An unexpected error occurred", "error")
          }
        })
    }
  }
   
  const blogList = () => (
    <>
      <div>
        <p>{user.name} is logged in. <button onClick={handleLogout} type="submit">Logout</button></p>
        
        <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>
      </div>
      <h3>Blog list</h3>
      <ul>
        {blogs.sort((a, b) => b.likes - a.likes).map((blog, i) => 
          <Blog
            key={i}
            blog={blog}
            deleteBlog={() => deleteBlog(blog.id)}
            addLike = {() => updateBlog(blog.id)}
            user={user}
          />
        )}
      </ul>
    </>
  )

  // Function for showing notifications to user
  const showMessage = (message, messageType) => {
    setErrorMessage(message)
    setMessageType(messageType)

    // If message type is error display time is longer
    const displayTime = messageType === 'error' ? 10000 : 5000 // error message 10 s, other 5 s

    setTimeout(() => {
      setErrorMessage(null)
    }, displayTime)
  }

  return (
    <div>
      <h1>The List of Blogs</h1>
      <Notification message={errorMessage} type={messageType}/>

      {!user && loginForm()}
      {user && blogList()} 
    </div>
  )
}


export default App