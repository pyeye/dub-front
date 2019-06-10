dev:
	docker run -d \
		-p 3000:3000 \
		-v /home/arthur/www/dubbel/src/frontend/:/srv/www/dubbel/src/frontend/ \
		--name vue-serve1 \
		--network dubbel \
		--add-host api.mydubbelsite.ru:192.168.1.130 \
		pyeye/dub-vue:latest \
		npm run dev

bash:
	docker run --rm -it \
		-v /home/arthur/www/dubbel/src/frontend/:/srv/www/dubbel/src/frontend/ \
		pyeye/dub-vue:latest \
		/bin/bash