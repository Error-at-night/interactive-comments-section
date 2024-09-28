import PropTypes from 'prop-types';

function DeleteModal({ showModal, onClose, onConfirm }) {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-grayishBlue bg-opacity-40">
          <div className="bg-white rounded-md shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">Delete Comment</h2>
            <p className="text-grayishBlue mb-6">
              Are you sure you want to delete this comment? This will remove the comment and cant be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-grayishBlue text-white rounded-md hover:opacity-50 uppercase font-semibold"
                onClick={onClose}
              >
                No, Cancel
              </button>
              <button
                className="px-4 py-2 bg-softRed text-white rounded-md hover:opacity-50 uppercase font-semibold"
                onClick={onConfirm}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

DeleteModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteModal;
