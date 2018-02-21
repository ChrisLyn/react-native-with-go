package db

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"database/sql"
	"log"
)

func init() {
	fmt.Println("Initializing Connection...")
}

func ConnectDB() {
	fmt.Println("DB connectiing")
	db, err := sql.Open("mysql", "lin:admin@tcp(localhost:3306)/gawkbox")
	checkErr(err)

	rows, err := db.Query("SELECT * FROM user")
        checkErr(err)

	for rows.Next() {
		var username string
		var password string
		var role string
		err = rows.Scan(&username, &password, &role)
		checkErr(err)
	}
	fmt.Println("DB connected")
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func IsAuthenticated(username string, password string)(isAuthenticated bool) {
	db, err := sql.Open("mysql", "lin:admin@tcp(localhost:3306)/gawkbox")	
	if err != nil {
		log.Fatal(err)
	}
	rows, err := db.Query("select username, password from user where username = ? and password = ?", username, password)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	isAuthenticated = false
	for rows.Next() {
		err := rows.Scan(&username, &password)
		if err != nil {
			log.Fatal(err)
		}
		log.Println(username, password)
		isAuthenticated = true
	}
	// fmt.Println(result);
	return
}