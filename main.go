package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:           "Krakyn Desktop",
		Width:           100,
		Height:          700,
		Assets:          assets,
		OnStartup:       app.startup,
		OnDomReady:      app.load,
		Frameless:       true,
		MinWidth:        1000,
		MinHeight:       700,
		CSSDragProperty: "--wails-draggable",
		CSSDragValue:    "drag",
		Bind: []interface{}{
			app,
		},

		Windows: &windows.Options{
			WebviewIsTransparent:              false,
			WindowIsTranslucent:               false,
			DisableWindowIcon:                 false,
			DisableFramelessWindowDecorations: false,
			WebviewUserDataPath:               "",
			Theme:                             windows.Dark,
			CustomTheme: &windows.ThemeSettings{
				DarkModeTitleBar:  windows.RGB(0, 0, 0),
				DarkModeTitleText: windows.RGB(255, 255, 255),
				DarkModeBorder:    windows.RGB(0, 0, 0),
			},
		},
	})

	if err != nil {
		println("Error:", err)
	}
}
