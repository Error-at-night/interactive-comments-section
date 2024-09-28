import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import BtnLoadingSpinner from "./BtnLoadingSpinner";

import { useAddCommentMutation } from "../features/api/apiCommentsSlice";
import { useGetUserQuery } from "../features/api/apiUserSlice";

function WriteCommentForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { data: user } = useGetUserQuery()

  const [addComment, { isLoading }] = useAddCommentMutation()

  const date = new Date().toISOString()
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const formattedDate = new Date(date).toLocaleDateString('en-US', options)

  async function handleSubmitComment(data) {
    try {
      await addComment({
        content: data.comment,
        createdAt: formattedDate,
        score: 0,
        user: {
          image: {
            png: user?.image.png,
            webp: user?.image.webp,
          },
          username: user?.username,
        },
        replies: [],
      }).unwrap()
      toast.success("Comment successfully added")
      reset()
    } catch(error) {
        console.log(error.message)
        toast.error("There was an error when trying to add the comment")
    }
  }

  return (
    <form
        className="bg-white rounded-md mb-5 p-5"
        onSubmit={handleSubmit(handleSubmitComment)}
      >
        {errors.comment && (
          <p className="text-softRed mb-4">{errors.comment.message}</p>
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
              ${errors.comment ? "border border-softRed hover:border-softRed focus:border-softRed" : ""}
            `}
            placeholder="Add a comment..."
            {...register("comment", {
              required: "This field is required",
              minLength: {
                value: 10,
                message: "Comment must be at least 10 characters",
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
              {isLoading ? <BtnLoadingSpinner/> : "Send" } 
            </button>
          </div>
        </div>
      </form>
  )
}

export default WriteCommentForm