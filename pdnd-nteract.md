# PDND-nteract

This is a branched (daf-*) fork of [nteract](https://nteract.io), a react user interface on top of jupyter server. We have developed an integration of the API from [PDND](https://dataportal.daf.teamdigitale.it) (Piattaforma Digitale Nazionale Dati) for simplyfing the access to Italian public data inside notebook for data analyst. 

## Getting Started

There are three ways to get you a copy of the project up and running on your local machine depending of your purpose:
* [Docker](#docker-installation) for a fast try (no data saved)
* [Install for data analyst](#install-for-data-analyst)
* [Install for contributing as developers](#install-for-contributing)


### Docker 

Docker MUST be installed on your local machine

```
git clone git@github.com:teamdigitale/nteract.git
cd nteract
git branch daf-develop
docker build -t pdnd-nteract .
docker run -p 8888:8888 pdnd-nteract
```

Save the token from the output of your console as:
http://(b4fd9e3ef290 or 127.0.0.1):8888/?token=XXXXXXXXXXXXXX
and open your browser at [http://localhost:8888]. If you are asked the token paste it.


### Install for data analyst

If you want to use this repo as your favorite tool for anlysing Italian public dataset you can follow these steps:

Requires [Node.js](https://docs.npmjs.com/getting-started/installing-node), [yarn](https://yarnpkg.com/lang/en/docs/install/), [lerna](https://lernajs.io/) python 3 and pip on python 3

```
git clone git@github.com:teamdigitale/nteract.git
cd nteract
git branch daf-develop
pip3 install jupyter requests pandas fbprophet
npm install --global lerna
yarn install
cd applications/jupyter-extension 
pip3 install -e .
jupyter serverextension enable nteract_on_jupyter
lerna run build:asap --scope nteract-on-jupyter --stream
cd YOUR_LOCAL_FODER_TO_SAVE_OR_LOAD_NOTEBOOKS
jupyter nteract
```

### Install for contributing

If you want to contribute to the project, we suggest to follow the contrubuting guidelines of [nteract](https://nteract.io). We have public milestones and [project](https://github.com/teamdigitale/nteract/projects) on github for look at our current work. Nteract is build using typescript react redux rx-js and is a very active project. If you are willing to working on such technolgies can be a really good start and we are very open to create a community around our integration. 

Requires [Node.js](https://docs.npmjs.com/getting-started/installing-node), [yarn](https://yarnpkg.com/lang/en/docs/install/), [lerna](https://lernajs.io/) python 3 and pip on python 3

```
git clone git@github.com:teamdigitale/nteract.git
cd nteract
git branch daf-develop
pip3 install jupyter requests pandas fbprophet
yarn install
cd applications/jupyter-extension 
pip3 install -e .
jupyter serverextension enable nteract_on_jupyter
cd YOUR_LOCAL_FODER_TO_SAVE_OR_LOAD_NOTEBOOKS
jupyter nteract --dev
```

Almost the main things developed are inside the [pdnd-nteract-packages](https://github.com/teamdigitale/nteract/tree/daf-develop/packages/pdnd-nteract-packages)







