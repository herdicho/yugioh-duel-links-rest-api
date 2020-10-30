package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"gopkg.in/mgo.v2"
)

// DB struct for the purpose of database connection
type DB struct {
	session    *mgo.Session
	collection *mgo.Collection
}

func main() {
	// initiate database connection
	session, err := mgo.Dial("127.0.0.1")
	c := session.DB("YugiohDuelLinks").C("characters")
	db := &DB{session: session, collection: c}
	fmt.Println(db)

	if err != nil {
		panic(err)
	}

	defer session.Close()

	// create mux router
	r := mux.NewRouter()

	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1:8000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	fmt.Println("Server is running")
	log.Fatal(srv.ListenAndServe())
}
