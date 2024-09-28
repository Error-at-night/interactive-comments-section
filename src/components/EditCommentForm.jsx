import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PropTypes from 'prop-types';

import BtnLoadingSpinner from "./BtnLoadingSpinner";

import { useUpdateCommentMutation } from "../features/api/apiCommentsSlice";

function EditCommentForm({ comment, setEditCommentId }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { comment: comment.content }
  });

  const [updateComment, { isLoading }] = useUpdateCommentMutation();

  async function handleUpdateComment(data) {
    try {
      await updateComment({ 
        id: comment.id, 
        updatedContent: data.comment 
      }).unwrap();
      toast.success("Comment updated successfully");
      reset();
      setEditCommentId(null)
    } catch (error) {
      console.log(error.message);
      toast.error("There was an error when trying to update the comment");
    }
  }

  return (
    <form
        className="bg-white rounded-md sm:ps-5 pt-5"
        onSubmit={handleSubmit(handleUpdateComment)}
      >
        {errors.comment && (
          <p className="text-softRed mb-4">{errors.comment.message}</p>
        )}
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <textarea
            className={`border p-2 outline-none rounded-md border-lightGray hover:border-moderateBlue focus:border-moderateBlue w-full sm:w-[75%] sm:flex-grow h-[100px] resize-none placeholder:font-semibold
              ${errors.comment ? "border border-softRed hover:border-softRed focus:border-softRed" : ""}
            `}
            placeholder="Add a comment..."
            // value={comment.content}
            {...register("comment", {
              required: "This field is required",
              minLength: {
                value: 10,
                message: "Comment must be at least 10 characters",
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
            {isLoading ? <BtnLoadingSpinner/> : "Update"}
          </button>
        </div>
      </form>
  )
}

EditCommentForm.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  setEditCommentId: PropTypes.func.isRequired,
};

export default EditCommentForm