import React from "react";
import { Card } from "react-bootstrap";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "./CardUI.css";

const CardUI = (props) => {
  return (
    <Card style={{ width: props.width }} className="p-2 m-2">
      <Card.Body>
        <div
          className={`d-flex ${props.center ? "justify-content-start align-items-center" : ""}`}
        >
          {props.image ? (
            <Avatar
              size={props?.imgSize || 64}
              src={`http://localhost:5000/${props.image}`}
              className="my-2"
            />
          ) : (
            <Avatar
              size={props?.imgSize || 64}
              icon={<UserOutlined />}
              className="my-2"
            />
          )}
          {props.title && (
            <Card.Title className="text-center ms-3 my-2">
              <h3 className="profile-detail-heading mb-0">{props.title}</h3>
              {props.position && (
                <h6 className="fw-bold mb-0 text-muted mt-1">{props.position}</h6>
              )}
              {props.address && <h6 className="mb-0 mt-1">{props.address}</h6>}
            </Card.Title>
          )}
        </div>
        {props.children}
      </Card.Body>
    </Card>
  );
};

export default CardUI;
