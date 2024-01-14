-include .creds

DOCKER_PW := ${DOCKER_PW}

BASEIMAGE := xycarto/wesm-data-viewer
IMAGE := $(BASEIMAGE):2024-01-09

RUN ?= docker run -it --rm  \
	-u $$(id -u):$$(id -g) \
	-e DISPLAY=$$DISPLAY \
	--env-file .creds \
	-e RUN= \
	-v$$(pwd):/work \
	--net=host \
	-w /work $(IMAGE)

##### WESM Indexing #####

ol-app:
	$(RUN) npm create ol-app site-dev

# make build-move indir=site-dev outdir=docs
# 
build-move:
	$(RUN) python3 src/build-move.py $(indir) $(outdir)

##### DOCKER #####

local-edit: Dockerfile
	docker run -it --rm --net=host \
	--user=$$(id -u):$$(id -g) \
	-e DISPLAY=$$DISPLAY \
	--env-file .creds \
	-e RUN= \
	-v$$(pwd):/work \
	-w /work \
	$(IMAGE)
	bash
	
docker-local: Dockerfile
	docker build --tag $(BASEIMAGE) - < $<  && \
	docker tag $(BASEIMAGE) $(IMAGE)

docker: Dockerfile
	echo $(DOCKER_PW) | docker login --username xycarto --password-stdin
	docker build --tag $(BASEIMAGE) - < $<  && \
	docker tag $(BASEIMAGE) $(IMAGE) && \
	docker push $(IMAGE)

docker-pull:
	docker pull $(IMAGE)