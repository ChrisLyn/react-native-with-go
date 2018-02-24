## Instructions to run backend service ##

### Install Golang dependencies ###

1. go get -u github.com/gorilla/mux
2. go get -u github.com/go-sql-driver/mysql

### Install MySQL locally ###

1. Add app user with username: `lin`, password: `admin`

    `CREATE USER 'lin'@'localhost' IDENTIFIED BY 'admin';`
    
2. Grant database access to app user: 

    `GRANT ALL PRIVILEGES ON *.* TO 'lin'@'localhost' IDENTIFIED BY 'admin';`
    
3. Insert one record:

    Create database: `create database gawkbox;`
    
    Create table: `create table user(name varchar(20), user varchar(20), role varchar(20));`
    
    Insert one record: `insert into user ("lin", "admin", "admin_role")`
    
### Run main.go ###

By run the following command to start the app:

`go run main.go`
