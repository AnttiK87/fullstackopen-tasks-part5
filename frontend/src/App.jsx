import { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'

import useShowMessage from './hooks/showMessage'
import useLogin from './hooks/useLogin'
import useLogout from './hooks/useLogout'

import LoginFormContainer from './components/LoginFormContainer'
import BlogList from './components/BlogList'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const { errorMessage, messageType, showMessage } = useShowMessage()
  const { handleLogin } = useLogin(showMessage, setUser, setUsername, setPassword)
  const { handleLogout } = useLogout(showMessage, setUser)

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

  const addBlog = (blogObject) => {
    const messageBlogAdded = `Added a new blog ${blogObject.title} by ${blogObject.author} to the list!`

    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showMessage(messageBlogAdded, 'success')
      })
      .catch(error => {
        const errorMessage = error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to add blog'

        showMessage(errorMessage, 'error')
      })
  }

  const updateBlog = id => {
    const errorMessage = 'Something went wrong!'
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        //console.log(returnedBlog)
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        showMessage(errorMessage, error)
      })
  }

  const deleteBlog = id => {
    const blog = blogs.find(b => b.id === id)
    const messageDeleted = `${blog.title} by ${blog.author} deleted from the list!`
    const errorMessage = `${blog.title} by ${blog.author} was already deleted from the list!`

    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          showMessage(messageDeleted, 'success')
        })
        .catch(error => {
          if (error.response.status === 404) {
            console.error('Failed to delete blog', error)
            showMessage(errorMessage, 'error')
            setBlogs(blogs.filter(blog => blog.id !== id))
          } else {
            //for other errors
            showMessage('An unexpected error occurred', 'error')
          }
        })
    }
  }

  return (
    <div>
      <h1>The List of Blogs</h1>
      <Notification message={errorMessage} type={messageType}/>

      {!user && <LoginFormContainer handleLogin={handleLogin} />}
      {user && <BlogList
        user={user}
        blogs={blogs}
        handleLogout={handleLogout}
        addBlog={addBlog}
        deleteBlog={deleteBlog}
        updateBlog={updateBlog}
        blogFormRef={blogFormRef}
      />}
    </div>
  )
}


export default App