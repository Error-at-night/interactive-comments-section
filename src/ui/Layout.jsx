import { useState } from "react";
import { toast } from "react-hot-toast";

import { 
  useGetCommentsQuery, 
  useDeleteCommentMutation, 
  useDeleteReplyMutation, 
  useUpdateCommentUpvoteMutation, 
  useUpdateCommentDownvoteMutation, 
  useUpdateReplyUpvoteMutation, 
  useUpdateReplyDownvoteMutation
} from "../features/api/apiCommentsSlice";

import WriteCommentForm from "../components/WriteCommentForm"
import ReplyCommentForm from "../components/ReplyCommentForm";
import ReplyNestedCommentForm from "../components/ReplyNestedCommentForm";
import DeleteModal from "../components/DeleteModal";
import EditCommentForm from "../components/EditCommentForm";
import EditReplyForm from "../components/EditReplyForm";

import replyIcon from "../assets/icon-reply.svg";
import deleteIcon from "../assets/icon-delete.svg";
import editIcon from "../assets/icon-edit.svg";

function Layout() {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null)
  const [editReplyId, setEditReplyId] = useState(null)
  const [showReplyCommentBox, setShowReplyCommentBox] = useState(null)
  const [showReplyBox, setShowReplyBox] = useState(null) 

  const { data: comments, isLoading, error: commentsError } = useGetCommentsQuery();

  const [deleteComment] = useDeleteCommentMutation()
  const [deleteReply] =  useDeleteReplyMutation()
  const [updateCommentUpvote] = useUpdateCommentUpvoteMutation()
  const [updateCommentDownvote] = useUpdateCommentDownvoteMutation()
  const [updateReplyUpvote] = useUpdateReplyUpvoteMutation()
  const [updateReplyDownvote] = useUpdateReplyDownvoteMutation()

  if (isLoading) return <div className="h-[100vh] flex items-center justify-center">
    <span className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-moderateBlue"></span>
  </div>

  if (commentsError) return <div className="text-center mt-8">Could not fetch the comments</div>

  // delete comment
  async function handleDeleteComment(id) {
    try {
      await deleteComment(id).unwrap()
      toast.success("Comment successfully deleted")
      setDeleteTarget(null);
    } catch(error) {
        console.log(error.message)
        toast.error("There was an error when trying to delete the comment")
    }
  }

  // delete reply
  async function handleDeleteReply(commentId, replyId) {
    try {
      const comment = comments.find((comment) => comment.id === commentId)
      const updatedReply = comment.replies.filter((reply) => reply.id !== replyId)

      await deleteReply({ 
        id: commentId,
        replies: updatedReply
      }).unwrap();
      toast.success("Reply successfully deleted");
      setDeleteTarget(null);
    } catch (error) {
      console.log(error.message);
      toast.error("There was an error when trying to delete the reply");
    }
  }

  // update comment upvote
  async function handleCommentUpvote (commentId, currentScore) {
    try {
      await updateCommentUpvote({
        id: commentId,
        updatedScore: currentScore + 1,
      }).unwrap();
    } catch(error) {
      console.log(error.message)
      toast.error("There was an error when trying to upvote the comment")
    }
  }

  // update comment downvote
  async function handleCommentDownvote (commentId, currentScore) {
    try {
      await updateCommentDownvote({
        id: commentId,
        updatedScore: currentScore === 0 ? currentScore : currentScore - 1,
      }).unwrap();
    } catch(error) {
      console.log(error.message)
      toast.error("There was an error when trying to downvote the comment")
    }
  }

  // update reply upvote
  async function handleReplyUpvote (commentId, replyId) {
    try {
      const comment = comments.find((comment) => comment.id === commentId);
      const updatedUpvote = comment.replies.map((reply) => reply.id === replyId ? 
        { ...reply, score: reply.score + 1 } : reply
      );

      await updateReplyUpvote({
        commentId,
        updatedScore: {
          ...comment,
          replies: updatedUpvote
        }
      }).unwrap();
    } catch(error) {
      console.log(error.message)
      toast.error("There was an error when trying to upvote the reply")
    }
  }

  // update reply downvote
  async function handleReplyDownvote (commentId, replyId) {
    try {
      const comment = comments.find((comment) => comment.id === commentId);
      const updatedUpvote = comment.replies.map((reply) => reply.id === replyId ? 
        { ...reply, score: reply.score === 0 ? reply.score : reply.score - 1 } : reply
      );

      await updateReplyDownvote({
        commentId,
        updatedScore: {
          ...comment,
          replies: updatedUpvote
        }
      }).unwrap();
    } catch(error) {
      console.log(error.message)
      toast.error("There was an error when trying to upvote the reply")
    }
  }

  // show edit comment form and update editCommentId state to the Id of the comment that was clicked
  function handleShowEditCommentForm(comment) {
    setEditCommentId(comment.id)
  }

  // show edit reply form and update editReplyId state to the Id of the reply that was clicked
  function handleShowEditReplyForm(reply) {
    setEditReplyId(reply.id)
  }
  
  return (
    <main className="max-w-2xl mx-auto mt-5 px-5">
      {comments?.map((comment) => (
        <div key={comment.id}>
          <div className="bg-white rounded-md mb-5 px-5 py-5">
            <div className="w-full">
              <div className="flex items-start">
                <div className="text-center sm:flex sm:flex-col py-5 px-3 rounded-md bg-verylightGray hidden">
                  <button className="text-lightGrayishBlue text-[1.5rem] mb-2 font-bold hover:text-moderateBlue"
                    onClick={() => handleCommentUpvote(comment.id, comment.score)}
                  >
                    +
                  </button>
                  <span className="text-moderateBlue font-bold">{comment.score}</span>
                  <button className="text-lightGrayishBlue text-[1.5rem] font-bold hover:text-moderateBlue"
                    onClick={() => handleCommentDownvote(comment.id, comment.score)}
                  >
                    -
                  </button>
                </div>
                <div className="w-full">
                  <div className="flex items-center sm:ps-5 justify-between">
                    <div className="flex flex-wrap items-center">
                      <img src={comment.user.image.png} alt={comment.user.username} width={35} className="me-3"/>
                      <p className="me-3 text-darkBlue font-bold">
                        {comment.user.username}
                        {comment.user.username === "juliusomo" &&
                        <span className="bg-moderateBlue font-semibold text-white py-0.1 px-1 ms-2">You</span>}
                      </p>
                      <p className="text-grayishBlue font-semibold">{comment.createdAt}</p>
                    </div>
                    <div className="hidden sm:flex sm:items-center">
                      {comment.user.username === "juliusomo" ? (
                        <>
                          <div className="flex items-center me-5">
                            <img src={deleteIcon} alt="deleteIcon" className="me-2" />
                            <button className="text-softRed font-bold hover:opacity-50"
                              onClick={() => setDeleteTarget({ type: "comment", id: comment.id })}
                            >
                              Delete
                            </button>
                          </div>
                          <div className="flex items-center">
                            <img src={editIcon} alt="editIcon" className="me-2" />
                            <button className="font-bold text-moderateBlue hover:opacity-50"
                              onClick={() => handleShowEditCommentForm(comment)}
                            >
                              Edit
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={replyIcon} width={15} className="me-2" />
                          <button className="text-moderateBlue font-bold hover:text-lightGrayishBlue" 
                            onClick={() => setShowReplyCommentBox((prev) => prev === comment.id ? null : comment.id )}
                          >
                            Reply
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {editCommentId === comment.id ? (
                      <EditCommentForm comment={comment} setEditCommentId={setEditCommentId}/>
                    ) : (
                      <div>
                        <p className="sm:ps-5 mt-1 text-clip sm:mt-2 text-grayishBlue break-words">{comment.content}</p>
                      </div>
                  )}
                  {/* mobile screen upvote, downvote button and reply button */}
                  <div className="flex justify-between items-center mt-4 sm:hidden">
                    <div className="py-2 flex justify-between items-center px-5 rounded-md bg-verylightGray">
                      <button className="text-lightGrayishBlue me-5 text-[1.5rem] font-bold hover:text-moderateBlue"
                        onClick={() => handleCommentUpvote(comment.id, comment.score)}
                      >
                        +
                      </button>
                      <span className="text-moderateBlue font-bold">{comment.score}</span>
                      <button className="text-lightGrayishBlue text-[1.5rem] ms-5 font-bold hover:text-moderateBlue"
                        onClick={() => handleCommentDownvote(comment.id, comment.score)}
                      >
                        -
                      </button>
                    </div>
                    <div className="flex items-center ml-auto">
                      {comment.user.username === "juliusomo" ? (
                        <>
                          <div className="flex items-center me-5">
                            <img src={deleteIcon} alt="deleteIcon" className="me-2" />
                            <button className="text-softRed font-bold hover:opacity-50"
                             onClick={() => setDeleteTarget({ type: "comment", id: comment.id })}
                            >
                              Delete
                            </button>
                          </div>
                          <div className="flex items-center">
                            <img src={editIcon} alt="editIcon" className="me-2"/>
                            <button className="font-bold text-moderateBlue hover:opacity-50"
                              onClick={() => handleShowEditCommentForm(comment)}
                            >
                              Edit
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={replyIcon} width={15} className="me-2"/>
                          <button className="text-moderateBlue font-bold hover:text-lightGrayishBlue"
                            onClick={() => setShowReplyCommentBox((prev) => prev === comment.id ? null : comment.id )}
                          >
                            Reply
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Delete modal for comment */}
          <DeleteModal
            showModal={deleteTarget?.type === "comment" && deleteTarget?.id === comment.id}
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => handleDeleteComment(comment.id)}
          />
          {/* ReplyComment form */}
          {showReplyCommentBox === comment.id && <ReplyCommentForm commentId={comment.id} closeForm={() => setShowReplyCommentBox(null)}/>}
          {/* Replies */}
          <div className="border-s-2 border-lightGray ps-4 sm:ms-10 sm:ps-9">
            {comment.replies.map((reply) => (
              <div key={reply.id}>
              <div className="mt-5 mb-5 bg-white p-5 rounded-md">
                <div className="w-full">
                  <div className="flex items-start">
                    <div className="text-center py-5 px-3 rounded-md bg-verylightGray hidden sm:flex sm:flex-col">
                      <button className="text-lightGrayishBlue mb-2 text-[1.5rem] font-bold hover:text-moderateBlue"
                        onClick={() => handleReplyUpvote(comment.id, reply.id)}
                      >
                        +
                      </button>
                      <span className="text-moderateBlue font-bold">{reply.score}</span>
                      <button className="text-lightGrayishBlue text-[1.5rem] font-bold hover:text-moderateBlue"
                        onClick={() => handleReplyDownvote(comment.id, reply.id)} 
                      >
                        -
                      </button>
                    </div>
                    <div className="w-full">
                      <div className="flex items-start sm:ps-5 justify-between">
                        <div className="flex flex-wrap items-center">
                          <img src={reply.user.image.png} alt={reply.user.username} width={35} className="me-3" />
                          <p className="me-3 text-darkBlue font-bold">
                            {reply.user.username}
                            {reply.user.username === "juliusomo" &&
                            <span className="bg-moderateBlue font-semibold text-white py-0.1 px-1 ms-2">You</span>}
                          </p>
                          <p className="text-grayishBlue font-semibold">
                            {reply.createdAt}
                          </p>
                        </div>
                        <div className="sm:flex sm:items-center hidden">
                          {reply.user.username === "juliusomo" ? (
                            <>
                              <div className="flex items-center me-5">
                                <img src={deleteIcon} alt="deleteIcon" className="me-2" />
                                <button className="text-softRed font-bold hover:opacity-50"
                                  onClick={() => setDeleteTarget({ type: "reply", commentId: comment.id, replyId: reply.id })}
                                >
                                  Delete
                                </button>
                              </div>
                              <div className="flex items-center">
                                <img src={editIcon} alt="editIcon" className="me-2" />
                                <button className="font-bold text-moderateBlue hover:opacity-50"
                                  onClick={() => handleShowEditReplyForm(reply)}
                                >
                                  Edit
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <img src={replyIcon} width={15} className="me-2" />
                              <button className="text-moderateBlue font-bold hover:text-lightGrayishBlue"
                                onClick={() => setShowReplyBox((prev) => prev === reply.id ? null : reply.id )}
                              >
                                Reply
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {editReplyId === reply.id ? (
                        <EditReplyForm replyData={reply} commentId={comment.id} setEditReplyId={setEditReplyId}/>
                        ) : (
                          <div>
                            <p className="block sm:ps-5 mt-1 sm:mt-2 text-grayishBlue break-words">
                              <span className="text-moderateBlue font-bold me-1">@{reply.replyingTo}</span>
                              {reply.content}
                            </p>
                          </div>
                        )
                      }
                      {/* mobile view reply's upvote, downvote, reply, delete and edit button*/}
                      <div className="flex flex-wrap justify-between mt-4 sm:hidden">
                        <div className="py-2 flex justify-between px-5 rounded-md bg-verylightGray">
                          <button className="text-lightGrayishBlue me-5 text-[1.5rem] font-bold hover:text-moderateBlue"
                            onClick={() => handleReplyUpvote(comment.id, reply.id)} 
                          >
                            +
                          </button>
                          <span className="text-moderateBlue font-bold">
                            {reply.score}
                          </span>
                          <button className="text-lightGrayishBlue ms-5 text-[1.5rem] font-bold hover:text-moderateBlue"
                            onClick={() => handleReplyDownvote(comment.id, reply.id)} 
                          >
                            -
                          </button>
                        </div>
                        <div className="flex items-center">
                          {reply.user.username === "juliusomo" ? (
                            <>
                              <div className="flex items-center me-5">
                                <img src={deleteIcon} alt="deleteIcon" className="me-2" />
                                <button className="text-softRed font-bold"
                                  onClick={() => setDeleteTarget({ type: "reply", commentId: comment.id, replyId: reply.id })}
                                >
                                  Delete
                                </button>
                              </div>
                              <div className="flex items-center">
                                <img src={editIcon} alt="editIcon"className="me-2" />
                                <button className="font-bold text-moderateBlue"
                                  onClick={() => handleShowEditReplyForm(reply)}
                                >
                                  Edit
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <img src={replyIcon} width={15} className="me-2" />
                              <button className="text-moderateBlue font-bold hover:text-lightGrayishBlue"
                                onClick={() => setShowReplyBox((prev) => prev === reply.id ? null : reply.id )}
                              >
                                Reply
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {/*  */}
                    </div>
                  </div>
                </div>
              </div>
              {showReplyBox === reply.id && <ReplyNestedCommentForm replyId={reply.id} commentId={comment.id} closeForm={() => setShowReplyBox(null)} />}
              {/* Delete modal for reply */}
              <DeleteModal
                showModal={deleteTarget?.type === "reply" && deleteTarget?.commentId === comment.id && deleteTarget?.replyId === reply.id}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => handleDeleteReply(comment.id, reply.id)}
              />
              </div>
            ))}
          </div>
        </div>
      ))}
      <WriteCommentForm/>
    </main>
  );
}

export default Layout;
