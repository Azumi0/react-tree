import React from "react";
import { render } from "react-dom";
import "./styles.css";
import SpeedTree from "./component/SpeedTree";
import createData from "./data";

const data = createData();

const Example = () => {
  console.log("start");
  return (
    <div style={{ height: "100%" }}>
      <SpeedTree data={data} />{" "}
    </div>
  );
};

render(<Example />, document.getElementById("root"));
