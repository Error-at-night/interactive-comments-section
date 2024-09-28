import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { v4 } from 'uuid'
import PropTypes from 'prop-types';

import BtnLoadingSpinner from './BtnLoadingSpinner';

import { useGetUserQuery } from '../features/api/apiUserSlice'
import { useAddReplyCommentMutation, useGetCommentsQuery } from '../features/api/apiCommentsSlice'

function ReplyCommentForm({ commentId, closeForm }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { data: comments } = useGetCommentsQuery();

  const { data: user } = useGetUserQuery()

  const [addReplyComment, { isLoading }] = useAddReplyCommentMutation()

  const comment = comments.find((comment) => comment.id === commentId)

  const date = new Date().toISOString()
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const formattedDate = new Date(date).toLocaleDateString('en-US', options)

  async function handleSubmitReplyToComment(data) {  
    try {
      await addReplyComment({ 
        id: commentId, 
        replies: [...comment.replies, {
            id: v4(),
            content: data.reply,
            createdAt: formattedDate,
            score: 0,
            replyingTo: comment.user.username,
            user: {
              username: user?.username,
              image: {
                png: user?.image.png,
                webp: user?.image.webp,
              },
            },
          }
        ] 
      }).unwrap();
      toast.success("Reply successfully added");
      reset()
      closeForm()
    } catch (error) {
      console.log(error.message);
      toast.error("There was an error when trying to add the reply");
    }
  }
  
  
  return (
    <form
        className="bg-white rounded-md mb-5 p-5"
        onSubmit={handleSubmit(handleSubmitReplyToComment)}
      >
        {errors.reply && (
          <p className="text-softRed mb-4">{errors.reply.message}</p>
        )}
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <img
            src={user?.image.png}
            width={35}
            alt="user"
            className="hidden sm:block sm:me-4"
          />
          <textarea
            className={`border p-2 outline-none rounded-md border-lightGray hover:border-moderateBlue focus:border-moderateBlue w-full sm:w-[75%] sm:flex-grow h-[100px] resize-none placeholder:font-semibold
              ${errors.reply ? "border border-softRed hover:border-softRed focus:border-softRed" : ""}
            `}
            placeholder="Add a comment..."
            {...register("reply", {
              required: "This field is required",
              minLength: {
                value: 10,
                message: "Reply must be at least 10 characters",
              },
            })}
          ></textarea>
          <div className="flex items-center justify-between w-full mt-3 sm:mt-0 sm:w-auto sm:ms-4">
            <img
              src={user?.image.png}
              width={35}
              alt="user"
              className="sm:hidden"
            />
            <button
              type="submit"
              className="bg-moderateBlue ms-auto hover:opacity-50 text-white py-2 uppercase font-bold px-5 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? <BtnLoadingSpinner/> : "Reply" }
            </button>
          </div>
        </div>
      </form>
  )
}

ReplyCommentForm.propTypes = {
  commentId: PropTypes.number.isRequired,
  closeForm: PropTypes.func.isRequired,
};

export default ReplyCommentForm