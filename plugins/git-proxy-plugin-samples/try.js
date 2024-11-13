import { PushActionPlugin } from '@finos/git-proxy/plugin';
import { Step } from '@finos/git-proxy/proxy/actions';

async function logMessage(req, action) {
  const step = new Step('LogRequestPlugin');
  action.addStep(step);
  console.log(`LogRequestPlugin: req url ${req.url}`);
  console.log(`LogRequestPlugin: req user-agent ${req.header('User-Agent')}`);
  console.log('LogRequestPlugin: action', JSON.stringify(action));
  return action;
}

class LogRequestPlugin extends PushActionPlugin {
  constructor() {
    super(logMessage);
  }
}

// Exporting the plugins
export const hello = new PushActionPlugin(async (req, action) => {
  const step = new Step('HelloPlugin');
  action.addStep(step);
  console.log('Hello world from the hello plugin!');
  return action;
});

export const logRequest = new LogRequestPlugin();
