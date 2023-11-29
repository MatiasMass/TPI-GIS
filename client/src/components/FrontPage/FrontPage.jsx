import React, { useEffect, useState } from "react";
import { getStudents } from "../../services/testService";
import utnImage from "../../assets/utn.png";
import "./FrontPage.css";
import PacmanLoader from "react-spinners/PacmanLoader";

export default function FrontPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents().then((result) => setStudents(result));
  }, []);

  return (
    <div className="w-[30%] mt-5 flex flex-col justify-center items-center subcontainer text-white">
      <div className="w-[100%] mb-7">
        <div
          className="200 flex 
            justify-center items-center
        "
        >
          <img
            className="
                w-[300px] h-[100px]
                object-contain
            "
            src={utnImage}
            alt=""
          />
        </div>
        <h2 className="text-center text-[32px] font-extrabold">
          Sistemas de Información <br />
          Geográficos
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="w-[100%] mb-4">
          <h3 className="font-bold mb-1">Profesores</h3>
          <h4>Ing. Ilse Hodapp</h4>
          <h4>Ing. Rodrigo Valdes</h4>
        </div>
        <div className="w-[100%] ">
          <h3 className="font-bold mb-1">Alumnos</h3>
          {students.map((student) => (
            <h4 className="" key={student.students}>
              {student.students}
            </h4>
          ))}
        </div>
      </div>
      <div className="mt-10">

      <PacmanLoader color="#fff" />
      </div>
    </div>
  );
}
