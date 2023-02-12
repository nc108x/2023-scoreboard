import Pole from "./Pole.js";

export default function Gamefield({
  poles,
  redScoreHandler,
  blueScoreHandler,
}) {
  return (
    <>
      <div className="gamefield">
        <div className="cols" style={{ left: "25px" }}>
          <Pole
            pos={10}
            rings={poles[0]}
            redScoreHandler={() => redScoreHandler(0)}
            blueScoreHandler={(e) => blueScoreHandler(e, 0)}
          />
          <Pole
            pos={200}
            rings={poles[1]}
            redScoreHandler={() => redScoreHandler(1)}
            blueScoreHandler={(e) => blueScoreHandler(e, 1)}
          />
          <Pole
            pos={390}
            rings={poles[2]}
            redScoreHandler={() => redScoreHandler(2)}
            blueScoreHandler={(e) => blueScoreHandler(e, 2)}
          />
        </div>

        <div className="cols" style={{ left: "130px" }}>
          <Pole
            pos={120}
            rings={poles[3]}
            redScoreHandler={() => redScoreHandler(3)}
            blueScoreHandler={(e) => blueScoreHandler(e, 3)}
          />
          <Pole
            pos={280}
            rings={poles[4]}
            redScoreHandler={() => redScoreHandler(4)}
            blueScoreHandler={(e) => blueScoreHandler(e, 4)}
          />
        </div>

        <div className="cols" style={{ left: "200px" }}>
          <Pole
            pos={200}
            rings={poles[5]}
            redScoreHandler={() => redScoreHandler(5)}
            blueScoreHandler={(e) => blueScoreHandler(e, 5)}
          />
        </div>

        <div className="cols" style={{ left: "280px" }}>
          <Pole
            pos={120}
            rings={poles[6]}
            redScoreHandler={() => redScoreHandler(6)}
            blueScoreHandler={(e) => blueScoreHandler(e, 6)}
          />
          <Pole
            pos={280}
            rings={poles[7]}
            redScoreHandler={() => redScoreHandler(7)}
            blueScoreHandler={(e) => blueScoreHandler(e, 7)}
          />
        </div>

        <div className="cols" style={{ left: "380px" }}>
          <Pole
            pos={10}
            rings={poles[8]}
            redScoreHandler={() => redScoreHandler(8)}
            blueScoreHandler={(e) => blueScoreHandler(e, 8)}
          />
          <Pole
            pos={200}
            rings={poles[9]}
            redScoreHandler={() => redScoreHandler(9)}
            blueScoreHandler={(e) => blueScoreHandler(e, 9)}
          />
          <Pole
            pos={390}
            rings={poles[10]}
            redScoreHandler={() => redScoreHandler(10)}
            blueScoreHandler={(e) => blueScoreHandler(e, 10)}
          />
        </div>
      </div>
    </>
  );
}
