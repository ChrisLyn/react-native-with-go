	package main

	import (
		"fmt"
		"./twitch"
		"./db"
		"net/http"
		"encoding/json"
		"io/ioutil"
		"github.com/gorilla/mux"
	)

	// Data is a representation of a login
	type Data struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	type IsAuthen struct {
		IsAuthen bool `json:"isAuthen"`
	}

	func main() {
		fmt.Println("Booting the server...")

		//DB connection
		db.ConnectDB();

		// Configure a sample route
		r := mux.NewRouter()
		// r.HandleFunc("/login", loginFunc).Methods("POST")
		r.HandleFunc("/login", loginFunc)
		http.Handle("/", r)
		http.ListenAndServe(":8080", nil)
	}

	// myHandlerFunc - A sample handler function for the route /sample_route for your HTTP server
	func myHandlerFunc(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Recieved the following request: ", r.Body)
		twitch.DoSomething()

		// YOUR ROUTES LOGIC GOES HERE
		//
		// Feel free to structure your routing however you see fit, this is just an example to get you started.

	}

	func signUpFunc(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Received the following request ", r.Body)
		b, err := ioutil.ReadAll(r.Body);
		defer r.Body.Close()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		var msg Data
		err = json.Unmarshal(b, &msg)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		output, err := json.Marshal(msg)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.Header().Set("content-type", "application/json")
		w.Write(output)
	}

	func loginFunc(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)

		var login Data
		err := decoder.Decode(&login)
		if err != nil {
			panic(err)
		}
		
		w.Header().Set("Content-Type", "application/json")
		isAuth := db.IsAuthenticated(login.Username, login.Password)
		var payload IsAuthen
		payload.IsAuthen = isAuth;
		bytes, err := json.Marshal(payload)
		w.Write(bytes)
	}
