import { FiLayers } from "react-icons/fi";
import "./LayersPanel.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLayer } from "../../redux/features/layers/layersSlice";

function LayersPanel() {
  const availableLayers = useSelector(store => store.layers.availableLayers)

  const [filterLayers, setFilterLayers] = useState(availableLayers)
  const [filter, setFilter] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    const filteredLayers = availableLayers.filter(layer => layer.name.toLowerCase().includes(filter.toLowerCase()))
    setFilterLayers(filteredLayers)
  }, [availableLayers, filter])



  useEffect(() => {
    document.addEventListener("click", function (event) {
      const optionsContainer = document.getElementById("options-container");
      const toggleButton = document.getElementById("toggleButton");

      if (
        !toggleButton.contains(event.target) &&
        !optionsContainer.contains(event.target)
      ) {
        optionsContainer.style.display = "none";
      }
    });
  }, []);

  const toggleButton = function () {
    var optionsContainer = document.getElementById("options-container");
    optionsContainer.style.display =
      optionsContainer.style.display === "none" ? "block" : "none";
  };


  const handleFilter = (e) => {
    setFilter(e.currentTarget.value)
  }

  const handleChange = (name) => {
    dispatch(toggleLayer(name))
  }

  return (
    <>
      <div className="panel" id="toggleButton" onClick={toggleButton}>
        <FiLayers />
        <p className="text-lg">Seleccionar Capas</p>
      </div>

      <div
        id="options-container"
        className="rounded-md shadow-xl bg-white absolute z-10 w-100 px-3 py-2
        text-white
        
        break-all
        "
      >
        <input
          placeholder="Busca una capa..."
          className="mb-6 rounded-md px-3 py-2 w-full text-black"
          onChange={handleFilter}
        />
        <div className="overflow-auto sm:h-60 h-40 w-full  ">
          {filterLayers?.map((layer) => (
            <div
              key={layer.name}
              className="flex items-center gap-2 my-2 
              layers
              "
            >
              <div className="flex justify-items-start ">
                <input
                  className="
                h-5 w-5 rounded-sm
                cursor-pointer"
                  type="checkbox"
                  defaultChecked={layer.checked}
                  onChange={() => handleChange(layer.name)}
                  />
              </div>
              {layer.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LayersPanel;
