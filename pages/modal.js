import Course from "./course";
import FAQ from "./faq";

export default function Modal({ close, info }) {
  return (
    <>
    {info !== null && info !== undefined ? 
    <div className="fixed z-20 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen bg-black bg-opacity-75 pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <div className="m-16 w-5/6 inline-block bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all align-middle" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div className="bg-gray-800 pt-8 pr-16 sm:flex sm:flex-row-reverse">
            <button type="button" className="fixed z-50 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-500 text-base font-medium text-white hover:bg-gray-400 focus:outline-none sm:w-auto sm:text-sm"
                    onClick={() => { close() }}
            >Close</button>
          </div>
          <Course id={info.id} name={info.name} />

        </div>
      </div>
    </div>
    : <></> }
    </>
  );
}
