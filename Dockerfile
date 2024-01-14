FROM ubuntu:22.04

ENV TZ Pacific/Auckland

RUN apt-get update
RUN apt-get install -y tzdata
RUN echo "Pacific/Auckland" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

RUN apt-get update &&  \
    apt-get install -y --no-install-recommends gnupg ca-certificates software-properties-common dirmngr wget \
    curl git-core libssl-dev libssh2-1-dev libcurl4-openssl-dev libxml2-dev && \
    apt upgrade --yes && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install GDAL
RUN apt-get update && \
	apt-get install -y gdal-bin libgdal-dev && \
    apt upgrade --yes && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN apt-get update && \
	apt-get install -y python3-pip

# Install Python packages
RUN pip3 install boto3 geopandas rasterio pyproj

RUN apt-get update && \
    apt-get install -y awscli
    
RUN pip3 install awscli --upgrade

RUN pip install --upgrade pip setuptools wheel

RUN pip3 install s3fs

RUN pip3 install laspy

