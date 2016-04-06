import hook from 'text!./injected-script.js'
import serialiser from 'text!./serialiser.js'
import Comms from  './comms.js'

Comms('nflow-devtools-extension')
  .inject(hook)
  .inject(serialiser)
  .send('init')
