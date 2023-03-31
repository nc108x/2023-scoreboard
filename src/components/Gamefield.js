import Pole from "./Pole.js";

export default function Gamefield({ poles, scoreHandler }) {
  return (
    <>
      <div className="gamefield">
        <div className="cols" style={{ left: "25px" }}>
          <Pole
            pos={10}
            rings={poles[0]}
            redScoreHandler={(e) => scoreHandler(e, 0, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 0, "blue")}
          />
          <Pole
            pos={200}
            rings={poles[1]}
            redScoreHandler={(e) => scoreHandler(e, 1, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 1, "blue")}
          />
          <Pole
            pos={390}
            rings={poles[2]}
            redScoreHandler={(e) => scoreHandler(e, 2, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 2, "blue")}
          />
        </div>

        <div className="cols" style={{ left: "130px" }}>
          <Pole
            pos={120}
            rings={poles[3]}
            redScoreHandler={(e) => scoreHandler(e, 3, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 3, "blue")}
          />
          <Pole
            pos={280}
            rings={poles[4]}
            redScoreHandler={(e) => scoreHandler(e, 4, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 4, "blue")}
          />
        </div>

        <div className="cols" style={{ left: "200px" }}>
          <Pole
            pos={200}
            rings={poles[5]}
            redScoreHandler={(e) => scoreHandler(e, 5, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 5, "blue")}
          />
        </div>

        <div className="cols" style={{ left: "280px" }}>
          <Pole
            pos={120}
            rings={poles[6]}
            redScoreHandler={(e) => scoreHandler(e, 6, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 6, "blue")}
          />
          <Pole
            pos={280}
            rings={poles[7]}
            redScoreHandler={(e) => scoreHandler(e, 7, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 7, "blue")}
          />
        </div>

        <div className="cols" style={{ left: "380px" }}>
          <Pole
            pos={10}
            rings={poles[8]}
            redScoreHandler={(e) => scoreHandler(e, 8, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 8, "blue")}
          />
          <Pole
            pos={200}
            rings={poles[9]}
            redScoreHandler={(e) => scoreHandler(e, 9, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 9, "blue")}
          />
          <Pole
            pos={390}
            rings={poles[10]}
            redScoreHandler={(e) => scoreHandler(e, 10, "red")}
            blueScoreHandler={(e) => scoreHandler(e, 10, "blue")}
          />
        </div>
      </div>
    </>
  );
}
