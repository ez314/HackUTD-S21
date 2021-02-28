import Course from "./course";
import FAQ from "./faq";

export default function Modal({ close, info }) {
  if (info === null) {
    return <></>;
  }
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75">
          </div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="m-16 max-w-6xl inline-block bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all align-middle" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div className="bg-gray-800 pt-8 pr-16 sm:flex sm:flex-row-reverse">
            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-500 text-base font-medium text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 sm:w-auto sm:text-sm"
                    onClick={() => { close() }}
            >Close</button>
          </div>
          <Course id={info.id} name={info.name} />

        </div>
      </div>
    </div>
  );
}
