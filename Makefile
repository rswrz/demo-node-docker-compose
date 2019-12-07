image=hapi-swagger
container=$(image)
tag=latest
cmd=bash -c "npm install && npm run dev"
publish=3000:3000

build:
	podman build -t $(image):$(tag) .

run:
	podman run --name $(container) \
		--rm --detach \
		--publish $(publish) \
		--volume $(PWD)/app:/app \
		--volume $(container)-node_modules:/app/node_modules \
		$(image):$(tag) \
		$(cmd)

shell:
	podman exec --interactive --tty \
		$(container) bash

clean:
	podman stop $(container) || true
	podman rm -v $(container) || true
	podman volume rm $(container)-node_modules || true