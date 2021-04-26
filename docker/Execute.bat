@echo off

SET "runningA=false"
SET "runningB=false"

FOR /f %%i IN ('docker ps --filter "name=NodeJs_14.16.1" --format "{{.Status}}"') DO SET outputA=%%i
FOR /f %%i IN ('docker ps --filter "name=Apache_2.4.46" --format "{{.Status}}"') DO SET outputB=%%i

IF "%outputA%"=="" (
	docker start NodeJs_14.16.1

	SET "runningA=true"

	ECHO "Started."
)

IF "%outputB%"=="" (
	docker start Apache_2.4.46

	SET "runningB=true"

	ECHO "Started."
)

IF "%outputA%"=="Up" (
	IF "%outputB%"=="Up" (
		docker stop NodeJs_14.16.1

		SET "runningA=false"

		docker stop Apache_2.4.46

		SET "runningB=false"

		ECHO "Stopped."
	)
)

IF "%runningA%"=="false" (
	IF "%runningB%"=="false" (
		docker stop Php_7.4.16-fpm
		docker stop MySql_5.7
		docker stop PostgreSql_10.16
		docker stop Redis_6.2.1
		docker stop MongoDb_4.4.4
		docker stop Python_3.6.13

		ECHO "All stopped."
	)
)
