package main

import (
	m "github.com/knightsofthe4th/krakyn"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var gClient *m.Client

type JSMessage struct {
	Server   string `json:"server"`
	Channel  string `json:"channel"`
	Username string `json:"username"`
	Encoding string `json:"encoding"`
	Data     string `json:"data"`
}

type JSChannel struct {
	Name     string      `json:"name"`
	Messages []JSMessage `json:"messages"`
}

type JSUsers struct {
	Server string   `json:"server"`
	Users  []string `json:"users"`
}

type JSServer struct {
	Name     string      `json:"name"`
	Channels []JSChannel `json:"channels"`
	Users    []string    `json:"users"`
}

func GenerateClient(user, pass, path string) error {
	cbx := &m.Callbacks{OnAccept: onServerAccept, OnRecieve: onGetMessage, OnRemove: onServerRemove}
	c, err := m.NewClient(cbx, user, pass, path)

	if err != nil {
		return err
	}

	gClient = c
	return nil
}

func onServerAccept(e *m.ServerEndpoint) {
	jss := &JSServer{
		Name:     e.Name,
		Channels: nil,
		Users:    nil,
	}

	for _, ch := range e.Channels {
		jss.Channels = append(jss.Channels, JSChannel{ch, nil})
	}

	runtime.EventsEmit(gAppContext, "AppendServer", jss)
}

func onServerRemove(e *m.ServerEndpoint) {
	runtime.EventsEmit(gAppContext, "RemoveServer", e.Name)
}

func onGetMessage(tm *m.Transmission, e *m.ServerEndpoint) {
	if tm.Type == m.MESSAGE_DATA {
		msg := m.Deserialise[m.MessageData](tm.Data)

		jsmsg := &JSMessage{
			Server:   e.Name,
			Channel:  msg.Channel,
			Username: msg.Sender,
			Encoding: msg.Encoding,
			Data:     string(msg.Data),
		}

		runtime.EventsEmit(gAppContext, "AppendMessage", jsmsg)

	} else if tm.Type == m.CLIENT_DATA {
		cd := m.Deserialise[m.ClientListData](tm.Data)

		jsu := &JSUsers{
			Server: e.Name,
			Users:  cd.Names,
		}

		runtime.EventsEmit(gAppContext, "UpdateUsers", jsu)
	}
}
