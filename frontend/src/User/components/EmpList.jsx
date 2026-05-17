import React from "react";
import { Link } from "react-router-dom";
import CardUI from "../../UI/CardUI";

const EmpList = (props) => {
  return (
    <div className="d-flex row justify-content-center">
      {props.employee.map((emp) => {
        return (
          <Link
            to={`/profile/${emp.id}`}
            className="text-decoration-none w-auto"
            key={emp.id}
          >
            <CardUI
              width="18rem"
              title={emp.name}
              image={emp.image}
              key={emp.id}
              position={emp.position}
              center={true}
              imgSize={50}
            ></CardUI>
          </Link>
        );
      })}
    </div>
  );
};

export default EmpList;
