all: build

build:
	docker build -t skeeled/arena:0.0.1 .

push:
	docker push skeeled/arena:0.0.1