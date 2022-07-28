# Install Ariflow on server with docker

### 개발환경

- OS : Ubuntu 22.04 LTS

### issue

- memory warning
	```
  airflow-local-airflow-init-1  | WARNING!!!: Not enough memory available for Docker.
  airflow-local-airflow-init-1  | At least 4GB of memory required. You have 3.9G
  airflow-local-airflow-init-1  | 
  airflow-local-airflow-init-1  | 
  airflow-local-airflow-init-1  | WARNING!!!: Not enough Disk space available for Docker.
  airflow-local-airflow-init-1  | At least 10 GBs recommended. You have 9.2G
  airflow-local-airflow-init-1  | 
  airflow-local-airflow-init-1  | 
  airflow-local-airflow-init-1  | WARNING!!!: You have not enough resources to run Airflow (see above)!
  airflow-local-airflow-init-1  | Please follow the instructions to increase amount of resources available:
  airflow-local-airflow-init-1  |    https://airflow.apache.org/docs/apache-airflow/stable/start/docker.html#before-you-begin
	```

- 메모리 할당을 증가시킬 필요가 있는가?

  권장 메모리는 8GB
  
  > Default amount of memory available for Docker on MacOS is often not enough to get Airflow up and running. If enough memory is not allocated, it might lead to airflow webserver continuously restarting. You should at least allocate 4GB memory for the Docker Engine __(ideally 8GB)__. You can check and change the amount of memory in Resources
  >
  > -[ariflow document](https://airflow.apache.org/docs/apache-airflow/stable/start/docker.html#before-you-begin)

### 참고문서

- [how to install and use docker on ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04)

- [how to install and use docker compose on ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04)

- [How to Run Airflow Locally With Docker](https://towardsdatascience.com/run-airflow-docker-1b83a57616fb)