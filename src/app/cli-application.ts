import { CliCommandInterface } from '../cli-command/cli-command.interface.js';

type ParsedCommand = {
  [key: string]: string[]
}

export default class CLIApplication {
  private commands: {[propertyName: string]: CliCommandInterface} = {};
  private defaultCommand = '--help';

  private parseCommand(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';
    for (const item of cliArguments) {
      if (item.startsWith('--')) {
        command = item;
        parsedCommand[command] = [];
      } else if (command && item) {
        parsedCommand[command].push(item);
      }
    }
    return parsedCommand;
  }

  public registerCommands(commandList: CliCommandInterface[]): void {
    this.commands = commandList.reduce((acc, Command) => {
      const cliCommand = Command;
      acc[cliCommand.name] = cliCommand;
      return acc;
    }, this.commands);
  }

  public getCommand(commandName: string): CliCommandInterface {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    console.log(parsedCommand);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }

}
