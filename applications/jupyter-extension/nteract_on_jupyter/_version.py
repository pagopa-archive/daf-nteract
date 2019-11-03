import json
import os

from . import PACKAGE_DIR

with open(os.path.join(PACKAGE_DIR, "package.json")) as f:
    packageJSON = json.load(f)
    __version__ = packageJSON['version']

    version_info = tuple(__version__.split('.'))
