# 2023-scoreboard (WIP)

[Link](https://nc108x.github.io/2023-scoreboard/) \
Designed for the internal use of the HKUST Robotics Team

First time using Javascript and ReactJS so code is very bad I am trying my best orz \
WIP so stuff may be broken use at your own risk

### Usage

- Left click on a pole to add a red ring and right click to add a blue ring
  - NOTE: Interaction with poles is only allowed during game time

### Known Issues

- When interacting with the UI while the timer is running, the timer may stutter. This is solely a visual glitch, and the time itself seems to be unaffected. Will leave this be until it is proven to severely affect usage.

- Occasionally the timer will immediately terminate after the 1 minute preparation time, instead of going down to the 3 minutes game time. Cause of bug has yet to be determined. A refresh/reset will "fix" this, but this is very much less than ideal. Will examine further.

- Resizing the browser window will break the UI layout spectacularly because I haven't figured out how resizing works lmao. But you'll probably be using it in fullscreen... right? |･ω･)
