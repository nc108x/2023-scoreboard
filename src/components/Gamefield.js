import Pole from "./Pole.js";

export default function Gamefield() {
  return (
    <>
      <div className="gamefield">
        <div className="cols">
          <Pole color={"red"} type={1} />
          <Pole color={"red"} type={1} />
          <Pole color={"red"} type={1} />
        </div>

        <div className="cols">
          <Pole color={"na"} type={2} />
          <Pole color={"na"} type={2} />
        </div>

        <div className="cols">
          <Pole color={"na"} type={3} />
        </div>

        <div className="cols">
          <Pole color={"na"} type={2} />
          <Pole color={"na"} type={2} />
        </div>

        <div className="cols">
          <Pole color={"red"} type={1} />
          <Pole color={"red"} type={1} />
          <Pole color={"red"} type={1} />
        </div>
      </div>
    </>
  );
}
