import commander from 'commander'
import init from './init'
import { LIB_VERSION } from './../../version'

export default function rplInitCommand() {
  const rplInitCommand = new commander.Command('init')

  rplInitCommand
    .description('Initialize a new Ripple project')
    .argument(
      '[template]',
      'Template to use - site or layer currently',
      process.cwd()
    )
    .argument(
      '[directory]',
      'The directory to init project into, defaults to the current working directory',
      process.cwd()
    )
    .requiredOption('--name [name]', 'The project name: eg: example-vic-gov-au')
    .option(
      '--rplVersion [rplVersion]',
      `The ripple version to use: eg: 2.1.0, default is most up to date version`,
      LIB_VERSION
    )
    .option(
      '--gitHubActions [gitHubActions]',
      `Add gitHub actions for CI workflow`,
      true
    )
    .action((template, directory, options) => {
      init(template, directory, options)
      console.info(`
        A new Ripple ${template} has been created in ${directory}.
        Run the following to get started:
          cd ${directory}
          npm install
          npm run dev
      `)
    })
  return rplInitCommand
}
