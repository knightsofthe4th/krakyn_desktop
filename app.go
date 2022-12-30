package main

import (
	"context"

	m "github.com/knightsofthe4th/krakyn"
)

var gAppContext context.Context

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) load(ctx context.Context) {
	gAppContext = ctx
}

func (a *App) LoadProfile(user, key string) string {
	err := GenerateClient(user, key, "./"+user+".krakyn")

	if err != nil {
		return "error: " + err.Error()
	} else {
		return ""
	}
}

func (a *App) CreateProfile(user, key string) string {
	err := m.GenerateProfile(user, key, "./"+user+".krakyn")

	if err != nil {
		return "error: " + err.Error()
	}

	return ""
}

func (a *App) ServerConnect(addr string) string {
	err := gClient.Connect(addr)

	if err != nil {
		return "error: could not establish connection to server..."
	} else {
		return ""
	}

}

func (a *App) SendChat(server, channel, encoding, data string) string {
	if gClient == nil {
		return "error: core client is not active"
	}

	for _, s := range gClient.Servers {
		if server == s.Name {
			err := s.Transmit(m.NewTransmission(m.MESSAGE_DATA, &m.MessageData{"0", channel, encoding, []byte(data)}).Encrypt(s.SessionKey))

			if err != nil {
				return err.Error()
			}

			break
		}
	}

	return ""
}
