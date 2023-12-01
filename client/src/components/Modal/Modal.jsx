import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Modal = ({ showModal, setShowModal }) => {
  const consultLayer = useSelector((state) => state.consultLayer.consults);

  console.log(consultLayer);

  return (
    <>
      {showModal && Object.entries(consultLayer).length > 0 && (
        <div className="fixed inset-0 overflow-auto bg-slate-800 bg-opacity-90 flex justify-center items-center z-50">
          <div className="bgRed w-11/12 max-w-screen-xl h-5/6 p-5 rounded-lg relative shadow-md shadow-slate-500 overflow-hidden">
            <h6 className="bg-red-600 rounded-md p-2 mb-2 text-white text-2xl">
              Consulta de capas:
            </h6>
            <div className="max-h-[80vh] overflow-auto gap-4">
              {Object.entries(consultLayer).map(([layer, { features }]) => (
                <React.Fragment key={layer}>
                  {features.length > 0 && (
                    <h6 className="bg-red-400 rounded-md p-2 mb-2 text-white text-xl w-full">
                      {layer}
                    </h6>
                  )}
                  <div className="overflow-x-auto">
                    <table className="table-auto text-center border-spacing-6 w-full">
                      {features?.map(({ type, geometry, properties }, index) => (
                        <React.Fragment key={index}>
                          {index === 0 && (
                            <thead
                              className="bg-red-800 text-white"
                              key={type + index}
                            >
                              <tr className="py-2">
                                {Object.entries(properties).map(([key]) => (
                                  <th className="py-2" key={key}>
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody className="text-white">
                            {Object.entries(properties).map(([key, property]) => (
                              <td key={key} className="py-2">
                                {property}
                              </td>
                            ))}
                          </tbody>
                        </React.Fragment>
                      ))}
                    </table>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <button
              onClick={() => {
                setShowModal(false);
              }}
              className="bg-gray-400 text-black rounded-full py-3 px-5 text-md absolute top-4 right-5"
            >
              x
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
