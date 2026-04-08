---
name: robotgo
description: Cross-platform desktop GUI automation using Go - keyboard/mouse control, screen capture, window management for RPA and testing
---

# RobotGo

A comprehensive skill for cross-platform desktop GUI automation using Go. RobotGo enables native keyboard/mouse control, screen capture, window management, and bitmap/image recognition for RPA (Robotic Process Automation), automated testing, and computer use applications.

## When to Use This Skill

Use this skill when:

- Building desktop automation scripts and RPA tools
- Creating automated UI testing frameworks
- Developing macro and scripting tools for repetitive tasks
- Implementing computer vision-based automation with image recognition
- Controlling other applications programmatically
- Capturing screenshots and analyzing screen content
- Managing window operations across applications

## What is RobotGo?

RobotGo is a Go native library that provides cross-platform GUI automation capabilities:

- **Mouse Control**: Move, click, drag, scroll with pixel-level precision
- **Keyboard Control**: Type text, simulate key combinations, hotkeys
- **Screen Operations**: Capture screens, find images, read pixels
- **Window Management**: Find windows, control focus, get window titles
- **Bitmap Operations**: Image recognition, template matching
- **Event Hooking**: Global keyboard and mouse event listeners

Supported platforms: macOS, Windows, Linux (X11), with arm64 and x86-amd64 architecture support.

## Installation

### Prerequisites

**All Platforms:**
- Go 1.11+
- GCC (C compiler)

**macOS:**
```bash
brew install go
xcode-select --install
```
Also enable Screen Recording and Accessibility in System Settings > Privacy & Security.

**Windows:**
```bash
winget install Golang.go
winget install MartinStorsjo.LLVM-MinGW.UCRT
```
Or install MinGW-w64 and add to system PATH.

**Linux (Ubuntu):**
```bash
sudo snap install go --classic
sudo apt install gcc libc6-dev
sudo apt install libx11-dev xorg-dev libxtst-dev
sudo apt install xsel xclip
sudo apt install libpng++-dev
```

### Install RobotGo

```bash
go get github.com/go-vgo/robotgo
```

Update to latest version:
```bash
go get -u github.com/go-vgo/robotgo
```

## Core Concepts

### Mouse Control

```go
import "github.com/go-vgo/robotgo"

// Move mouse to position
robotgo.Move(100, 100)

// Move relative to current position
robotgo.MoveRelative(0, -10)

// Smooth movement
robotgo.MoveSmooth(200, 300, 1.0, 10.0)

// Click mouse buttons
robotgo.Click("left")      // left click
robotgo.Click("right")    // right click
robotgo.Click("center")   // middle click
robotgo.Click("left", true) // double click

// Drag operations
robotgo.DragSmooth(100, 100)

// Scroll
robotgo.Scroll(0, -10)     // scroll up
robotgo.ScrollDir(10, "up") // scroll direction

// Toggle mouse button
robotgo.Toggle("left")
robotgo.Toggle("left", "up")

// Get current position
x, y := robotgo.Location()
```

### Keyboard Control

```go
// Type text
robotgo.Type("Hello World")

// Type with delay (0 = default, 1 = unicode)
robotgo.Type("こんにちは", 0, 1)

// Key tap combinations
robotgo.KeyTap("enter")
robotgo.KeyTap("i", "alt", "cmd")  // Ctrl+Alt+i

// Multiple modifiers
arr := []string{"alt", "cmd"}
robotgo.KeyTap("i", arr)

// Key toggle (press and release)
robotgo.KeyToggle("a")
robotgo.KeyToggle("a", "up")

// Clipboard operations
robotgo.WriteAll("Test")
text, err := robotgo.ReadAll()

// Set key sleep for delays
robotgo.KeySleep = 100
```

### Screen Operations

```go
// Get screen size
width, height := robotgo.GetScreenSize()

// Get mouse position color
color := robotgo.GetPixelColor(100, 200)

// Capture screen region
bit := robotgo.CaptureScreen(10, 10, 30, 30)
defer robotgo.FreeBitmap(bit)

// Capture to image
img, err := robotgo.CaptureImg()
robotgo.Save(img, "screenshot.png")

// Get display information
num := robotgo.DisplaysNum()
x, y, w, h := robotgo.GetDisplayBounds(0)
```

### Window Management

```go
// Find windows by name
pids, err := robotgo.FindIds("Google")

// Check if process exists
exists, err := robotgo.PidExists(100)

// Type to specific window
robotgo.Type("text", pid)

// Key tap in window
robotgo.KeyTap("a", pid, "cmd")

// Activate window by PID
robotgo.ActivePid(pid)

// Activate window by name
robotgo.ActiveName("chrome")

// Get window title
title := robotgo.GetTitle()

// Kill process
robotgo.Kill(pid)

// Show alert dialog
ok := robotgo.Alert("title", "message")
```

### Bitmap and Image Recognition

```go
// Capture screen to bitmap
bit := robotgo.CaptureScreen(10, 20, 30, 40)
defer robotgo.FreeBitmap(bit)

// Convert to image
img := robotgo.ToImage(bit)
robotgo.Save(img, "test.png")

// Find bitmap on screen (requires bitmap package)
import "github.com/vcaesar/bitmap"

bit2 := robotgo.ToCBitmap(robotgo.ImgToBitmap(img))
x, y := bitmap.Find(bit2)
robotgo.Move(x, y)

// Find all occurrences
arr := bitmap.FindAll(bit2)

// Open image file
bit = bitmap.Open("template.png")
```

### Event Hooking

```go
import hook "github.com/robotn/gohook"

// Register keyboard events
hook.Register(hook.KeyDown, []string{"q", "ctrl", "shift"}, func(e hook.Event) {
    fmt.Println("ctrl-shift-q pressed")
    hook.End()
})

// Start event listener
evChan := hook.Start()
defer hook.End()

for ev := range evChan {
    fmt.Println("hook:", ev)
}

// Add specific event
hook.AddEvents("q", "ctrl", "shift")
hook.AddEvent("k")
hook.AddEvent("mleft")
```

## Code Examples

### Example 1: Automated Form Filling

```go
package main

import (
    "github.com/go-vgo/robotgo"
)

func main() {
    // Wait for application to start
    robotgo.MilliSleep(500)
    
    // Find the application window
    pids, _ := robotgo.FindIds("MyApp")
    if len(pids) > 0 {
        // Activate the window
        robotgo.ActivePid(pids[0])
        robotgo.MilliSleep(200)
        
        // Fill form fields
        robotgo.Type("username")
        robotgo.KeyTap("tab")
        robotgo.Type("password")
        robotgo.KeyTap("enter")
    }
}
```

### Example 2: Screenshot and Image Search

```go
package main

import (
    "fmt"
    "github.com/go-vgo/robotgo"
    "github.com/vcaesar/bitmap"
)

func main() {
    // Capture screen
    screen := robotgo.CaptureScreen(0, 0, 1920, 1080)
    defer robotgo.FreeBitmap(screen)
    
    // Load template to find
    template := bitmap.Open("button.png")
    defer robotgo.FreeBitmap(template)
    
    // Find template on screen
    x, y := bitmap.Find(template)
    if x > 0 || y > 0 {
        fmt.Printf("Found at: %d, %d\n", x, y)
        robotgo.Move(x, y)
        robotgo.Click()
    }
}
```

### Example 3: Macro Recorder

```go
package main

import (
    "fmt"
    hook "github.com/robotn/gohook"
)

func main() {
    fmt.Println("Press ctrl+shift+q to stop")
    
    // Start listening for events
    events := hook.Start()
    defer hook.End()
    
    for ev := range events {
        // Record events to file or memory
        fmt.Printf("Key: %v, Type: %d, Raw: %d\n", 
            hook.KeyString(ev.Keycode), ev.Type, ev.Rawcode)
        
        // Check for stop condition
        if ev.Keycode == 16 && ev.Modifiers&4 != 0 { // q + ctrl
            break
        }
    }
}
```

### Example 4: Automated Testing Setup

```go
package main

import (
    "testing"
    "github.com/go-vgo/robotgo"
)

func TestLoginFlow(t *testing.T) {
    // Launch application
    // ... (start your app)
    
    robotgo.MilliSleep(1000)
    
    // Navigate to login
    robotgo.Click(100, 200) // coordinates of login button
    
    // Enter credentials
    robotgo.Type("testuser")
    robotgo.KeyTap("tab")
    robotgo.Type("password123")
    robotgo.KeyTap("enter")
    
    // Verify result
    robotgo.MilliSleep(500)
    title := robotgo.GetTitle()
    
    if title != "Dashboard" {
        t.Errorf("Expected Dashboard, got %s", title)
    }
}
```

## Safety Considerations

### 1. Accessibility Permissions

**macOS**: Grant Accessibility permissions in System Settings > Privacy & Security > Accessibility. Without this, RobotGo cannot control mouse/keyboard.

**Linux**: Ensure X11 permissions allow input injection.

### 2. Screen Recording Permissions

**macOS**: Grant Screen Recording permissions for screen capture features.

### 3. Secure Your Automation

- Never hardcode sensitive data (passwords, API keys) in automation scripts
- Use environment variables or secure vaults for credentials
- Implement timeouts to prevent infinite loops
- Add logging for audit trails

### 4. Rate Limiting

```go
// Add delays between actions
robotgo.KeySleep = 100
robotgo.MouseSleep = 300

// Or manually
for i := 0; i < 10; i++ {
    robotgo.Click()
    robotgo.MilliSleep(500) // prevent overwhelming target
}
```

### 5. Error Handling

```go
func safeClick(x, y int) {
    // Check bounds
    sx, sy := robotgo.GetScreenSize()
    if x < 0 || x > sx || y < 0 || y > sy {
        fmt.Println("Coordinates out of bounds")
        return
    }
    robotgo.Move(x, y)
    robotgo.Click()
}
```

### 6. Cleanup

```go
func cleanup(bit *robotgo.Bitmap) {
    if bit != nil {
        robotgo.FreeBitmap(bit)
    }
}
```

### 7. Multi-Monitor Considerations

```go
// Get number of displays
num := robotgo.DisplaysNum()

// Capture specific display
robotgo.DisplayID = 1
bit := robotgo.CaptureScreen(0, 0, width, height)

// Move to different screen
robotgo.Move(100, -200) // negative Y for second screen
```

### 8. Focus Management

Always verify window focus before sending input:

```go
// Activate specific window first
robotgo.ActiveName("TargetWindow")
robotgo.MilliSleep(100)
robotgo.Type("text") // now safe to type
```

## Troubleshooting

### "png.h: No such file or directory"
Install libpng development headers:
- Ubuntu: `sudo apt install libpng++-dev`
- macOS: Already included with X11
- Windows: Use prebuilt binaries

### Mouse/Keyboard not working (macOS)
1. Check System Settings > Privacy & Security > Accessibility
2. Ensure RobotGo is allowed
3. Check Screen Recording permissions

### "X11 not found" (Linux)
```bash
sudo apt install libx11-dev xorg-dev libxtst-dev
```

### Performance issues
- Reduce screen capture resolution
- Use smaller template images
- Add delays between actions
- Use relative movements instead of absolute

## Resources

- GitHub: https://github.com/go-vgo/robotgo
- GoDoc: https://pkg.go.dev/github.com/go-vgo/robotgo
- Bitmap package: https://github.com/vcaesar/bitmap
- OpenCV wrapper: https://github.com/vcaesar/gcv
- Event hook: https://github.com/robotn/gohook
- RobotGo Pro (commercial): https://github.com/vcaesar/robotgo-pro