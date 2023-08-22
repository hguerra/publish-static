install_dependecies:
	sudo apt-get update --fix-missing
	sudo apt-get install -y build-essential libpq-dev
	wget -O miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-py39_4.10.3-Linux-x86_64.sh
	bash miniconda.sh
	rm -f miniconda.sh

conda_info:
	~/miniconda3/bin/conda info

conda_env_create:
	~/miniconda3/bin/conda env create -f environment.yml --quiet

conda_env_list:
	~/miniconda3/bin/conda env list

conda_init:
	~/miniconda3/bin/conda init bash
	~/miniconda3/bin/conda config --set auto_activate_base false

conda_activate:
	~/miniconda3/bin/conda activate geospatialservice

conda_deactivate:
	~/miniconda3/bin/conda deactivate

web_run:
	uvicorn app:app --reload

docker_up:
	docker-compose up -d

docker_down:
	docker-compose down

docker_prune:
	docker container prune -f
	docker volume prune -f

run:
	python main.py
