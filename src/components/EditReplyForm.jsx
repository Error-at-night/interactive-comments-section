import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PropTypes from 'prop-types';

import BtnLoadingSpinner from "./BtnLoadingSpinner";

import { useGetCommentsQuery, useUpdateReplyMutation } from "../features/api/apiCommentsSlice";

function EditReplyForm({ replyData, commentId, setEditReplyId }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { reply: replyData.content }
  });

  const [updateReply, { isLoading }] = useUpdateReplyMutation();

  const { data: comments } = useGetCommentsQuery();

  const currentComment = comments?.find(comment => comment.id === commentId);
  const currentReplies = currentComment?.replies || [];

  async function handleUpdateReply(data) {
    try {
      const updatedReply = currentReplies.map((reply) =>
        reply.id === replyData.id ? { ...reply, content: data.reply } : reply
      )

      await updateReply({ 
        id: commentId, 
        replies: updatedReply
      }).unwrap();
      toast.success("Reply updated successfully");
      reset();
      setEditReplyId(null)
    } catch (error) {
      console.log(error.message);
      toast.error("There was an error when trying to update the reply");
    }
  }

  return (
    <form
        className="bg-white rounded-md sm:ps-5 pt-5"
        onSubmit={handleSubmit(handleUpdateReply)}
      >
        {errors.reply && (
          <p className="text-softRed mb-4">{errors.reply.message}</p>
        )}
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <textarea
            className={`border p-2 outline-none rounded-md border-lightGray hover:border-moderateBlue focus:border-moderateBlue w-full sm:w-[75%] sm:flex-grow h-[100px] resize-none placeholder:font-semibold
              ${errors.reply ? "border border-softRed hover:border-softRed focus:border-softRed" : ""}
            `}
            placeholder="Add a reply..."
            {...register("reply", {
              required: "This field is required",
              minLength: {
                value: 10,
                message: "Reply must be at least 10 characters",
              },
            })}
          ></textarea>
        </div>
        <div className="flex items-center justify-between w-full mt-3 mb-8 sm:mb-0 sm:w-auto sm:ms-4">
          <button
            type="submit"
            className="bg-moderateBlue ms-auto hover:opacity-50 text-white py-2 uppercase font-bold px-5 rounded-lg"
            disabled={isLoading}
          >
           {isLoading ? <BtnLoadingSpinner/> : " Update"}
          </button>
        </div>
      </form>
  )
}

EditReplyForm.propTypes = {
  replyData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  commentId: PropTypes.number.isRequired,
  setEditReplyId: PropTypes.func.isRequired,
};

export default EditReplyForm