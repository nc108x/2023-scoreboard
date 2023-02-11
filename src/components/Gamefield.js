import Pole from "./Pole.js";

export default function Gamefield() {
  return (
    <>
      <div className="gamefield">
        <div className="cols" style={{ left: "25px" }}>
          <Pole color={"red"} type={1} pos={10} />
          <Pole color={"red"} type={1} pos={200} />
          <Pole color={"red"} type={1} pos={390} />
        </div>

        <div className="cols" style={{ left: "130px" }}>
          <Pole color={"na"} type={2} pos={120} />
          <Pole color={"na"} type={2} pos={280} />
        </div>

        <div className="cols" style={{ left: "200px" }}>
          <Pole color={"na"} type={3} pos={200} />
        </div>

        <div className="cols" style={{ left: "280px" }}>
          <Pole color={"na"} type={2} pos={120} />
          <Pole color={"na"} type={2} pos={280} />
        </div>

        <div className="cols" style={{ left: "380px" }}>
          <Pole color={"red"} type={1} pos={10} />
          <Pole color={"red"} type={1} pos={200} />
          <Pole color={"red"} type={1} pos={390} />
        </div>
      </div>
    </>
  );
}
