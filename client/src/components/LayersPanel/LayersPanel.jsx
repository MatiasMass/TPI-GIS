import { FiLayers } from "react-icons/fi";
import "./LayersPanel.css";
import { useEffect, useState } from "react";

const availableLayers = [
  {
    id: 1,
    name: "vegetacion",
    checked: false,
  },
  {
    id: 2,
    name: "capa automovilistica",
    checked: true,
  },
  {
    id: 3,
    name: "capa corrientes",
    checked: true,
  },
  {
    id: 4,
    name: "tylor swift",
    checked: false,
  },
  {
    id: 5,
    name: "gis material",
    checked: false,
  },
  {
    id: 6,
    name: "Limite Politico Administrativo Limítrofe",
    checked: false,
  },

  {
    id: 7,
    name: "gis 2do parcial",
    checked: false,
  },
];

function LayersPanel() {
  const [filterLayers, setFilterLayers] = useState([...availableLayers]);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    const filteredLayers = availableLayers.filter((layer) =>
      layer.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilterLayers(filteredLayers);
  }, [filter]);

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

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const toggleButton = function () {
    var optionsContainer = document.getElementById("options-container");
    optionsContainer.style.display =
      optionsContainer.style.display === "none" ? "block" : "none";
  };


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
              key={layer.id}
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
                  onChange={() => (layer.checked = !layer.checked)}
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
