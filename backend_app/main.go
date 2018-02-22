	package main

	import (
		"fmt"
		"./twitch"
		"./db"
		"net/http"
		"encoding/json"
		"github.com/gorilla/mux"
	)

	// Data is a representation of a login
	type Data struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// IsAuthen is representing authentication
	type IsAuthen struct {
		IsAuthen bool `json:"isAuthen"`
	}

	func main() {
		fmt.Println("Booting the server...")

		//DB connection
		db.ConnectDB();

		// Configure a sample route
		r := mux.NewRouter()
		r.HandleFunc("/login", loginFunc)
		r.HandleFunc("/twitch/token", tokenFunc)
		r.HandleFunc("/authorize", authFunc)
		http.Handle("/", r)
		http.ListenAndServe(":8080", nil)
	}

	func tokenFunc(w http.ResponseWriter, r *http.Request) {
		uri := twitch.GetRedirectUri()
		bytes, err := json.Marshal(string(uri))
		if err != nil { fmt.Println(err) }
		w.Header().Set("Content-Type", "application/json")
		w.Write(bytes)
	}

	func signUpFunc(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Received the following request ", r.Body)
		// Unfinished
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

	func authFunc(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		authToken := r.FormValue("code")
		content := twitch.StoreTokenAndFetchContent(authToken)
		w.Header().Set("Content-Type", "application/json")
		bytes, _ := json.Marshal([]string(content));
		w.Write(bytes)
	}
