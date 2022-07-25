@echo off

SET "runningA=false"
SET "runningB=false"

FOR /f %%i IN ('docker ps --filter "name=NodeJs_16.15.0" --format "{{.Status}}"') DO SET outputA=%%i
FOR /f %%i IN ('docker ps --filter "name=Apache_2.4.53" --format "{{.Status}}"') DO SET outputB=%%i

IF "%outputA%"=="" (
	docker start NodeJs_16.15.0

	SET "runningA=true"

	ECHO "Started."
)

IF "%outputB%"=="" (
	docker start Apache_2.4.53

	SET "runningB=true"

	ECHO "Started."
)

IF "%outputA%"=="Up" (
	IF "%outputB%"=="Up" (
		docker stop NodeJs_16.15.0

		SET "runningA=false"

		docker stop Apache_2.4.53

		SET "runningB=false"

		ECHO "Stopped."
	)
)

IF "%runningA%"=="false" (
	IF "%runningB%"=="false" (
        docker stop Python_3.9.13
		docker stop Php_8.1.6-fpm
		docker stop MySql_5.7.38
		docker stop PostgreSql_14.3
		docker stop MongoDb_4.4.14
        docker stop Redis_7.0.0

		ECHO "All stopped."
	)
)
