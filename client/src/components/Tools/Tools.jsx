import { MdAdsClick } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import { LiaBroomSolid } from "react-icons/lia";
import { BsNewspaper } from "react-icons/bs";
import { RiMapPinAddLine } from "react-icons/ri";
import { LuMapPinOff } from "react-icons/lu";
import { TbPolygon } from "react-icons/tb";
import { TbPolygonOff } from "react-icons/tb";

import { useDispatch, useSelector } from "react-redux";
import "./Tools.css";
import { setToFalse, toggleSelectedOption } from "../../redux/features/interactions/interactionsSlice";

const selectOptionIcons = (option) => {
  switch (option) {
    case "navigation":
      return <MdAdsClick className="w-[30px] h-[30px]" />;
    case "measurement":
      return <TbRulerMeasure className="w-[30px] h-[30px]" />;
    case "consultation":
      return <BsNewspaper className="w-[30px] h-[30px]" />;
    case "addMarker":
      return <RiMapPinAddLine className="w-[30px] h-[30px]" />;
    case "removeMarker":
      return <LuMapPinOff className="w-[30px] h-[30px]" />;
    case "addPolygon":
      return <TbPolygon className="w-[30px] h-[30px]" />;
    case "removePolygon":
      return <TbPolygonOff className="w-[30px] h-[30px]" />;
    case "removeAll":
      return <LiaBroomSolid className="w-[30px] h-[30px]" />;
    default:
      return null;
  }
};

function Tools() {
  const options = useSelector((state) => state.interactions.options);
  const dispatch = useDispatch();

  const toggleSelection = (id) => {
    dispatch(toggleSelectedOption(id));
  };

  const onMouseEnter = (id) => {
    // dispatch(toggleSelectedOption(id))
  };

  const onMouseLeave = (id) => {
    // dispatch(setToFalse(id))
  };

  // open and close sidebar

  function openNav() {
    const sideBar = document.getElementById("sidebar");
    sideBar.style.width = "250px";
    const main = document.getElementById("toolbar");
    main.style.display = "250px";

    const openBtn = document.getElementById("open-btn");
    openBtn.style.display = "none";
  }

  function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("toolbar").style.marginLeft = "0";
    document.getElementById("open-btn").style.display = "block";
  }

  return (
    <>
      <div id="toolbar" className="flex justify-center w-[7%]">
        <div id="open-btn" onClick={openNav}>
          ☰
        </div>
      </div>
      <div id="sidebar" className="sidebar">
        <div className="closebtn">
          <span onClick={closeNav}>×</span>
        </div>

        {options.map((option, index) => (
          <div
            key={index}
            className={`flex flex-col justify-center items-center tool p-2
            ${option.selected ? "bg-slate-500" : ""}
        `}
            onClick={() => {
              toggleSelection(option.id);
            }}
            onMouseEnter={() => onMouseEnter(option.id)}
            onMouseLeave={() => onMouseLeave(option.id)}
          >
            {selectOptionIcons(option.id)}
            <h3>{option.name}</h3>
          </div>
        ))}
      </div>
    </>
  );
}

export default Tools;
