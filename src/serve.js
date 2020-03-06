import { createServer } from 'http-server';
import portfinder from 'portfinder';
import opener from 'opener';
import chalk from 'chalk';

portfinder.basePort = 8080;

const getValidServerPort = async () => {
  return new Promise((resolve, reject) => {
    portfinder.getPort((error, port) => {
      if (error) {
        return reject(error);
      }
      resolve(port);
    });
  });
}

export async function serve(options) {
  console.log('serve', options);

  const validPort = await getValidServerPort();
  // const path = `${process.cwd()}/${options.path || 'public'}`;
  const server = new createServer({
    showDir: true
  });
  server.listen(validPort, '0.0.0.0', function () {
    const openUrl = `http://localhost:${validPort}`;
    console.log(`%s ${openUrl}`, chalk.green.bold('DONE'));
    opener(openUrl);
  });

  return true;
}
