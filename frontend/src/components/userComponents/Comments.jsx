import React, { useEffect, useState } from 'react';
import axios from 'axios'; // 

const Comments = ({ postId,reload,fetchComments,comments }) => {
  useEffect(() => {
       
    fetchComments();
  }, [postId,reload]);

  if (!comments || comments.length === 0) {
    return <p>There are no comments yet.</p>;
  }

  return (
    <div className="comments-container" style={{ maxHeight: '310px', overflowY: 'auto' }}> {/* Set max height and overflow */}
      <ul>
        {comments.map((comment) => (
          <li key={comment._id} className="comment-item">
            <div className="comment-details">
              <div className="comment-user flex">
                <img src={comment.userId.profileImageName.url} alt="User Avatar" className="avatar w-10 rounded-full" />
                <span className='font-bold' >{comment.userId.username}</span>
              </div>
              <div className=" pl-11  comment-text">{`comment:  ${comment.content}`}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
