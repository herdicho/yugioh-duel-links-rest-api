package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// DB struct for the purpose of database connection
type DB struct {
	session    *mgo.Session
	collection *mgo.Collection
}

// Character struct for the purpose of query data from database
type Character struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Name      string        `json:"name" bson:"name"`
	World     string        `json:"world" bson:"world"`
	CurrentLV int           `json:"currentLv" bson:"currentLv"`
	MaxLV     int           `json:"maxLv" bson:"maxLv"`
	CharType  int           `json:"charType" bson:"charType"`
}

// Result struct for the purpose of send response from server
type Result struct {
	Code    int         `json:"code"`
	Payload interface{} `json:"payload"`
	Message string      `json:"message"`
}

// GemsSummary struct for the purpose of payload for gems summary
type GemsSummary struct {
	ObtainableGems int `json:"obtainableGems"`
	ObtainGems     int `json:"obtainGems"`
	AvailableGems  int `json:"availableGems"`
}

// GetAllCharacters function for get all of the characters from database
func (db *DB) GetAllCharacters(w http.ResponseWriter, r *http.Request) {
	var characters []Character
	err := db.collection.Find(bson.M{}).All(&characters)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		res := Result{
			Code:    200,
			Payload: characters,
			Message: "Success get all characters",
		}
		w.WriteHeader(http.StatusOK) // give http status (2xx / 3xx / 4xx / 5xx)
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(res)
		w.Write(response)
	}
}

// GetAllMaxLvCharacters function for get all of the characters from database that already on max lv
func (db *DB) GetAllMaxLvCharacters(w http.ResponseWriter, r *http.Request) {
	var characters []Character
	err := db.collection.Find(bson.M{
		"$expr": bson.M{
			"$eq": []string{"$maxLv", "$currentLv"},
		},
	}).All(&characters)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		res := Result{
			Code:    200,
			Payload: characters,
			Message: "Success get all character already on max lv",
		}
		w.WriteHeader(http.StatusOK) // give http status (2xx, 3xx, 4xx, 5xx)
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(res)
		w.Write(response)
	}
}

// GetAllCharactersByWorld function for get all character by world (url param world)
func (db *DB) GetAllCharactersByWorld(w http.ResponseWriter, r *http.Request) {
	// get slug parameter url and change to upper case
	vars := mux.Vars(r)
	world := strings.ToUpper(vars["world"])

	var characters []Character
	err := db.collection.Find(bson.M{"world": world}).Sort("-$natural").All(&characters) //Sort("-$natural") = sort descending (ambil database dari bawah)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		res := Result{
			Code:    200,
			Payload: characters,
			Message: "Success get all character from " + world + " world",
		}
		w.WriteHeader(http.StatusOK) // give http status (2xx, 3xx, 4xx, 5xx)
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(res)
		w.Write(response)
	}
}

// PostCharacter function for create (post) the new character
func (db *DB) PostCharacter(w http.ResponseWriter, r *http.Request) {
	/*header := w.Header()
	header.Add("Access-Control-Allow-Origin", "*")
	header.Add("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
	header.Add("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")*/

	var character Character
	postBody, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(postBody, &character)

	// Create a Hash ID to insert
	character.ID = bson.NewObjectId()
	err := db.collection.Insert(character)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		res := Result{
			Code:    200,
			Payload: character,
			Message: "Success create new character",
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated) // give http status (2xx, 3xx, 4xx, 5xx)
		response, _ := json.Marshal(res)
		w.Write(response)
	}
}

// DeleteCharacter function for delete character by id
func (db *DB) DeleteCharacter(w http.ResponseWriter, r *http.Request) {
	// get slug parameter url (id character to delete)
	vars := mux.Vars(r)
	id := vars["id"]

	var character Character
	db.collection.Find(bson.M{"_id": bson.ObjectIdHex(id)}).One(&character)
	err := db.collection.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		res := Result{
			Code:    200,
			Payload: character,
			Message: "Success delete character",
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK) // give http status (2xx, 3xx, 4xx, 5xx)
		response, _ := json.Marshal(res)
		w.Write(response)
	}
}

// UpdateCharacter function for update character
func (db *DB) UpdateCharacter(w http.ResponseWriter, r *http.Request) {
	// get slug parameter url (id character to update)
	vars := mux.Vars(r)
	id := vars["id"]

	var character Character
	putBody, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(putBody, &character)

	err := db.collection.Update(bson.M{"_id": bson.ObjectIdHex(id)}, bson.M{"$set": &character})
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		res := Result{
			Code:    200,
			Payload: character,
			Message: "Success update character",
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated) // give http status (2xx, 3xx, 4xx, 5xx)
		response, _ := json.Marshal(res)
		w.Write(response)
	}
}

// GetGemsSummary function for get all gems summary
func (db *DB) GetGemsSummary(w http.ResponseWriter, r *http.Request) {
	var characters []Character
	err := db.collection.Find(bson.M{}).All(&characters)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		gems := GemsSummary{
			ObtainableGems: calculateObtainableGems(characters),
			ObtainGems:     calculateObtainGems(characters),
			AvailableGems:  calculateObtainableGems(characters) - calculateObtainGems(characters),
		}
		res := Result{
			Code:    200,
			Payload: gems,
			Message: "Success get gems summary",
		}
		w.WriteHeader(http.StatusOK) // give http status (2xx / 3xx / 4xx / 5xx)
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(res)
		w.Write(response)
	}
}

// GetGemsSummaryByWorld function for get gems summary by world
func (db *DB) GetGemsSummaryByWorld(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	world := strings.ToUpper(vars["world"])

	var characters []Character
	err := db.collection.Find(bson.M{"world": world}).Sort("-$natural").All(&characters) //Sort("-$natural") = sort descending (ambil database dari bawah)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		gems := GemsSummary{
			ObtainableGems: calculateObtainableGems(characters),
			ObtainGems:     calculateObtainGems(characters),
			AvailableGems:  calculateObtainableGems(characters) - calculateObtainGems(characters),
		}
		res := Result{
			Code:    200,
			Payload: gems,
			Message: "Success get gems summary " + world + " world",
		}
		w.WriteHeader(http.StatusOK) // give http status (2xx / 3xx / 4xx / 5xx)
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(res)
		w.Write(response)
	}
}

func calculateObtainableGems(characters []Character) int {
	totalGems := 0
	for _, char := range characters {
		totalGems += calculateGemsByCharType(char.MaxLV, char.CharType)
	}
	return totalGems
}

func calculateObtainGems(characters []Character) int {
	totalGems := 0
	for _, char := range characters {
		totalGems += calculateGemsByCharType(char.CurrentLV, char.CharType)
	}
	return totalGems
}

func calculateGemsByCharType(curLv, charType int) int {
	// untuk type ke 5 (lv 31 - 45 masih dibuat default value 0)
	charType1 := [45]int{0, 10, 0, 0, 0, 15, 0, 0, 25, 0, 0, 35, 0, 0, 50, 0, 60, 0, 75, 0, 0, 100, 0, 120, 0, 150, 0, 200, 250, 300, 0, 200, 0, 250, 0, 0, 200, 0, 250, 0, 0, 100, 200, 250, 0}
	charType2 := [45]int{0, 10, 0, 0, 0, 15, 0, 0, 25, 0, 0, 35, 0, 0, 50, 0, 60, 0, 75, 0, 0, 100, 0, 120, 0, 150, 0, 200, 250, 0, 0, 200, 0, 250, 0, 0, 200, 0, 250, 0, 0, 100, 200, 250, 0}
	charType3 := [45]int{0, 0, 0, 0, 0, 0, 15, 0, 0, 30, 0, 40, 0, 0, 50, 0, 60, 0, 75, 0, 0, 100, 0, 120, 0, 150, 0, 200, 250, 300, 0, 200, 0, 250, 0, 0, 200, 0, 250, 0, 0, 100, 200, 250, 0}
	charType4 := [45]int{0, 10, 0, 10, 0, 15, 0, 0, 25, 0, 0, 35, 0, 0, 50, 0, 60, 0, 75, 0, 0, 100, 0, 120, 0, 140, 0, 200, 250, 0, 0, 200, 0, 250, 0, 0, 200, 0, 250, 0, 0, 100, 200, 250, 0}
	charType5 := [45]int{0, 5, 0, 10, 0, 15, 0, 0, 20, 0, 0, 35, 0, 0, 50, 0, 60, 0, 75, 0, 0, 100, 0, 120, 0, 150, 0, 200, 250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}

	totalGems := 0
	characterType := [45]int{}

	if charType == 1 {
		characterType = charType1
	} else if charType == 2 {
		characterType = charType2
	} else if charType == 3 {
		characterType = charType3
	} else if charType == 4 {
		characterType = charType4
	} else if charType == 5 {
		characterType = charType5
	}

	for i := 0; i <= curLv-1; i++ {
		totalGems += characterType[i]
	}

	return totalGems
}

func main() {
	// initiate database connection
	session, err := mgo.Dial("127.0.0.1")
	c := session.DB("YugiohDuelLinks").C("characters")
	db := &DB{session: session, collection: c}

	if err != nil {
		panic(err)
	}

	defer session.Close()

	// create mux router
	r := mux.NewRouter()
	// create handler API
	r.HandleFunc("/character", db.GetAllCharacters).Methods("GET")
	r.HandleFunc("/character-max-lv", db.GetAllMaxLvCharacters).Methods("GET")
	r.HandleFunc("/character-by-world/{world:[a-zA-Z0-9]*}", db.GetAllCharactersByWorld).Methods("GET")
	r.HandleFunc("/gems-summary", db.GetGemsSummary).Methods("GET")
	r.HandleFunc("/gems-summary/{world:[a-zA-Z0-9]*}", db.GetGemsSummaryByWorld).Methods("GET")
	r.HandleFunc("/character", db.PostCharacter).Methods("POST")
	r.HandleFunc("/character/{id:[a-zA-Z0-9]*}", db.DeleteCharacter).Methods("DELETE")
	r.HandleFunc("/character/{id:[a-zA-Z0-9]*}", db.UpdateCharacter).Methods("PUT")

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedHeaders([]string{"*"})
	log.Fatal(http.ListenAndServe(":8000", handlers.CORS(headers, methods, origins)(r)))
	fmt.Println("Server is running")
}
