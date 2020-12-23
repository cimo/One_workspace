@echo off

SET "runningA=false"
SET "runningB=false"

FOR /f %%i IN ('docker ps --filter "name=NodeJs_12.18.1" --format "{{.Status}}"') DO SET outputA=%%i
FOR /f %%i IN ('docker ps --filter "name=Apache_2.4" --format "{{.Status}}"') DO SET outputB=%%i

IF "%outputA%"=="" (
	docker start NodeJs_12.18.1
	
	SET "runningA=true"

	ECHO "Started."
)

IF "%outputB%"=="" (
	docker start Apache_2.4

	SET "runningB=true"

	ECHO "Started."
)

IF "%outputA%"=="Up" (
	IF "%outputB%"=="Up" (
		docker stop NodeJs_12.18.1
		
		SET "runningA=false"

		docker stop Apache_2.4

		SET "runningB=false"
		
		ECHO "Stopped."
	)
)

IF "%runningA%"=="false" (
	IF "%runningB%"=="false" (
		docker stop Php_5.6-fpm
		docker stop Php_7.4-fpm
		docker stop MySql_5.6
		docker stop MySql_5.7
		docker stop PostgreSql_10.13
		docker stop Redis_6.0.9
		docker stop MongoDb_4.4.1
		
		ECHO "All stopped."
	)
)