# 2023-scoreboard (WIP)

<img src="./preview.png" width="800"/>

[Link](https://nc108x.github.io/2023-scoreboard/) \
Designed for the internal use of the HKUST Robotics Team.

First time using Javascript and ReactJS so code is very bad I am trying my best orz \
WIP so stuff may be broken use at your own risk.

### Usage

- Left click on a pole to add a red ring and right click to add a blue ring.
- Other controls are pretty self-explanatory.

### Known Issues

- **The timer will more often than not immediately terminate after the 1 minute preparation time, instead of going down to the 3 minutes game time. Cause of bug has yet to be determined. Current workaround is to simply rewind to the start of game time, but this is very much less than ideal. Will examine further.**

  - Update: Apparently spamming start/pause in the last few seconds of the preparation time will trigger this bug. I suspect has something to do with the way `onComplete` is triggered?
    <br>
    <br>

- Currently does not support both sides achieving endgame. I kind of want to support this (in case a team wants to continue on their own after the other side has already achieved endgame for training purposes), but also cannot be bothered to completely redo how score calculation/endgame detection is done. Might(?) try in the future but no promises.

- When interacting with the UI while the timer is running, the timer may stutter. This is solely a visual glitch, and the time itself seems to be unaffected. Will leave this be until it is proven to severely affect usage.

- Timer does not display `01:00:00` or `03:00:00` for the 1/3 minute countdown, and takes away a few ms because reasons. No one cares about those extra ms so I'll pretend I don't know about this.

- Resizing the browser window will break the UI layout spectacularly because I haven't figured out how resizing works lmao. But you'll probably be using it in fullscreen... right? |･ω･)
