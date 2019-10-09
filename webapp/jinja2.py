from __future__ import absolute_import  # Python 2 only
from jinja2 import Environment, Undefined, Template
from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import reverse

def environment(**options):
    env = Environment(**options)
    env.globals.update({
       'static': staticfiles_storage.url,
       'url': reverse,
    })
    env.undefined = SilentUndefined
    return env

## used to suppress the undefined errors for empty variables (_editable for example)
class SilentUndefined(Undefined):
    def _fail_with_undefined_error(self, *args, **kwargs):
        return ''