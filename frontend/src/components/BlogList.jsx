// components/BlogList.js
import React from 'react'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'

const BlogList = ({ user, blogs, handleLogout, addBlog, deleteBlog, updateBlog, blogFormRef }) => {
  return (
    <>
      <div>
        <p>
          {user.name} is logged in.
          <button onClick={handleLogout} type="submit">Logout</button>
        </p>

        <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>
      <h3>Blog list</h3>
      <ul>
        {blogs.sort((a, b) => b.likes - a.likes).map((blog, i) =>
          <Blog
            key={blog.id}
            blog={blog}
            deleteBlog={() => deleteBlog(blog.id)}
            addLike={() => updateBlog(blog.id)}
            user={user}
          />
        )}
      </ul>
    </>
  )
}

export default BlogList