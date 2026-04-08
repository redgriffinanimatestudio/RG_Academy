# RobotGo - Cross-Platform Desktop GUI Automation

A comprehensive skill for using RobotGo, a Go native library for cross-platform GUI automation, keyboard/mouse control, screen capture, and window management.

## Overview

RobotGo enables programmatic control of desktop applications across macOS, Windows, and Linux. It provides native bindings for:

- Mouse control (move, click, drag, scroll)
- Keyboard control (type, hotkeys, clipboard)
- Screen capture and image analysis
- Window management and process control
- Global event hooking

## What is RobotGo?

RobotGo is a native Go library for cross-platform RPA (Robotic Process Automation), automated testing, and desktop automation. It provides:

- **High-level API**: Simple functions for common automation tasks
- **Cross-platform**: Works on macOS, Windows, and Linux (X11)
- **Native performance**: Direct system calls for reliable automation
- **Image recognition**: Bitmap/template matching for visual automation

## When to Use RobotGo

Use RobotGo for:

- **RPA Development**: Build robotic process automation scripts
- **Automated Testing**: Create UI test automation frameworks
- **Macros**: Automate repetitive desktop tasks
- **Computer Use**: AI-driven desktop control applications
- **Process Automation**: Control other applications programmatically

## Installation

### Prerequisites

**All Platforms:**
- Go 1.11 or higher
- GCC (C compiler)

**macOS:**
```bash
brew install go
xcode-select --install
# Grant Accessibility permissions in System Settings
```

**Windows:**
```bash
winget install Golang.go
winget install MartinStorsjo.LLVM-MinGW.UCRT
```

**Linux (Ubuntu):**
```bash
sudo snap install go --classic
sudo apt install gcc libc6-dev libx11-dev xorg-dev libxtst-dev
```

### Install Package

```bash
go get github.com/go-vgo/robotgo
```

## Quick Start

### Mouse Control

```go
package main

import "github.com/go-vgo/robotgo"

func main() {
    // Move mouse
    robotgo.Move(100, 100)
    
    // Click
    robotgo.Click("left")
    
    // Scroll
    robotgo.Scroll(0, -10)
    
    // Get position
    x, y := robotgo.Location()
    println(x, y)
}
```

### Keyboard Control

```go
// Type text
robotgo.Type("Hello World")

// Key combinations
robotgo.KeyTap("enter")
robotgo.KeyTap("i", "alt", "cmd")  // Alt+Cmd+i

// Clipboard
robotgo.WriteAll("text")
text, _ := robotgo.ReadAll()
```

### Screen Capture

```go
// Capture screen
bit := robotgo.CaptureScreen(0, 0, 800, 600)
defer robotgo.FreeBitmap(bit)

// Save image
img := robotgo.ToImage(bit)
robotgo.Save(img, "screenshot.png")

// Get screen size
w, h := robotgo.GetScreenSize()
```

### Window Management

```go
// Find windows
pids, _ := robotgo.FindIds("Chrome")

// Activate window
robotgo.ActiveName("Chrome")

// Get title
title := robotgo.GetTitle()
```

## Core Features

### Mouse Operations
- `Move(x, y)` - Move to position
- `MoveRelative(dx, dy)` - Move relative
- `MoveSmooth(x, y)` - Smooth movement
- `Click(button)` - Click mouse button
- `DoubleClick()` - Double click
- `DragSmooth(x, y)` - Drag operations
- `Scroll(dir, amount)` - Scroll
- `Location()` - Get position

### Keyboard Operations
- `Type(text)` - Type text
- `KeyTap(key, mods...)` - Tap key
- `KeyToggle(key)` - Press/release
- `WriteAll(text)` - Clipboard write
- `ReadAll()` - Clipboard read

### Screen Operations
- `CaptureScreen(x, y, w, h)` - Capture region
- `CaptureImg()` - Capture to image
- `GetPixelColor(x, y)` - Get pixel color
- `GetScreenSize()` - Get screen dimensions
- `DisplaysNum()` - Number of displays

### Window Operations
- `FindIds(name)` - Find windows by name
- `ActiveName(name)` - Activate window
- `ActivePid(pid)` - Activate by PID
- `GetTitle()` - Get window title
- `PidExists(pid)` - Check process exists

### Bitmap/Image Operations
- `ToImage(bit)` - Convert bitmap
- `Save(img, path)` - Save image
- Find images using bitmap package

## Code Examples

### Example 1: Simple Automation

```go
package main

import (
    "github.com/go-vgo/robotgo"
)

func main() {
    robotgo.Move(100, 100)
    robotgo.Click("left")
    robotgo.Type("Hello World")
    robotgo.KeyTap("enter")
}
```

### Example 2: Image-Based Automation

```go
package main

import (
    "github.com/go-vgo/robotgo"
    "github.com/vcaesar/bitmap"
)

func main() {
    // Find image on screen
    template := bitmap.Open("button.png")
    x, y := bitmap.Find(template)
    
    if x > 0 || y > 0 {
        robotgo.Move(x, y)
        robotgo.Click()
    }
}
```

### Example 3: Event Monitoring

```go
package main

import (
    "fmt"
    hook "github.com/robotn/gohook"
)

func main() {
    events := hook.Start()
    defer hook.End()
    
    for ev := range events {
        fmt.Println("Event:", ev)
    }
}
```

## Permissions

### macOS
Grant these permissions in System Settings:
- **Accessibility**: Required for mouse/keyboard control
- **Screen Recording**: Required for screen capture

### Linux
Ensure X11 permissions allow input injection (usually automatic with X11)

### Windows
Run as administrator for best results (may be required for some operations)

## Safety Best Practices

1. **Add Delays**: Prevent overwhelming target applications
   ```go
   robotgo.KeySleep = 100
   robotgo.MouseSleep = 300
   ```

2. **Error Handling**: Always check errors
   ```go
   pids, err := robotgo.FindIds("app")
   if err != nil {
       // handle error
   }
   ```

3. **Cleanup**: Free resources
   ```go
   defer robotgo.FreeBitmap(bit)
   ```

4. **Secure Credentials**: Use environment variables for passwords

5. **Timeouts**: Implement timeouts to prevent infinite loops

## Package Dependencies

For full functionality, you may also need:

- **Bitmap operations**: `github.com/vcaesar/bitmap`
- **Image recognition**: `github.com/vcaesar/gcv` (OpenCV)
- **Event hooking**: `github.com/robotn/gohook`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Mouse not working | Grant Accessibility permissions (macOS) |
| Screen capture fails | Grant Screen Recording permissions |
| "png.h not found" | Install libpng-dev |
| Build fails | Install GCC and ensure PATH includes it |

## Resources

- [GitHub Repository](https://github.com/go-vgo/robotgo)
- [GoDoc](https://pkg.go.dev/github.com/go-vgo/robotgo)
- [Bitmap Package](https://github.com/vcaesar/bitmap)
- [OpenCV Wrapper](https://github.com/vcaesar/gcv)
- [Event Hook](https://github.com/robotn/gohook)

## Related Skills

For more advanced features, consider:
- **RobotGo Pro**: Commercial version with Wayland support and additional features
- **GoCV**: OpenCV bindings for Go (computer vision)

---

For detailed API documentation and advanced usage patterns, see the full SKILL.md documentation.