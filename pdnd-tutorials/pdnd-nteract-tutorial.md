
# Getting started tutorial

  
### Intro
We will go trought some simple steps playing with pdnd-nteract, only for describing the basic steps and functionalities. In the next weeks we hope to publish some interesting use cases that could be also used for teaching and education.

  

Of course you must have launched nteract from the daf-develop branch. In case read [here](https://github.com/teamdigitale/nteract/blob/daf-develop/pdnd-nteract.md)

  

Once launched nteract you can start a new python 3 notebook

From menu choose a markdown cell and write some markdown code.

  or choose a code cell and copy and paste the code below and run the cell
  ```
  a = 1 + 1
  a
  ```


Ok if it is working now you can register into [PDND](https://dataportal.daf.teamdigitale.it/#/register) or if you have already an account login in by click on the LOGIN button. 

![enter image description here](https://raw.githubusercontent.com/teamdigitale/nteract/daf-develop/pdnd-tutorials/img/login.png)

Import some python libraries
```
import requests
import pandas as pd
from io import StringIO
pd.options.display.html.table_schema = True
```

Once logged in, now you can search for Italian public datasets by clicking on the lens on the right of a new code cell. Try to look for *ricette* you will see something like that:



Run the cell and you should see something like that:

![enter image description here](https://raw.githubusercontent.com/teamdigitale/nteract/daf-develop/pdnd-tutorials/img/results.png)

Congratulations now you can play and analyse some different datasets. If you will do something interesting please contact us.