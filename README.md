# PDND-nteract

This is a branched (daf-\*) fork of [nteract](https://nteract.io), a react user interface on top of jupyter server. We have developed an integration of the API from [PDND - DAF](https://dataportal.daf.teamdigitale.it) (Piattaforma Digitale Nazionale Dati) for simplyfing the access to Italian public data inside notebook for data analysis. We are developing a set of UI components integrated into a set of API to **read**, **save** and **update** data into PDND - DAF. As in the image below

![search components](https://raw.githubusercontent.com/teamdigitale/nteract/daf-develop/pdnd-tutorials/img/search_with_logo.png)

the user can search dataset from [PDND - DAF](https://dataportal.daf.teamdigitale.it) load into a dataframe and starting working on it. The tool is very powerful and flexible and can be an easy way to start working on public dataset from italian administrations, making simple analysis and reports.

### Tutorials

Once installed on you local machine, you can read a simple [tutorial](https://github.com/teamdigitale/nteract/blob/daf-develop/pdnd-tutorials/pdnd-nteract-tutorial.md) for understanding the basic functionalities implemented. In the next releases we will provide more functionalities and tutorials. If you want to contribute with only suggestions use this repo, opening issues and following our [project](https://github.com/teamdigitale/nteract/projects) and [milestone](https://github.com/teamdigitale/nteract/milestones).


- [Video Tutorial](https://www.youtube.com/watch?v=nlZnYcz66YE)

## Getting Started

There are three ways to get you a copy of the project up and running on your local machine depending on your purpose:

- [Docker](#docker-installation) for a fast try (no data saved)
- [Install for data analyst](#install-for-data-analyst)
- [Install for contributing as developers](#install-for-contributing)

### Docker

Docker MUST be installed on your local machine

From [dockerhub](https://hub.docker.com/r/teamdigitale/daf-nteract)

```
docker pull teamdigitale/daf-nteract
docker run -p 8888:8888 teamdigitale/daf-nteract
```

or from your local build

```
git clone git@github.com:teamdigitale/daf-nteract.git
cd nteract
docker build -t pdnd-nteract .
docker run -p 8888:8888 pdnd-nteract
```

Save the token from the output of your console as:
http://(b4fd9e3ef290 or 127.0.0.1):8888/?token=XXXXXXXXXXXXXX
and open your browser at [http://localhost:8888]. If you are asked the token paste it.

### Install for data analyst

If you are a data scientist we have realeased  [pdnd-open-notebooks](https://github.com/teamdigitale/pdnd-open-notebooks) repository based on this work on nteract. It provides a ready to use datascience Docker with libraries for python, R and julia. 

Otherwise, you can use this repo as your favorite tool for anlysing Italian public dataset you can follow these steps:

Requires [Node.js](https://docs.npmjs.com/getting-started/installing-node), [yarn](https://yarnpkg.com/lang/en/docs/install/), [lerna](https://lernajs.io/) python 3 and pip on python 3. The following steps are for MacOs only but can be adjusted for different operating systems.

```
git clone git@github.com:teamdigitale/daf-nteract.git
cd nteract
pip3 install jupyter requests pandas fbprophet
npm install --global lerna
brew install yarn
yarn install
cd applications/jupyter-extension
pip3 install -e .
jupyter serverextension enable nteract_on_jupyter
lerna run build:asap --scope nteract-on-jupyter --stream
cd YOUR_LOCAL_FODER_TO_SAVE_OR_LOAD_NOTEBOOKS
jupyter nteract
```

### Install for contributing

If you want to contribute to the project, we suggest to follow the contrubuting guidelines of [nteract](https://nteract.io). We have public milestones and [project](https://github.com/teamdigitale/nteract/projects) on github for looking at our current work. Nteract is build using typescript react redux rx-js and is a very active project. If you are willing to work on such technolgies can be a really good start and we are very open to create a community around our integration.

Requires [Node.js](https://docs.npmjs.com/getting-started/installing-node), [yarn](https://yarnpkg.com/lang/en/docs/install/), [lerna](https://lernajs.io/) python 3 and pip on python 3. 

#### MacOS

```
git clone git@github.com:teamdigitale/daf-nteract.git
cd nteract
pip3 install jupyter requests pandas fbprophet
brew install yarn
yarn install
cd applications/jupyter-extension
pip3 install -e .
jupyter serverextension enable nteract_on_jupyter
cd YOUR_LOCAL_FODER_TO_SAVE_OR_LOAD_NOTEBOOKS
jupyter nteract --dev
```

#### Ubuntu or Debian
```
git clone git@github.com:teamdigitale/daf-nteract.git
cd nteract
pip3 install jupyter requests pandas fbprophet

# YARN INSTALLATION
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# NODEJS INSTALLATION
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

yarn install
cd applications/jupyter-extension
pip3 install -e .
jupyter serverextension enable nteract_on_jupyter
cd YOUR_LOCAL_FODER_TO_SAVE_OR_LOAD_NOTEBOOKS
jupyter nteract --dev
```

#### Windows
If you are on Windows 10, you can activate Ubuntu on the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/learn/modules/get-started-with-windows-subsystem-for-linux/) and follow the same steps as above.

Almost the main things developed are inside the [pdnd-nteract-packages](https://github.com/teamdigitale/nteract/tree/daf-develop/packages/pdnd-nteract-packages)