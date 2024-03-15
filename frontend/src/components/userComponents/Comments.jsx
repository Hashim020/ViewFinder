import React, { useEffect, useState } from 'react';
import '../../assets/Css/Style.css'
const Comments = ({ postId, reload, fetchComments, comments }) => {
  useEffect(() => {
    fetchComments();
  }, [postId, reload]);

  const getTimeDifference = (createdAt) => {
    const now = new Date();
    const postedTime = new Date(createdAt);
    const timeDifference = now.getTime() - postedTime.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
      return 'just now';
    } else if (secondsDifference < 3600) {
      const minutes = Math.floor(secondsDifference / 60);
      return `${minutes}m ago`;
    } else if (secondsDifference < 86400) {
      const hours = Math.floor(secondsDifference / 3600);
      return `${hours}h ago`;
    } else if (secondsDifference < 604800) {
      const days = Math.floor(secondsDifference / 86400);
      return `${days}d ago`;
    } else if (secondsDifference < 2592000) {
      const weeks = Math.floor(secondsDifference / 604800);
      return `${weeks}w ago`;
    } else if (secondsDifference < 31536000) {
      const months = Math.floor(secondsDifference / 2592000);
      return `${months}m ago`;
    } else {
      const years = Math.floor(secondsDifference / 31536000);
      return `${years}y ago`;
    }
  };

  if (!comments || comments.length === 0) {
    return <p>There are no comments yet.</p>;
  }

  return (
    <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '310px', overflowY: 'auto' }}>
  <ul>
    {comments.map((comment) => (
      <li key={comment._id} className="comment-item">
        <div className="comment-details">
          <div className="comment-user flex">
            <img src={comment.userId.profileImageName.url} alt="User Avatar" className="avatar w-[34px] h-[34px] rounded-full" />
            <div className="pl-2">
              <div className="comment-text ">
                <span className='font-bold pr-2'>{comment.userId.username}</span>
                {comment.content}</div>
              <div className="text-neutral-400">{getTimeDifference(comment.createdAt)}</div> {/* Display time difference */}
            </div>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>
  );
};


export default Comments;

