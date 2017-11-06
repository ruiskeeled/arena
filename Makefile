all: build

build:
	docker build -t skeeled/arena:0.0.2 .

push:
	docker push skeeled/arena:0.0.2